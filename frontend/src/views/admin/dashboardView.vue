<template>
  <div class="max-w-[1400px] mx-auto p-8 bg-white min-h-screen">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-4xl font-bold text-[#1a1a1a] m-0">Administrasi Perpustakaan</h1>
    </div>

    <!-- Alert Notifications -->
    <div v-if="!hasBackupToday" class="p-4 px-6 rounded-lg mb-6 bg-[#D1ECF1] border border-[#BEE5EB]">
      <div class="flex items-center gap-4 flex-wrap">
        <span class="text-2xl">ℹ️</span>
        <span class="flex-1 text-[#1a1a1a] leading-relaxed">Hari ini Anda belum membuat cadangan basis data.</span>
        <button 
          @click="createBackup" 
          class="px-5 py-2 bg-[#2C64E3] text-white rounded-md font-semibold hover:bg-[#1e4bb8] transform hover:-translate-y-0.5 transition-all duration-300"
        >
          Cadangkan sekarang
        </button>
      </div>
    </div>

    <div v-if="overdueMembers > 0" class="p-4 px-6 rounded-lg mb-6 bg-[#FFF3CD] border border-[#FFEAA7]">
      <div class="flex items-center gap-4 flex-wrap">
        <span class="text-2xl">⚠️</span>
        <span class="flex-1 text-[#1a1a1a] leading-relaxed">
          Saat ini ada <strong>{{ overdueMembers }}</strong> anggota perpustakaan yang memiliki keterlambatan. 
          Lihat modul <strong>Sirkulasi</strong> pada bagian <strong>Daftar Keterlambatan</strong> untuk informasi lebih lanjut
        </span>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-xl p-6 flex items-center gap-6 shadow-sm border border-[#e5e7eb] transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
        <div class="w-15 h-15 bg-[#f3f4f6] rounded-full flex items-center justify-center text-[#9ca3af] flex-shrink-0">
          <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
        </div>
        <div class="flex-1">
          <div class="text-4xl font-bold text-[#1a1a1a] leading-none mb-2">{{ formatNumber(stats.totalKoleksi) }}</div>
          <div class="text-[0.95rem] text-[#6b7280] font-medium">Total Koleksi</div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-6 flex items-center gap-6 shadow-sm border border-[#e5e7eb] transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
        <div class="w-15 h-15 bg-[#f3f4f6] rounded-full flex items-center justify-center text-[#9ca3af] flex-shrink-0">
          <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
        </div>
        <div class="flex-1">
          <div class="text-4xl font-bold text-[#1a1a1a] leading-none mb-2">{{ formatNumber(stats.totalEksemplar) }}</div>
          <div class="text-[0.95rem] text-[#6b7280] font-medium">Total Eksemplar</div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-6 flex items-center gap-6 shadow-sm border border-[#e5e7eb] transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
        <div class="w-15 h-15 bg-[#f3f4f6] rounded-full flex items-center justify-center text-[#9ca3af] flex-shrink-0">
          <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
        </div>
        <div class="flex-1">
          <div class="text-4xl font-bold text-[#1a1a1a] leading-none mb-2">{{ formatNumber(stats.dipinjamkan) }}</div>
          <div class="text-[0.95rem] text-[#6b7280] font-medium">Dipinjamkan</div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-6 flex items-center gap-6 shadow-sm border border-[#e5e7eb] transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
        <div class="w-15 h-15 bg-[#f3f4f6] rounded-full flex items-center justify-center text-[#9ca3af] flex-shrink-0">
          <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <div class="flex-1">
          <div class="text-4xl font-bold text-[#1a1a1a] leading-none mb-2">{{ formatNumber(stats.tersedia) }}</div>
          <div class="text-[0.95rem] text-[#6b7280] font-medium">Tersedia</div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Transaksi Terkini -->
      <div class="bg-white rounded-xl p-6 shadow-sm border border-[#e5e7eb]">
        <h3 class="text-xl font-semibold text-[#1a1a1a] mb-6">Transaksi Terkini</h3>
        <div class="h-[300px] mb-4">
          <canvas ref="transactionChart"></canvas>
        </div>
        <div class="flex gap-6 justify-center flex-wrap pt-4 border-t border-[#e5e7eb]">
          <div class="flex items-center gap-2 text-sm text-[#4b5563]">
            <span class="w-4 h-4 rounded bg-[#F4C430]"></span>
            <span>Pinjam</span>
          </div>
          <div class="flex items-center gap-2 text-sm text-[#4b5563]">
            <span class="w-4 h-4 rounded bg-[#00BCD4]"></span>
            <span>Kembali</span>
          </div>
          <div class="flex items-center gap-2 text-sm text-[#4b5563]">
            <span class="w-4 h-4 rounded bg-[#9C27B0]"></span>
            <span>Perpanjang</span>
          </div>
        </div>
      </div>

      <!-- Ringkasan -->
      <div class="bg-white rounded-xl p-6 shadow-sm border border-[#e5e7eb]">
        <h3 class="text-xl font-semibold text-[#1a1a1a] mb-6">Ringkasan</h3>
        <div class="h-[300px] mb-4">
          <canvas ref="summaryChart"></canvas>
        </div>
        <div class="flex flex-col gap-3 pt-4 border-t border-[#e5e7eb]">
          <div class="flex justify-between items-center py-2">
            <div class="flex items-center gap-3">
              <span class="w-3 h-3 rounded-full bg-[#E0E0E0] flex-shrink-0"></span>
              <span class="text-[0.95rem] text-[#4b5563]">Total</span>
            </div>
            <span class="text-lg font-semibold text-[#1a1a1a]">{{ summary.total }}</span>
          </div>
          <div class="flex justify-between items-center py-2">
            <div class="flex items-center gap-3">
              <span class="w-3 h-3 rounded-full bg-[#2C64E3] flex-shrink-0"></span>
              <span class="text-[0.95rem] text-[#4b5563]">Baru</span>
            </div>
            <span class="text-lg font-semibold text-[#1a1a1a]">{{ summary.baru }}</span>
          </div>
          <div class="flex justify-between items-center py-2">
            <div class="flex items-center gap-3">
              <span class="w-3 h-3 rounded-full bg-[#00BCD4] flex-shrink-0"></span>
              <span class="text-[0.95rem] text-[#4b5563]">Kembali</span>
            </div>
            <span class="text-lg font-semibold text-[#1a1a1a]">{{ summary.kembali }}</span>
          </div>
          <div class="flex justify-between items-center py-2">
            <div class="flex items-center gap-3">
              <span class="w-3 h-3 rounded-full bg-[#4DB6AC] flex-shrink-0"></span>
              <span class="text-[0.95rem] text-[#4b5563]">Perpanjang</span>
            </div>
            <span class="text-lg font-semibold text-[#1a1a1a]">{{ summary.perpanjang }}</span>
          </div>
          <div class="flex justify-between items-center py-2">
            <div class="flex items-center gap-3">
              <span class="w-3 h-3 rounded-full bg-[#F4C430] flex-shrink-0"></span>
              <span class="text-[0.95rem] text-[#4b5563]">Keterlambatan</span>
            </div>
            <span class="text-lg font-semibold text-[#1a1a1a]">{{ summary.keterlambatan }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import Chart from 'chart.js/auto';

// 🔴 Ambil API Base dari environment variable
const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

// 🔴 Function untuk mendapatkan config dengan Authorization header
const getAuthConfig = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

// State
const stats = ref({
  totalKoleksi: 0,
  totalEksemplar: 0,
  dipinjamkan: 0,
  tersedia: 0
});

const transactionData = ref([]);
const summary = ref({
  total: 0,
  baru: 0,
  kembali: 0,
  perpanjang: 0,
  keterlambatan: 0
});

const hasBackupToday = ref(true);
const overdueMembers = ref(0);

// Chart refs
const transactionChart = ref(null);
const summaryChart = ref(null);
let transactionChartInstance = null;
let summaryChartInstance = null;

// Computed
const formatNumber = (num) => {
  return num.toLocaleString('id-ID');
};

// 🔴 Error handler untuk unauthorized
const handleUnauthorized = (error) => {
  if (error.response?.status === 401 || error.response?.status === 403) {
    console.error('⚠️ Unauthorized - Token invalid atau expired');
    localStorage.removeItem('token');
    // Optional: redirect ke login
    // window.location.href = '/login';
  }
};

// Methods
const fetchDashboardData = async () => {
  try {
    // Fetch books statistics
    const booksRes = await axios.get(`${apiBase}/api/admin/books`, getAuthConfig());
    const books = booksRes.data;
    
    stats.value.totalKoleksi = books.length;
    stats.value.totalEksemplar = books.reduce((sum, book) => sum + (book.stok || 0), 0);
    
    // Fetch peminjaman statistics
    const peminjamanRes = await axios.get(`${apiBase}/api/admin/peminjaman`, getAuthConfig());
    const peminjaman = peminjamanRes.data;
    
    stats.value.dipinjamkan = peminjaman.filter(p => p.status === 'Dipinjam').length;
    stats.value.tersedia = stats.value.totalEksemplar - stats.value.dipinjamkan;
    
    // Calculate overdue members
    const today = new Date();
    overdueMembers.value = peminjaman.filter(p => {
      if (p.status === 'Dipinjam' && p.tanggal_kembali) {
        const returnDate = new Date(p.tanggal_kembali);
        return returnDate < today;
      }
      return false;
    }).length;
    
    // Fetch transaction data for chart (last 7 days)
    await fetchTransactionData();
    
    // Fetch summary data
    await fetchSummaryData(peminjaman);
    
  } catch (error) {
    console.error('❌ Error fetching dashboard data:', error);
    handleUnauthorized(error);
  }
};

const fetchTransactionData = async () => {
  try {
    const res = await axios.get(`${apiBase}/api/admin/peminjaman`, getAuthConfig());
    const peminjaman = res.data;
    
    // Get last 7 days
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      last7Days.push({
        date: date.toISOString().split('T')[0],
        label: `${date.getDate()}/${date.getMonth() + 1}`,
        pinjam: 0,
        kembali: 0,
        perpanjang: 0
      });
    }
    
    // Count transactions per day
    peminjaman.forEach(p => {
      const pinjamDate = p.tanggal_pinjam?.split('T')[0];
      const dayData = last7Days.find(d => d.date === pinjamDate);
      if (dayData) {
        dayData.pinjam++;
      }
    });
    
    // Get pengembalian data
    const pengembalianRes = await axios.get(`${apiBase}/api/admin/pengembalian`, getAuthConfig());
    pengembalianRes.data.forEach(p => {
      const kembaliDate = p.tanggal_dikembalikan?.split('T')[0];
      const dayData = last7Days.find(d => d.date === kembaliDate);
      if (dayData) {
        dayData.kembali++;
      }
    });
    
    transactionData.value = last7Days;
    
  } catch (error) {
    console.error('❌ Error fetching transaction data:', error);
    handleUnauthorized(error);
  }
};

const fetchSummaryData = async (peminjaman) => {
  try {
    const pengembalianRes = await axios.get(`${apiBase}/api/admin/pengembalian`, getAuthConfig());
    const pengembalian = pengembalianRes.data;
    
    summary.value.baru = peminjaman.filter(p => p.status === 'Dipinjam').length;
    summary.value.kembali = pengembalian.length;
    summary.value.perpanjang = 0; // Add logic if you track renewals
    summary.value.keterlambatan = peminjaman.filter(p => p.status === 'Terlambat').length;
    summary.value.total = summary.value.baru + summary.value.kembali + 
                          summary.value.perpanjang + summary.value.keterlambatan;
    
  } catch (error) {
    console.error('❌ Error fetching summary data:', error);
    handleUnauthorized(error);
  }
};

const createTransactionChart = () => {
  if (!transactionChart.value) return;
  
  const ctx = transactionChart.value.getContext('2d');
  
  if (transactionChartInstance) {
    transactionChartInstance.destroy();
  }
  
  transactionChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: transactionData.value.map(d => d.label),
      datasets: [
        {
          label: 'Pinjam',
          data: transactionData.value.map(d => d.pinjam),
          backgroundColor: '#F4C430',
          borderRadius: 4,
          barThickness: 40
        },
        {
          label: 'Kembali',
          data: transactionData.value.map(d => d.kembali),
          backgroundColor: '#00BCD4',
          borderRadius: 4,
          barThickness: 40
        },
        {
          label: 'Perpanjang',
          data: transactionData.value.map(d => d.perpanjang),
          backgroundColor: '#9C27B0',
          borderRadius: 4,
          barThickness: 40
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          }
        },
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          },
          grid: {
            color: '#f0f0f0'
          }
        }
      }
    }
  });
};

const createSummaryChart = () => {
  if (!summaryChart.value) return;
  
  const ctx = summaryChart.value.getContext('2d');
  
  if (summaryChartInstance) {
    summaryChartInstance.destroy();
  }
  
  summaryChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Total', 'Baru', 'Kembali', 'Perpanjang', 'Keterlambatan'],
      datasets: [{
        data: [
          summary.value.total - summary.value.baru - summary.value.kembali - 
          summary.value.perpanjang - summary.value.keterlambatan,
          summary.value.baru,
          summary.value.kembali,
          summary.value.perpanjang,
          summary.value.keterlambatan
        ],
        backgroundColor: ['#E0E0E0', '#2C64E3', '#00BCD4', '#4DB6AC', '#F4C430'],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '70%',
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          enabled: true
        }
      }
    }
  });
};

const createBackup = () => {
  // Implement backup logic
  alert('Memulai backup database...');
  hasBackupToday.value = true;
};

// Lifecycle
onMounted(async () => {
  await fetchDashboardData();
  setTimeout(() => {
    createTransactionChart();
    createSummaryChart();
  }, 100);
});
</script>