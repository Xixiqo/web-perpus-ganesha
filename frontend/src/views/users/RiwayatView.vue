<template>
  <div class="peminjaman-page">
    <!-- Jika belum login -->
    <div v-if="!isLoggedIn" class="login-warning">
      <h2>⚠️ Harap login terlebih dahulu</h2>
      <p>Silakan login untuk melihat data peminjaman Anda.</p>
      <router-link to="/login" class="login-link">Klik di sini untuk login</router-link>
    </div>

    <!-- Jika sudah login -->
    <div v-else>
      <!-- Summary Cards -->
      <div class="summary-cards">
        <div class="summary-card card-blue">
          <div class="card-header">
            <span class="card-title">Total Buku</span>
            <span class="card-icon">📚</span>
          </div>
          <div class="card-number">{{ totalBuku }}</div>
          <div class="card-subtitle">Koleksi Buku</div>
          <div class="card-footer">Buku pernah dipinjam</div>
        </div>

        <div class="summary-card card-yellow">
          <div class="card-header">
            <span class="card-title">Total Peminjaman</span>
            <span class="card-icon">📋</span>
          </div>
          <div class="card-number">{{ totalPinjam }}</div>
          <div class="card-subtitle">Buku sedang dipinjam</div>
          <div class="card-footer">Peminjaman aktif</div>
        </div>

        <div class="summary-card card-red">
          <div class="card-header">
            <span class="card-title">Total Terlambat</span>
            <span class="card-icon">⚠️</span>
          </div>
          <div class="card-number">{{ totalTerlambat }}</div>
          <div class="card-subtitle">Buku terlambat dikembalikan</div>
          <div class="card-footer">Segera dikembalikan</div>
        </div>
      </div>

      <!-- Books Management Section -->
      <div class="books-management">
        <div class="section-header">
          <div class="header-left">
            <span class="section-icon">📖</span>
            <h2>Buku Pinjaman Anda</h2>
          </div>

          <div class="header-right">
            <!-- Search Bar -->
            <div class="search-box">
              <span class="search-icon">🔍</span>
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Cari judul buku atau penulis"
                class="search-input"
              />
            </div>

            <!-- Dropdown Filter -->
            <div class="dropdown-wrapper">
              <button class="status-filter" @click="toggleDropdown">
                <span>{{ selectedStatusLabel }}</span>
                <span class="dropdown-icon">▾</span>
              </button>

              <ul v-if="showDropdown" class="dropdown-menu">
                <li
                  v-for="option in statusOptions"
                  :key="option.value"
                  :class="{ active: selectedStatus === option.value }"
                  @click="selectStatus(option.value)"
                >
                  {{ option.label }}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Books Grid -->
        <div class="books-grid">
          <BookCard
            v-for="book in filteredBooks"
            :key="book.id"
            :book="book"
          />
        </div>

        <!-- Empty State -->
        <div v-if="filteredBooks.length === 0" class="empty-state">
          <p>Tidak ada buku yang ditemukan</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import BookCard from '@/components/users/BorrowCard.vue'

export default {
  name: 'PeminjamanPage',
  components: { BookCard },
  data() {
    return {
      isLoggedIn: false,
      searchQuery: '',
      books: [],
      totalBuku: 0,
      totalPinjam: 0,
      totalTerlambat: 0,
      showDropdown: false,
      selectedStatus: 'all',
      statusOptions: [
        { value: 'all', label: 'Semua Status' },
        { value: 'dipinjam', label: 'Dipinjamkan' },
        { value: 'dikembalikan', label: 'Dikembalikan' },
        { value: 'terlambat', label: 'Terlambat' }
      ]
    }
  },
  computed: {
    filteredBooks() {
      let result = this.books
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        result = result.filter(
          book =>
            book.title.toLowerCase().includes(query) ||
            book.author.toLowerCase().includes(query)
        )
      }
      if (this.selectedStatus !== 'all') {
        result = result.filter(book => book.status === this.selectedStatus)
      }
      return result
    },
    selectedStatusLabel() {
      const found = this.statusOptions.find(opt => opt.value === this.selectedStatus)
      return found ? found.label : 'Semua Status'
    }
  },
  async mounted() {
    const token = localStorage.getItem('token')
    this.isLoggedIn = !!token
    if (!this.isLoggedIn) return

    try {
      const response = await axios.get('http://localhost:5000/api/riwayat', {
        headers: { Authorization: `Bearer ${token}` }
      })
      this.books = response.data
      this.totalBuku = this.books.length
      this.totalPinjam = this.books.filter(b => b.status === 'dipinjam').length

      this.totalTerlambat = this.books.filter(b => {
        if (b.status === 'dikembalikan' && b.return_date && b.deadline) {
          return new Date(b.return_date) > new Date(b.deadline)
        }
        return false
      }).length
    } catch (error) {
      console.error('Gagal mengambil data:', error)
    }
  },
  methods: {
    toggleDropdown() {
      this.showDropdown = !this.showDropdown
    },
    selectStatus(value) {
      this.selectedStatus = value
      this.showDropdown = false
    }
  }
}
</script>

<style scoped>
/* Tambahan pesan login */
.login-warning {
  text-align: center;
  margin: 100px auto;
  background: #fff3cd;
  border: 1px solid #ffeeba;
  border-radius: 12px;
  padding: 30px;
  max-width: 600px;
  color: #856404;
}
.login-link {
  display: inline-block;
  margin-top: 10px;
  text-decoration: none;
  color: #007bff;
  font-weight: 500;
}
.login-link:hover {
  text-decoration: underline;
}

/* sisa style kamu tetap sama */
.peminjaman-page {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
  background: #f9fafb;
  min-height: 100vh;
}
/* Summary Cards */
.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
  padding: 10px;
}

.summary-card {
  padding: 20px;
  border-radius: 12px;
  color: white;
  position: relative;
  overflow: hidden;
}

.card-blue {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.card-yellow {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
}

.card-red {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.card-title {
  font-size: 14px;
  font-weight: 500;
  opacity: 0.9;
}

.card-icon {
  font-size: 24px;
}

.card-number {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 8px;
}

.card-subtitle {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
}

.card-footer {
  font-size: 13px;
  opacity: 0.85;
}

/* Books Management Section */
.books-management {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;
  flex-wrap: wrap;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-icon {
  font-size: 24px;
}

.section-header h2 {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.header-right {
  display: flex;
  gap: 12px;
  align-items: center;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f3f4f6;
  padding: 8px 16px;
  border-radius: 8px;
  min-width: 280px;
}

.search-icon {
  font-size: 16px;
}

.search-input {
  border: none;
  background: transparent;
  outline: none;
  flex: 1;
  font-size: 14px;
  color: #374151;
}

.search-input::placeholder {
  color: #9ca3af;
}

.status-filter {
  padding: 8px 16px;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  color: #374151;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.status-filter:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.dropdown-icon {
  font-size: 12px;
}

/* Books Grid */
.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
  gap: 20px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #9ca3af;
  font-size: 16px;
}

/* Responsive */
@media (max-width: 1200px) {
  .books-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .peminjaman-page {
    padding: 16px;
  }
  
  .summary-cards {
    grid-template-columns: 1fr;
  }
  
  .section-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .header-left,
  .header-right {
    width: 100%;
  }
  
  .header-right {
    flex-direction: column;
  }
  
  .search-box {
    min-width: 100%;
  }
  
  .status-filter {
    width: 100%;
    justify-content: center;
  }
  
  .books-grid {
    grid-template-columns: 1fr;
  }
}

.section-header {
  display: flex;
  justify-content: space-between; /* kiri-kanan sejajar */
  align-items: center;
  flex-wrap: wrap; /* biar tetap rapi di layar kecil */
  margin-bottom: 1rem;
  padding: 0.5rem 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.header-left h2 {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem; /* jarak antar elemen kanan */
}

.search-box {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  padding: 6px 10px;
  border-radius: 6px;
  background-color: white;
}

.search-icon {
  margin-right: 6px;
}

.search-input {
  border: none;
  outline: none;
  font-size: 0.95rem;
}

/* === Dropdown Filter (revisi clean & modern) === */
.dropdown-wrapper {
  position: relative;
  display: inline-block;
}

.status-filter {
  background-color: #ffffff;
  border: 1px solid #d1d5db;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 14px;
  color: #374151;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
}

.status-filter:hover {
  background-color: #f3f4f6;
  border-color: #9ca3af;
}

.dropdown-icon {
  font-size: 12px;
}

/* Dropdown list */
.dropdown-menu {
  position: absolute;
  top: 110%;
  right: 0;
  background-color: white;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  min-width: 180px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  z-index: 20;
  margin-top: 4px;
  padding: 6px 0;
  list-style: none; /* hapus titik bullet */
}

.dropdown-menu li {
  padding: 8px 14px;
  font-size: 14px;
  color: #374151;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

/* Hover & aktif */
.dropdown-menu li:hover,
.dropdown-menu li.active {
  background-color: #f9fafb;
}

/* Untuk layar kecil */
@media (max-width: 768px) {
  .status-filter {
    width: 100%;
    justify-content: center;
  }

  .dropdown-menu {
    width: 100%;
    left: 0;
    right: auto;
  }
}

.dropdown-menu li {
  padding: 8px 12px;
  cursor: pointer;
}

.dropdown-menu li:hover,
.dropdown-menu li.active {
  background-color: #eee;
}
</style>