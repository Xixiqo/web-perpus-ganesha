<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Login Warning -->
      <div v-if="!isLoggedIn" class="max-w-2xl mx-auto mt-20">
        <div class="bg-amber-50 border border-amber-200 rounded-xl p-8 text-center">
          <svg class="w-16 h-16 text-amber-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
          <h2 class="text-2xl font-bold text-amber-800 mb-2">Harap login terlebih dahulu</h2>
          <p class="text-amber-700 mb-4">Silakan login untuk melihat data peminjaman Anda.</p>
          <router-link to="/login" class="inline-block text-blue-600 hover:text-blue-700 font-medium hover:underline">
            Klik di sini untuk login
          </router-link>
        </div>
      </div>

      <!-- Jika sudah login -->
      <div v-else>
        <!-- Loading -->
        <div v-if="loading" class="flex flex-col items-center justify-center py-20">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p class="mt-4 text-gray-600">Memuat data...</p>
        </div>

        <!-- Summary Cards -->
        <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
          <!-- Total Buku Card -->
          <div class="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-6 border border-blue-200/50">
            <div class="flex items-start justify-between mb-4">
              <span class="text-sm font-medium text-blue-700">Total Buku</span>
              <svg class="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
            </div>
            <div class="text-4xl font-bold text-blue-900 mb-2">{{ totalBuku }}</div>
            <div class="text-base font-semibold text-blue-800 mb-1">Koleksi Buku</div>
            <div class="text-sm text-blue-600">Buku pernah dipinjam</div>
          </div>

          <!-- Total Peminjaman Card -->
          <div class="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl p-6 border border-amber-200/50">
            <div class="flex items-start justify-between mb-4">
              <span class="text-sm font-medium text-amber-700">Total Peminjaman</span>
              <svg class="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <div class="text-4xl font-bold text-amber-900 mb-2">{{ totalPinjam }}</div>
            <div class="text-base font-semibold text-amber-800 mb-1">Buku sedang dipinjam</div>
            <div class="text-sm text-amber-600">Peminjaman aktif</div>
          </div>

          <!-- Total Terlambat Card -->
          <div class="bg-gradient-to-br from-red-50 to-red-100/50 rounded-xl p-6 border border-red-200/50">
            <div class="flex items-start justify-between mb-4">
              <span class="text-sm font-medium text-red-700">Total Terlambat</span>
              <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="text-4xl font-bold text-red-900 mb-2">{{ totalTerlambat }}</div>
            <div class="text-base font-semibold text-red-800 mb-1">Buku terlambat dikembalikan</div>
            <div class="text-sm text-red-600">Segera dikembalikan</div>
          </div>
        </div>

        <!-- Books Management Section -->
        <div class="bg-white rounded-xl p-4 md:p-6 shadow-sm">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div class="flex items-center gap-3">
              <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
              <h2 class="text-xl font-semibold text-gray-900">Buku Pinjaman Anda</h2>
            </div>

            <div class="flex flex-col sm:flex-row gap-3">
              <!-- Search Bar -->
              <div class="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg flex-1 sm:flex-initial">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <input
                  type="text"
                  v-model="searchQuery"
                  placeholder="Cari judul buku atau penulis"
                  class="bg-transparent border-none outline-none flex-1 text-sm text-gray-700 placeholder-gray-400"
                />
              </div>

              <!-- Dropdown Filter -->
              <div class="relative">
                <button 
                  @click="toggleDropdown"
                  class="w-full sm:w-auto flex items-center justify-between gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <span>{{ selectedStatusLabel }}</span>
                  <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>
                <ul 
                  v-if="showDropdown" 
                  class="absolute right-0 mt-2 w-full sm:w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1"
                >
                  <li
                    v-for="option in statusOptions"
                    :key="option.value"
                    @click="selectStatus(option.value)"
                    class="px-4 py-2 text-sm cursor-pointer transition-colors"
                    :class="selectedStatus === option.value ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-50'"
                  >
                    {{ option.label }}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Books Grid -->
          <div v-if="filteredBooks.length > 0" class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <BookCard
              v-for="book in filteredBooks"
              :key="book.id_peminjaman"
              :book="book"
            />
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-16">
            <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <p class="text-gray-500">Tidak ada buku yang ditemukan</p>
          </div>
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
    }))
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