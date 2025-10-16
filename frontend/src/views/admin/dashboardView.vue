<template>
  <div class="dashboard-container">
    <!-- Header -->
    <div class="dashboard-header">
      <h1 class="dashboard-title">Administrasi Perpustakaan</h1>
    </div>

    <!-- Alert Notifications -->
    <div v-if="!hasBackupToday" class="alert alert-info">
      <div class="alert-content">
        <span class="alert-icon">ℹ️</span>
        <span class="alert-text">Hari ini Anda belum membuat cadangan basis data.</span>
        <button class="btn-alert" @click="createBackup">Cadangkan sekarang</button>
      </div>
    </div>

    <div v-if="overdueMembers > 0" class="alert alert-warning">
      <div class="alert-content">
        <span class="alert-icon">⚠️</span>
        <span class="alert-text">
          Saat ini ada <strong>{{ overdueMembers }}</strong> anggota perpustakaan yang memiliki keterlambatan. 
          Lihat modul <strong>Sirkulasi</strong> pada bagian <strong>Daftar Keterlambatan</strong> untuk informasi lebih lanjut
        </span>
      </div>
    </div>

    <!-- Statistics Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ formatNumber(stats.totalKoleksi) }}</div>
          <div class="stat-label">Total Koleksi</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ formatNumber(stats.totalEksemplar) }}</div>
          <div class="stat-label">Total Eksemplar</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ formatNumber(stats.dipinjamkan) }}</div>
          <div class="stat-label">Dipinjamkan</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ formatNumber(stats.tersedia) }}</div>
          <div class="stat-label">Tersedia</div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="charts-container">
      <!-- Transaksi Terkini -->
      <div class="chart-card">
        <h3 class="chart-title">Transaksi Terkini</h3>
        <div class="chart-wrapper">
          <canvas ref="transactionChart"></canvas>
        </div>
        <div class="chart-legend">
          <div class="legend-item">
            <span class="legend-color" style="background: #F4C430"></span>
            <span>Pinjam</span>
          </div>
          <div class="legend-item">
            <span class="legend-color" style="background: #00BCD4"></span>
            <span>Kembali</span>
          </div>
          <div class="legend-item">
            <span class="legend-color" style="background: #9C27B0"></span>
            <span>Perpanjang</span>
          </div>
        </div>
      </div>

      <!-- Ringkasan -->
      <div class="chart-card">
        <h3 class="chart-title">Ringkasan</h3>
        <div class="chart-wrapper">
          <canvas ref="summaryChart"></canvas>
        </div>
        <div class="summary-list">
          <div class="summary-item">
            <div class="summary-info">
              <span class="summary-dot" style="background: #E0E0E0"></span>
              <span class="summary-label">Total</span>
            </div>
            <span class="summary-value">{{ summary.total }}</span>
          </div>
          <div class="summary-item">
            <div class="summary-info">
              <span class="summary-dot" style="background: #2C64E3"></span>
              <span class="summary-label">Baru</span>
            </div>
            <span class="summary-value">{{ summary.baru }}</span>
          </div>
          <div class="summary-item">
            <div class="summary-info">
              <span class="summary-dot" style="background: #00BCD4"></span>
              <span class="summary-label">Kembali</span>
            </div>
            <span class="summary-value">{{ summary.kembali }}</span>
          </div>
          <div class="summary-item">
            <div class="summary-info">
              <span class="summary-dot" style="background: #4DB6AC"></span>
              <span class="summary-label">Perpanjang</span>
            </div>
            <span class="summary-value">{{ summary.perpanjang }}</span>
          </div>
          <div class="summary-item">
            <div class="summary-info">
              <span class="summary-dot" style="background: #F4C430"></span>
              <span class="summary-label">Keterlambatan</span>
            </div>
            <span class="summary-value">{{ summary.keterlambatan }}</span>
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

const hasBackupToday = ref(true); // Set based on your backup logic
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

// Methods
const fetchDashboardData = async () => {
  try {
    // Fetch books statistics
    const booksRes = await axios.get('http://localhost:5000/api/admin/books');
    const books = booksRes.data;
    
    stats.value.totalKoleksi = books.length;
    stats.value.totalEksemplar = books.reduce((sum, book) => sum + (book.stok || 0), 0);
    
    // Fetch peminjaman statistics
    const peminjamanRes = await axios.get('http://localhost:5000/api/admin/peminjaman');
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
    console.error('Error fetching dashboard data:', error);
  }
};

const fetchTransactionData = async () => {
  try {
    const res = await axios.get('http://localhost:5000/api/admin/peminjaman');
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
    const pengembalianRes = await axios.get('http://localhost:5000/api/admin/pengembalian');
    pengembalianRes.data.forEach(p => {
      const kembaliDate = p.tanggal_dikembalikan?.split('T')[0];
      const dayData = last7Days.find(d => d.date === kembaliDate);
      if (dayData) {
        dayData.kembali++;
      }
    });
    
    transactionData.value = last7Days;
    
  } catch (error) {
    console.error('Error fetching transaction data:', error);
  }
};

const fetchSummaryData = async (peminjaman) => {
  try {
    const pengembalianRes = await axios.get('http://localhost:5000/api/admin/pengembalian');
    const pengembalian = pengembalianRes.data;
    
    summary.value.baru = peminjaman.filter(p => p.status === 'Dipinjam').length;
    summary.value.kembali = pengembalian.length;
    summary.value.perpanjang = 0; // Add logic if you track renewals
    summary.value.keterlambatan = peminjaman.filter(p => p.status === 'Terlambat').length;
    summary.value.total = summary.value.baru + summary.value.kembali + 
                          summary.value.perpanjang + summary.value.keterlambatan;
    
  } catch (error) {
    console.error('Error fetching summary data:', error);
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

<style scoped>
.dashboard-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  background: #ffffff;
  min-height: 100vh;
}

/* Header */
.dashboard-header {
  margin-bottom: 2rem;
}

.dashboard-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

/* Alerts */
.alert {
  padding: 1rem 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.alert-info {
  background: #D1ECF1;
  border: 1px solid #BEE5EB;
}

.alert-warning {
  background: #FFF3CD;
  border: 1px solid #FFEAA7;
}

.alert-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.alert-icon {
  font-size: 1.5rem;
}

.alert-text {
  flex: 1;
  color: #1a1a1a;
  line-height: 1.5;
}

.btn-alert {
  padding: 0.5rem 1.25rem;
  background: #2C64E3;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-alert:hover {
  background: #1e4bb8;
  transform: translateY(-2px);
}

/* Statistics Cards */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.stat-icon {
  width: 60px;
  height: 60px;
  background: #f3f4f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  flex-shrink: 0;
}

.stat-icon svg {
  width: 30px;
  height: 30px;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.95rem;
  color: #6b7280;
  font-weight: 500;
}

/* Charts */
.charts-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
}

.chart-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #e5e7eb;
}

.chart-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 1.5rem 0;
}

.chart-wrapper {
  height: 300px;
  margin-bottom: 1rem;
}

.chart-legend {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #4b5563;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 3px;
}

/* Summary List */
.summary-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
}

.summary-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.summary-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.summary-label {
  font-size: 0.95rem;
  color: #4b5563;
}

.summary-value {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a1a1a;
}

/* Responsive */
@media (max-width: 1024px) {
  .charts-container {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 1rem;
  }

  .dashboard-title {
    font-size: 1.5rem;
  }

  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }

  .stat-card {
    padding: 1rem;
  }

  .stat-icon {
    width: 50px;
    height: 50px;
  }

  .stat-value {
    font-size: 1.5rem;
  }

  .alert-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .btn-alert {
    width: 100%;
  }
}
</style>