<template>
  <div class="home bg-white">
    <!-- Hero Section -->
    <HeroSec
      @scroll-next="scrollToNextSection"
      @go-search="goToSearchPage"
    />
    <!-- Top 10 Book -->
    <section class="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
      <StackPopBook
        v-if="topBooks.length > 0"
        :books="topBooks"
        :autoplay="true"
        :interval="5000"
        @view-book="handleViewBook"
      />
      <div v-else class="text-center text-slate-600 text-sm sm:text-base py-8">
        Belum ada data buku.
      </div>
    </section>

    <!-- Rekomendasi Koleksi -->
    <section class="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <BookSlider 
        title="Rekomendasi Untukmu"
        :books="recommendedBooks"
        :auto-play="true"
        :auto-play-interval="5000"
        @view-all="handleViewAll('recommended')"
        @book-click="handleBookClick"
      />
      <BookSlider 
        title="Baru Saja Hadir"
        :books="newArrivals"
        :auto-play="true"
        :auto-play-interval="5000"
        @view-all="handleViewAll('new')"
        @book-click="handleBookClick"
      />
    </section>

    <!-- Wave + Podium Top Readers -->
    <section class="podium mt-8 sm:mt-12 lg:mt-16 bg-gradient-to-b from-white via-blue-50 to-blue-100 pt-8 sm:pt-12 lg:pt-16">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16 lg:pb-20">
        <div class="text-center mb-12 sm:mb-16 lg:mb-20">
          <h2 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-wide">
            Penikmat Koleksi <span class="text-blue-500 font-bold">Tahun 2025</span>
          </h2>
        </div>
        
        <div class="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-6 items-end max-w-4xl mx-auto">
          <!-- 2nd Place -->
          <div class="step text-center">
            <div class="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-slate-300 to-slate-500 flex items-center justify-center mx-auto mb-2 sm:mb-3 text-xl sm:text-2xl lg:text-3xl">
              🥈
            </div>
            <div class="font-bold text-slate-900 text-xs sm:text-sm lg:text-base mb-1">Ikra</div>
            <div class="text-slate-600 text-xs sm:text-sm mb-2 sm:mb-3">72 Peminjaman</div>
            <div class="bg-gradient-to-b from-blue-500 to-blue-600 text-white font-extrabold rounded-t-3xl w-full h-32 sm:h-40 lg:h-48 flex items-center justify-center shadow-lg shadow-blue-500/35 text-2xl sm:text-3xl lg:text-5xl">
              2nd
            </div>
          </div>

          <!-- 1st Place -->
          <div class="step text-center">
            <div class="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center mx-auto mb-2 sm:mb-3 text-xl sm:text-2xl lg:text-3xl">
              👑
            </div>
            <div class="font-bold text-slate-900 text-xs sm:text-sm lg:text-base mb-1">Bambang</div>
            <div class="text-slate-600 text-xs sm:text-sm mb-2 sm:mb-3">91 Peminjaman</div>
            <div class="bg-gradient-to-b from-blue-500 to-blue-600 text-white font-extrabold rounded-t-3xl w-full h-48 sm:h-56 lg:h-72 flex items-center justify-center shadow-lg shadow-blue-500/35 text-2xl sm:text-3xl lg:text-5xl">
              1st
            </div>
          </div>

          <!-- 3rd Place -->
          <div class="step text-center">
            <div class="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center mx-auto mb-2 sm:mb-3 text-xl sm:text-2xl lg:text-3xl">
              🥉
            </div>
            <div class="font-bold text-slate-900 text-xs sm:text-sm lg:text-base mb-1">Zulhamdono</div>
            <div class="text-slate-600 text-xs sm:text-sm mb-2 sm:mb-3">20 Peminjaman</div>
            <div class="bg-gradient-to-b from-blue-500 to-blue-600 text-white font-extrabold rounded-t-3xl w-full h-24 sm:h-32 lg:h-36 flex items-center justify-center shadow-lg shadow-blue-500/35 text-2xl sm:text-3xl lg:text-5xl">
              3rd
            </div>
          </div>
        </div>
      </div>
    </section>

    <Sponsor />

    <!-- Loading State -->
    <div v-if="loading" class="fixed inset-0 bg-white/90 flex flex-col items-center justify-center z-[9999]">
      <div class="w-12 h-12 sm:w-14 sm:h-14 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4 sm:mb-6"></div>
      <p class="text-blue-600 text-sm sm:text-base font-medium">Memuat data...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BookSlider from '@/components/users/BookSlider.vue'
import StackPopBook from '@/components/users/StackPopBook.vue'
import HeroSec from '@/components/users/HeroSec.vue'
import Sponsor from '@/components/users/Sponsor.vue'

const router = useRouter()

// State
const books = ref([])
const loading = ref(true)
const categories = ref([])

// Placeholder jika cover tidak ada
const placeholderCover = '/placeholder-cover.png'

// Fungsi untuk mendapatkan URL cover
const getCoverUrl = (filename) => {
  if (!filename) return placeholderCover
  if (/^https?:\/\//i.test(filename)) return filename
  const base = import.meta.env.VITE_API_BASE || 'http://localhost:5000'
  return `${base}/uploads/${filename}`
}

// Computed untuk Top 10 Books
const topBooks = computed(() => {
  return books.value.slice(0, 10).map(book => ({
    id: book.id,
    title: book.judul || book.title,
    author: book.penulis || book.author,
    rating: book.rating || 0,
    cover: getCoverUrl(book.cover),
    synopsis: book.sinopsis || 'Tidak ada sinopsis tersedia.'
  }))
})

// Recommended dan new arrivals
const recommendedBooks = computed(() => topBooks.value.slice(0, 10))
const newArrivals = computed(() => topBooks.value.slice(0, 10))

// Fetch data dari API
const fetchBooks = async () => {
  loading.value = true
  try {
    const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:5000'
    const res = await fetch(`${apiBase}/api/books`)
    if (!res.ok) throw new Error('Gagal memuat data buku')
    const data = await res.json()
    books.value = data

    updateCategoryCount(data)
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

// Update jumlah buku per kategori
const updateCategoryCount = (booksData) => {
  const categoryMap = {}
  booksData.forEach(book => {
    if (book.kategori) {
      if (!categoryMap[book.kategori]) categoryMap[book.kategori] = 0
      categoryMap[book.kategori]++
    }
  })

  categories.value = Object.entries(categoryMap).map(([name, count], idx) => ({
    id: idx + 1,
    name,
    bookCount: count,
    icon: '📖',
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  }))
}

// Event handlers
const handleViewBook = (book) => {
  if (book.id) router.push(`/buku/${book.id}`)
}

const handleBookClick = (book) => {
  if (book.id) router.push(`/buku/${book.id}`)
}

const scrollToNextSection = () => {
  const target = document.querySelector('.container')
  if (target) {
    target.scrollIntoView({ behavior: 'smooth' })
  }
}

const goToSearchPage = () => {
  router.push('/cari')
}

const handleViewAll = (section) => {
  router.push('/cari')
}

const handleCategoryClick = (category) => {
  if (category.name) {
    router.push(`/cari?kategori=${encodeURIComponent(category.name)}`)
  }
}

// Load saat mount
onMounted(() => {
  fetchBooks()
})
</script>

<style scoped>
</style>