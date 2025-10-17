<template>
  <div class="home">
    <!-- Hero Section -->
    <HeroSec
      @scroll-next="scrollToNextSection"
      @go-search="goToSearchPage"
    />

    <!-- Top 10 Book -->
    <section class="container section stack">
      <StackPopBook
        v-if="topBooks.length > 0"
        :books="topBooks"
        :autoplay="true"
        :interval="5000"
        @view-book="handleViewBook"
      />
      <div v-else class="placeholder-text">Belum ada data buku.</div>
    </section>

    <!-- Rekomendasi Koleksi -->
    <section class="container section">
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
    <section class="podium">
      <div class="podium-inner container">
        <div class="podium-title">Penikmat Koleksi <span>Tahun 2025</span></div>
        <div class="steps">
          <div class="step second">
            <div class="avatar crown silver">🥈</div>
            <div class="name">Ikra</div>
            <div class="points">72 Peminjaman</div>
            <div class="block">2nd</div>
          </div>
          <div class="step first">
            <div class="avatar crown gold">👑</div>
            <div class="name">Bambang</div>
            <div class="points">91 Peminjaman</div>
            <div class="block">1st</div>
          </div>
          <div class="step third">
            <div class="avatar crown bronze">🥉</div>
            <div class="name">Zulhamdono</div>
            <div class="points">-1 Peminjaman</div>
            <div class="block">3rd</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Loading State -->
    <div v-if="loading" class="loading-overlay">
      <div class="spinner"></div>
      <p>Memuat data...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BookSlider from '@/components/users/BookSlider.vue'
import StackPopBook from '@/components/users/StackPopBook.vue'
import HeroSec from '@/components/users/HeroSec.vue'

const router = useRouter()
const stackSection = ref(null)

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
  // Kategori unik dari database
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
    icon: '📖', // bisa ganti sesuai kategori
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
  if (stackSection.value) {
    stackSection.value.scrollIntoView({ behavior: 'smooth' })
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
.home {
  background: #ffffff;
}

.container {
  margin: 0 32px;
  padding: 1rem;
}

.container.stack {
  margin: 0;
  padding: 1rem;
}

/* Banner */
.banner {
  margin-top: 1rem;
}

.banner-img {
  height: 220px;
  border-radius: 14px;
  background: url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1600&auto=format&fit=crop') center/cover no-repeat;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.12);
}

/* Sections */
.section {
  margin-top: 28px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-header h3 {
  color: #0f172a;
  font-size: 1.2rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}

.grid.categories {
  grid-template-columns: repeat(4, 1fr);
}

/* Podium */
.podium {
  margin-top: 36px;
  background: linear-gradient(#ffffff 0, #e9f0ff 40%, #d8e5ff 100%);
  padding-top: 20px;
}

.podium-inner {
  padding-bottom: 30px;
}

.podium-title {
  text-align: center;
  font-weight: 900;
  letter-spacing: 0.5px;
  font-size: 2.4rem;
  color: #0f172a;
  margin: 0 auto 64px;
}

.podium-title span {
  color: #3b82f6;
  font-weight: 700;
}

.steps {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  align-items: end;
}

.step {
  text-align: center;
  position: relative;
}

.avatar {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  margin: 0 auto 8px;
  font-size: 28px;
  color: #fff;
}

.crown.gold {
  background: linear-gradient(135deg, #fbbf24, #f59e0b);
}

.crown.silver {
  background: linear-gradient(135deg, #cbd5e1, #94a3b8);
}

.crown.bronze {
  background: linear-gradient(135deg, #f59e0b, #ea580c);
}

.name {
  font-weight: 700;
  color: #0f172a;
}

.points {
  color: #334155;
  font-size: 0.9rem;
  margin-bottom: 8px;
}

.block {
  background: linear-gradient(180deg, #3b82f6, #5b8df7);
  color: #fff;
  font-weight: 800;
  border-radius: 30px 30px 0 0;
  width: 100%;
  height: 10px;
  display: grid;
  place-items: center;
  box-shadow: 0 10px 22px rgba(59, 130, 246, 0.35);
  font-size: 3rem;
}

.first .block {
  height: 300px;
}

.second .block {
  height: 190px;
}

.third .block {
  height: 130px;
}

/* Loading State */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  color: #2C64E3;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(44, 100, 227, 0.2);
  border-top-color: #2C64E3;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Responsive */
@media (max-width: 980px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
  .grid.categories {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 680px) {
  .container {
    margin: 0 32px;
  }
  
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .grid.categories {
    grid-template-columns: repeat(2, 1fr);
  }
  .banner-img {
    height: 170px;
  }
  
  .podium-title {
    font-size: 1.8rem;
  }
}

@media (max-width: 420px) {
  .container {
    margin: 0 16px;
  }
  
  .grid {
    grid-template-columns: 1fr;
  }
  .grid.categories {
    grid-template-columns: 1fr;
  }
  
  .banner-img {
    height: 140px;
  }
  
  .podium-title {
    font-size: 1.5rem;
  }
}
</style>