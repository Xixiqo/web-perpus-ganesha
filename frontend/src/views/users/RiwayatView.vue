<template>
  <div class="peminjaman-page">
    <!-- Login Warning -->
    <div v-if="!isLoggedIn" class="login-warning">
      <h2>⚠️ Harap login terlebih dahulu</h2>
      <p>Silakan login untuk melihat data peminjaman Anda.</p>
      <router-link to="/login" class="login-link">Klik di sini untuk login</router-link>
    </div>

    <!-- Jika sudah login -->
    <div v-else>
      <!-- Loading -->
      <div v-if="loading" class="loading-overlay">
        <div class="spinner"></div>
        <p>Memuat data...</p>
      </div>

      <!-- Summary Cards -->
      <div v-else class="summary-cards">
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
        <div v-if="filteredBooks.length > 0" class="books-grid">
          <BookCard
            v-for="book in filteredBooks"
            :key="book.id_peminjaman"
            :book="book"
          />
        </div>

        <!-- Empty State -->
        <div v-else class="empty-state">
          <p>Tidak ada buku yang ditemukan</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import axios from "axios"
import BookCard from "@/components/users/CardRiwayat.vue"

const isLoggedIn = ref(false)
const searchQuery = ref("")
const books = ref([])
const loading = ref(false)
const showDropdown = ref(false)
const selectedStatus = ref("all")

const statusOptions = [
  { value: "all", label: "Semua Status" },
  { value: "Pending", label: "Pending" },
  { value: "Dipinjam", label: "Dipinjam" },
  { value: "Dikembalikan", label: "Dikembalikan" },
  { value: "Terlambat", label: "Terlambat" },
]

// Summary
const totalBuku = computed(() => books.value.length)
const totalPinjam = computed(
  () => books.value.filter((b) => b.status === "Dipinjam").length
)
const totalTerlambat = computed(
  () => books.value.filter((b) => b.status === "Terlambat").length
)

// Filtered Books
const filteredBooks = computed(() => {
  let result = books.value
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(
      (b) =>
        b.book.title.toLowerCase().includes(q) ||
        b.book.author.toLowerCase().includes(q)
    )
  }
  if (selectedStatus.value !== "all") {
    result = result.filter((b) => b.status === selectedStatus.value)
  }
  return result
})

const selectedStatusLabel = computed(() => {
  const found = statusOptions.find((o) => o.value === selectedStatus.value)
  return found ? found.label : "Semua Status"
})

const apiBase = import.meta.env.VITE_API_BASE || "http://localhost:5000"

const fetchRiwayat = async () => {
  loading.value = true
  try {
    const token = localStorage.getItem("token")
    if (!token) {
      isLoggedIn.value = false
      return
    }
    isLoggedIn.value = true

    const res = await axios.get(`${apiBase}/api/riwayat`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const peminjaman = res.data.data || []

    books.value = peminjaman.map((b) => ({
      id_peminjaman: b.id_peminjaman,
      book: { 
        id: b.book.id,
        title: b.book.title,
        author: b.book.author,
        isbn: b.book.isbn,
        publisher: b.book.publisher,
        cover: b.book.cover || 'default-cover.png'
      },
      status: b.status,
      borrow_date: b.borrow_date,
      return_date: b.return_date,
      actual_return_date: b.actual_return_date,
      denda: b.denda,
      keterangan: b.keterangan,
    }));


  } catch (err) {
    console.error("Gagal memuat riwayat:", err)
  } finally {
    loading.value = false
  }
}

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}
const selectStatus = (value) => {
  selectedStatus.value = value
  showDropdown.value = false
}

onMounted(() => {
  fetchRiwayat()
})
</script>



<style scoped>
/* ===== Login Warning ===== */
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

/* ===== Page Container ===== */
.peminjaman-page {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
  background: #f9fafb;
  min-height: 100vh;
}

/* ===== Summary Cards ===== */
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
.card-title { font-size: 14px; font-weight: 500; opacity: 0.9; }
.card-icon { font-size: 24px; }
.card-number { font-size: 48px; font-weight: 700; margin-bottom: 8px; }
.card-subtitle { font-size: 16px; font-weight: 600; margin-bottom: 8px; }
.card-footer { font-size: 13px; opacity: 0.85; }

/* ===== Books Management Section ===== */
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
  flex-wrap: wrap;
  margin-bottom: 24px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}
.header-left h2 { margin: 0; font-size: 1.3rem; font-weight: 600; }
.section-icon { font-size: 24px; }

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

/* ===== Search Box ===== */
.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  background: #f9fafb;
}
.search-box input {
  border: none;
  outline: none;
  flex: 1;
  font-size: 14px;
  background: transparent;
}

/* ===== Dropdown ===== */
.dropdown-wrapper { position: relative; display: inline-block; }
.status-filter {
  background: white;
  border: 1px solid #d1d5db;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 14px;
  color: #374151;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
}
.status-filter:hover { background: #f3f4f6; border-color: #9ca3af; }

.dropdown-menu {
  position: absolute;
  top: 110%;
  right: 0;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  min-width: 180px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.08);
  z-index: 20;
  margin-top: 4px;
  padding: 6px 0;
  list-style: none;
}
.dropdown-menu li {
  padding: 8px 14px;
  cursor: pointer;
}
.dropdown-menu li:hover,
.dropdown-menu li.active { background-color: #f9fafb; }

/* ===== Books Grid ===== */
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

/* ===== Responsive ===== */
@media (max-width: 768px) {
  .peminjaman-page { padding: 16px; }
  .summary-cards { grid-template-columns: 1fr; }
  .section-header { flex-direction: column; align-items: stretch; }
  .header-left, .header-right { width: 100%; }
  .header-right { flex-direction: column; gap: 8px; }
  .search-box, .status-filter { width: 100%; justify-content: center; }
  .dropdown-menu { width: 100%; left: 0; right: auto; }
  .books-grid { grid-template-columns: 1fr; }
}
</style>
