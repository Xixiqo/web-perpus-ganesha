<template>
  <div class="max-w-[1400px] mx-auto p-8 bg-white min-h-screen">
    <!-- Header dengan animasi fade in -->
    <div class="mb-8 animate-fade-in">
      <h1 class="text-4xl font-bold text-[#1a1a1a] m-0">Administrasi Perpustakaan</h1>
    </div>

    <!-- Alert Notifications dengan slide down -->
    <div 
      v-if="!hasBackupToday" 
      class="p-4 px-6 rounded-lg mb-6 bg-[#D1ECF1] border border-[#BEE5EB] animate-slide-down"
    >
      <div class="flex items-center gap-4 flex-wrap">
        <span class="text-2xl animate-bounce-subtle">ℹ️</span>
        <span class="flex-1 text-[#1a1a1a] leading-relaxed">Hari ini Anda belum membuat cadangan basis data.</span>
        <button 
          @click="createBackup" 
          class="px-5 py-2 bg-[#2C64E3] text-white rounded-md font-semibold hover:bg-[#1e4bb8] transform hover:scale-105 transition-all duration-300"
        >
          Cadangkan sekarang
        </button>
      </div>
    </div>

    <div 
      v-if="overdueMembers > 0" 
      class="p-4 px-6 rounded-lg mb-6 bg-[#FFF3CD] border border-[#FFEAA7] animate-slide-down"
      style="animation-delay: 100ms"
    >
      <div class="flex items-center gap-4 flex-wrap">
        <span class="text-2xl animate-pulse">⚠️</span>
        <span class="flex-1 text-[#1a1a1a] leading-relaxed">
          Saat ini ada <strong>{{ overdueMembers }}</strong> anggota perpustakaan yang memiliki keterlambatan. 
          Lihat modul <strong>Sirkulasi</strong> pada bagian <strong>Daftar Keterlambatan</strong> untuk informasi lebih lanjut
        </span>
      </div>
    </div>

    <!-- Statistics Cards dengan stagger animation -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div 
        v-for="(card, index) in statsCards" 
        :key="index"
        class="bg-white rounded-xl p-6 flex items-center gap-6 shadow-sm border border-[#e5e7eb] transition-all duration-500 hover:-translate-y-2 hover:shadow-xl opacity-0 animate-fade-in cursor-pointer"
        :style="{ animationDelay: `${index * 150}ms` }"
      >
        <div class="w-15 h-15 bg-gradient-to-br from-[#f3f4f6] to-[#e5e7eb] rounded-full flex items-center justify-center text-[#9ca3af] flex-shrink-0 transition-transform duration-300 hover:rotate-12 hover:scale-110">
          <svg class="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" v-html="card.icon"></svg>
        </div>
        <div class="flex-1">
          <div class="text-4xl font-bold text-[#1a1a1a] leading-none mb-2 transition-all duration-300 hover:text-[#2C64E3]">
            {{ formatNumber(card.value) }}
          </div>
          <div class="text-[0.95rem] text-[#6b7280] font-medium">{{ card.label }}</div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#2C64E3]"></div>
      <p class="mt-4 text-[#6b7280]">Memuat data...</p>
    </div>

    <!-- Charts Section dengan fade & slide -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Transaksi Terkini - Line Chart -->
      <div class="bg-white rounded-xl p-6 shadow-sm border border-[#e5e7eb] opacity-0 animate-fade-in" style="animation-delay: 600ms">
        <h3 class="text-xl font-semibold text-[#1a1a1a] mb-6">Transaksi Terkini (7 Hari)</h3>
        <div class="h-[300px] mb-4">
          <canvas ref="transactionChart"></canvas>
        </div>
        <div class="flex gap-6 justify-center flex-wrap pt-4 border-t border-[#e5e7eb]">
          <div class="flex items-center gap-2 text-sm text-[#4b5563] transition-all duration-300 hover:scale-110 cursor-pointer">
            <span class="w-4 h-4 rounded bg-[#F4C430] animate-pulse-subtle"></span>
            <span>Pinjam</span>
          </div>
          <div class="flex items-center gap-2 text-sm text-[#4b5563] transition-all duration-300 hover:scale-110 cursor-pointer">
            <span class="w-4 h-4 rounded bg-[#00BCD4] animate-pulse-subtle" style="animation-delay: 200ms"></span>
            <span>Kembali</span>
          </div>
          <div class="flex items-center gap-2 text-sm text-[#4b5563] transition-all duration-300 hover:scale-110 cursor-pointer">
            <span class="w-4 h-4 rounded bg-[#9C27B0] animate-pulse-subtle" style="animation-delay: 400ms"></span>
            <span>Perpanjang</span>
          </div>
        </div>
      </div>

      <!-- Kategori Populer - Horizontal Bar Chart -->
      <div class="bg-white rounded-xl p-6 shadow-sm border border-[#e5e7eb] opacity-0 animate-fade-in" style="animation-delay: 1050ms">
        <h3 class="text-xl font-semibold text-[#1a1a1a] mb-6">Kategori Populer</h3>
        <div class="h-[300px] mb-4">
          <canvas ref="categoryChart"></canvas>
        </div>
        <div class="flex gap-4 justify-center flex-wrap pt-4 border-t border-[#e5e7eb]">
          <div 
            v-for="(cat, index) in categoryData" 
            :key="index"
            class="px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-110 cursor-pointer opacity-0 animate-fade-in"
            :style="{ 
              backgroundColor: categoryColors[index] + '20', 
              color: categoryColors[index],
              animationDelay: `${1200 + index * 100}ms`
            }"
          >
            {{ cat.label }}: {{ cat.count }}
          </div>
        </div>
      </div>

      <!-- Buku Terbaru -->
      <div class="bg-white rounded-xl p-6 shadow-sm border border-[#e5e7eb] opacity-0 animate-fade-in" style="animation-delay: 750ms">
        <h3 class="text-xl font-semibold text-[#1a1a1a] mb-6">5 Buku Terbaru</h3>
        <div class="space-y-4 max-h-[350px] overflow-y-auto pr-2">
          <div 
            v-for="(book, index) in latestBooks" 
            :key="book.id"
            class="flex gap-4 p-3 rounded-lg transition-all duration-300 hover:bg-[#f9fafb] cursor-pointer opacity-0 animate-fade-in border border-transparent hover:border-[#e5e7eb]"
            :style="{ animationDelay: `${800 + index * 100}ms` }"
          >
            <div class="w-16 h-20 flex-shrink-0 rounded overflow-hidden bg-[#f3f4f6] border border-gray-200 shadow-sm">
              <img 
                v-if="book.cover"
                :src="getCoverUrl(book.cover)"
                :alt="book.judul"
                class="w-full h-full object-cover"
                @error="($event) => $event.target.src = '/default_cover.png'"
              />
              <div v-else class="w-full h-full flex items-center justify-center">
                <svg class="w-8 h-8 text-[#0a0b0c]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <h4 class="font-semibold text-[#1a1a1a] text-sm mb-1 truncate">{{ book.judul }}</h4>
              <p class="text-xs text-[#6b7280] mb-1 truncate">{{ book.pembuat }}</p>
              <div class="flex items-center gap-2">
                <span class="text-xs px-2 py-1 rounded-full bg-[#2C64E3]/10 text-[#2C64E3] font-medium">
                  {{ book.kategori || 'Umum' }}
                </span>
                <span class="text-xs text-[#9ca3af]">
                  Stok: {{ book.stok }}
                </span>
              </div>
            </div>
          </div>
          <div v-if="latestBooks.length === 0" class="text-center py-8 text-[#9ca3af]">
            Belum ada buku terbaru
          </div>
        </div>
      </div>

      <!-- Artikel Terbaru -->
      <div class="bg-white rounded-xl p-6 shadow-sm border border-[#e5e7eb] opacity-0 animate-fade-in" style="animation-delay: 900ms">
        <h3 class="text-xl font-semibold text-[#1a1a1a] mb-6">5 Artikel Terbaru</h3>
        <div class="space-y-4 max-h-[350px] overflow-y-auto pr-2">
          <div 
            v-for="(article, index) in latestArticles" 
            :key="article.id"
            class="flex gap-4 p-3 rounded-lg transition-all duration-300 hover:bg-[#f9fafb] cursor-pointer opacity-0 animate-fade-in border border-transparent hover:border-[#e5e7eb]"
            :style="{ animationDelay: `${950 + index * 100}ms` }"
          >
            <div class="w-16 h-20 flex-shrink-0 rounded overflow-hidden bg-[#f3f4f6] border border-gray-200 shadow-sm">
              <img 
                v-if="article.cover_image"
                :src="article.cover_image"
                :alt="article.title"
                class="w-full h-full object-cover"
                @error="handleArticleImageError"
              />
              <div v-else class="w-full h-full flex items-center justify-center">
                <svg class="w-8 h-8 text-[#0a0b0c]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <h4 class="font-semibold text-[#1a1a1a] text-sm mb-1 truncate">{{ article.title }}</h4>
              <p class="text-xs text-[#6b7280] mb-1 truncate">{{ article.author_name }}</p>
              <div class="flex items-center gap-2 flex-wrap">
                <span class="text-xs px-2 py-1 rounded-full bg-[#9C27B0]/10 text-[#9C27B0] font-medium">
                  {{ article.category }}
                </span>
                <span class="text-xs text-[#9ca3af] flex items-center gap-1">
                  <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  {{ formatNumber(article.views || 0) }}
                </span>
              </div>
            </div>
          </div>
          <div v-if="latestArticles.length === 0" class="text-center py-8 text-[#9ca3af]">
            Belum ada artikel terbaru
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

// API Configuration
const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

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
const loading = ref(true);
const stats = ref({
  totalKoleksi: 0,
  totalEksemplar: 0,
  dipinjamkan: 0,
  tersedia: 0
});

const transactionData = ref([]);
const latestBooks = ref([]);
const latestArticles = ref([]);
const summary = ref({
  total: 0,
  baru: 0,
  kembali: 0,
  perpanjang: 0,
  keterlambatan: 0
});

const categoryData = ref([]);
const categoryColors = ['#2C64E3', '#00BCD4', '#9C27B0', '#4DB6AC', '#F4C430'];

const hasBackupToday = ref(true);
const overdueMembers = ref(0);

// Chart refs
const transactionChart = ref(null);
const categoryChart = ref(null);

let charts = {};

// Computed
const statsCards = computed(() => [
  {
    icon: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>',
    value: stats.value.totalKoleksi,
    label: 'Total Koleksi'
  },
  {
    icon: '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>',
    value: stats.value.totalEksemplar,
    label: 'Total Eksemplar'
  },
  {
    icon: '<rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect>',
    value: stats.value.dipinjamkan,
    label: 'Dipinjamkan'
  },
  {
    icon: '<polyline points="20 6 9 17 4 12"></polyline>',
    value: stats.value.tersedia,
    label: 'Tersedia'
  }
]);

const formatNumber = (num) => num.toLocaleString('id-ID');

const handleUnauthorized = (error) => {
  if (error.response?.status === 401 || error.response?.status === 403) {
    console.error('⚠️ Unauthorized - Token invalid atau expired');
    localStorage.removeItem('token');
  }
};

const handleArticleImageError = (event) => {
  event.target.src = '/default_article.png';
};

// Fetch Data
const fetchDashboardData = async () => {
  try {
    loading.value = true;
    
    // Fetch books statistics
    const booksRes = await axios.get(`${apiBase}/api/admin/books`, getAuthConfig());
    const books = booksRes.data;
    
    stats.value.totalKoleksi = books.length;
    stats.value.totalEksemplar = books.reduce((sum, book) => sum + (book.stok || 0), 0);
    
    // Get latest 5 books
    latestBooks.value = books.slice(0, 5);
    
    // Fetch latest 5 articles from articles API
    try {
      const articlesRes = await axios.get(`${apiBase}/api/articles/recent?limit=5`);
      if (articlesRes.data.success) {
        latestArticles.value = articlesRes.data.data;
        console.log('✅ Artikel terbaru berhasil dimuat:', latestArticles.value.length);
      }
    } catch (articleError) {
      console.error('❌ Error fetching articles:', articleError.message);
      latestArticles.value = [];
    }
    
    // Process category data - Top 4 + Lainnya
    const categoryCount = {};
    books.forEach(book => {
      const kategori = book.kategori || 'Lainnya';
      categoryCount[kategori] = (categoryCount[kategori] || 0) + 1;
    });
    
    // Sort and get top 4 categories
    const sortedCategories = Object.entries(categoryCount)
      .sort((a, b) => b[1] - a[1]);
    
    const top4 = sortedCategories.slice(0, 4);
    const others = sortedCategories.slice(4);
    
    // Calculate "Lainnya" count
    const lainnyaCount = others.reduce((sum, [_, count]) => sum + count, 0);
    
    // Build final category data
    categoryData.value = top4.map(([label, count]) => ({ label, count }));
    
    if (lainnyaCount > 0) {
      categoryData.value.push({ label: 'Lainnya', count: lainnyaCount });
    }
    
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
    await fetchTransactionData(peminjaman);
    
    // Fetch summary data
    await fetchSummaryData(peminjaman);
    
    loading.value = false;
    
    // Create charts after data loaded
    setTimeout(() => {
      createTransactionChart();
      createCategoryChart();
    }, 100);
    
  } catch (error) {
    console.error('❌ Error fetching dashboard data:', error);
    handleUnauthorized(error);
    loading.value = false;
  }
};

const fetchTransactionData = async (peminjaman) => {
  try {
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
    summary.value.perpanjang = 0;
    summary.value.keterlambatan = overdueMembers.value;
    summary.value.total = summary.value.baru + summary.value.kembali + 
                          summary.value.perpanjang + summary.value.keterlambatan;
    
  } catch (error) {
    console.error('❌ Error fetching summary data:', error);
    handleUnauthorized(error);
  }
};

// Create Charts
const createTransactionChart = () => {
  if (!transactionChart.value) return;
  
  const ctx = transactionChart.value.getContext('2d');
  
  if (charts.transaction) {
    charts.transaction.destroy();
  }
  
  charts.transaction = new Chart(ctx, {
    type: 'line',
    data: {
      labels: transactionData.value.map(d => d.label),
      datasets: [
        {
          label: 'Pinjam',
          data: transactionData.value.map(d => d.pinjam),
          borderColor: '#F4C430',
          backgroundColor: 'rgba(244, 196, 48, 0.1)',
          tension: 0.4,
          fill: true,
          pointRadius: 5,
          pointHoverRadius: 7,
          pointBackgroundColor: '#F4C430',
          pointBorderColor: '#fff',
          pointBorderWidth: 2
        },
        {
          label: 'Kembali',
          data: transactionData.value.map(d => d.kembali),
          borderColor: '#00BCD4',
          backgroundColor: 'rgba(0, 188, 212, 0.1)',
          tension: 0.4,
          fill: true,
          pointRadius: 5,
          pointHoverRadius: 7,
          pointBackgroundColor: '#00BCD4',
          pointBorderColor: '#fff',
          pointBorderWidth: 2
        },
        {
          label: 'Perpanjang',
          data: transactionData.value.map(d => d.perpanjang),
          borderColor: '#9C27B0',
          backgroundColor: 'rgba(156, 39, 176, 0.1)',
          tension: 0.4,
          fill: true,
          pointRadius: 5,
          pointHoverRadius: 7,
          pointBackgroundColor: '#9C27B0',
          pointBorderColor: '#fff',
          pointBorderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          titleColor: '#fff',
          bodyColor: '#fff',
          borderColor: '#333',
          borderWidth: 1
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#6b7280' }
        },
        y: {
          beginAtZero: true,
          grid: { color: '#f0f0f0' },
          ticks: { color: '#6b7280', stepSize: 1 }
        }
      },
      animation: {
        duration: 2000,
        easing: 'easeInOutQuart'
      }
    }
  });
};

const getCoverUrl = (cover) => {
  if (!cover) return '/default_cover.png';

  // kalau sudah URL lengkap (ada http:// atau https://)
  if (/^https?:\/\//.test(cover)) return cover;

  // kalau path relatif seperti "uploads/cover1.jpg" atau "cover1.jpg"
  const base = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000';
  
  // pastikan selalu mengarah ke /uploads/
  if (!cover.startsWith('uploads/')) cover = `uploads/${cover}`;
  
  return `${base}/${cover}`;
};

const createCategoryChart = () => {
  if (!categoryChart.value || categoryData.value.length === 0) return;
  
  const ctx = categoryChart.value.getContext('2d');
  
  if (charts.category) {
    charts.category.destroy();
  }
  
  charts.category = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: categoryData.value.map(c => c.label),
      datasets: [{
        label: 'Jumlah Buku',
        data: categoryData.value.map(c => c.count),
        backgroundColor: categoryData.value.map((_, i) => categoryColors[i]),
        borderRadius: 8,
        barThickness: 30
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          grid: { color: '#f0f0f0' },
          ticks: { color: '#6b7280', stepSize: 1 }
        },
        y: {
          grid: { display: false },
          ticks: { color: '#6b7280' }
        }
      },
      animation: {
        duration: 2000,
        easing: 'easeInOutQuart'
      }
    }
  });
};

const createBackup = () => {
  alert('Fitur backup database akan segera hadir!');
};

onMounted(() => {
  fetchDashboardData();
});
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounceSubtle {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

@keyframes pulseSubtle {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(0.95);
  }
}

.animate-fade-in {
  animation: fadeIn 0.6s ease-out forwards;
}

.animate-slide-down {
  animation: slideDown 0.5s ease-out forwards;
}

.animate-bounce-subtle {
  animation: bounceSubtle 2s ease-in-out infinite;
}

.animate-pulse-subtle {
  animation: pulseSubtle 3s ease-in-out infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>