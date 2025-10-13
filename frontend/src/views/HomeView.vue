<template>
  <div class="home">
    <!-- Top banner image -->
    <section class="container banner">
      <div class="banner-img" role="img" aria-label="Rak buku perpustakaan"></div>
    </section>

    <!-- Rekomendasi Koleksi -->
    <section class="container section">
      <div class="section-header">
        <h3>Rekomendasi Koleksi</h3>
        <a href="#" class="see-all">Lihat semua</a>
      </div>
      <div class="grid">
        <!-- Jika ada data dari database -->
        <BookCard
          v-for="(book, index) in displayBooks"
          :key="book.id || `rec-${index}`"
          :book="book"
          :index="index + 1"
          @click="handleBookClick"
        />
      </div>
    </section>

    <!-- Pilih Buku Berdasarkan -->
    <section class="container section">
      <div class="section-header">
        <h3>Pilih Buku Berdasarkan</h3>
        <a href="#" class="see-all">Lihat lainnya</a>
      </div>
      <div class="grid">
        <!-- Jika ada data dari database -->
        <CategoryCard
          v-for="(category, index) in displayCategories"
          :key="category.id || `cat-${index}`"
          :category="category"
          :index="index + 1"
          @click="handleCategoryClick"
        />
      </div>
    </section>

    <!-- Wave + Podium Top Readers -->
    <section class="podium">
      <div class="podium-inner container">
        <div class="podium-title">Penikmat Koleksi <span>Tahun 2025</span></div>
        <div class="steps">
          <div class="step second">
            <div class="avatar crown silver">🥈</div>
            <div class="name">Gendis</div>
            <div class="points">2 Peminjaman</div>
            <div class="block">2nd</div>
          </div>
          <div class="step first">
            <div class="avatar crown gold">👑</div>
            <div class="name">Rafif</div>
            <div class="points">3 Peminjaman</div>
            <div class="block">1st</div>
          </div>
          <div class="step third">
            <div class="avatar crown bronze">🥉</div>
            <div class="name">Naila</div>
            <div class="points">1 Peminjaman</div>
            <div class="block">3rd</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import BookCard from '../components/BookCard.vue'
import CategoryCard from '../components/CategoryCard.vue'

// State untuk data dari database
const books = ref([])
const categories = ref([])
const loading = ref(true)

// Computed untuk menampilkan data atau placeholder
const displayBooks = computed(() => {
  // Jika ada data dari database, tampilkan data
  if (books.value.length > 0) {
    return books.value.slice(0, 8)
  }
  // Jika tidak ada, tampilkan 8 placeholder
  return Array(8).fill({})
})

const displayCategories = computed(() => {
  // Jika ada data dari database, tampilkan data
  if (categories.value.length > 0) {
    return categories.value.slice(0, 6)
  }
  // Jika tidak ada, tampilkan 6 placeholder
  return Array(6).fill({})
})

// Fetch data dari API
const fetchBooks = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/books/recommended')
    if (response.ok) {
      const data = await response.json()
      books.value = data
    }
  } catch (error) {
    console.error('Error fetching books:', error)
    // Tetap gunakan placeholder jika error
  }
}

const fetchCategories = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/categories')
    if (response.ok) {
      const data = await response.json()
      categories.value = data
    }
  } catch (error) {
    console.error('Error fetching categories:', error)
    // Tetap gunakan placeholder jika error
  }
}

// Handle click events
const handleBookClick = (book) => {
  if (book.id) {
    console.log('Book clicked:', book)
    // Redirect ke detail buku atau buka modal
    // router.push(`/buku/${book.id}`)
  }
}

const handleCategoryClick = (category) => {
  if (category.id) {
    console.log('Category clicked:', category)
    // Redirect ke halaman kategori
    // router.push(`/kategori/${category.id}`)
  }
}

// Load data saat component di-mount
onMounted(async () => {
  loading.value = true
  await Promise.all([fetchBooks(), fetchCategories()])
  loading.value = false
})
</script>

<style scoped>
:root {
  --primary: #3b82f6;
  --primary-2: #5b8df7;
  --text: #1f2937;
}

.home {
  background: #ffffff;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
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

.see-all {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 600;
}

.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
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
  margin: 0 auto 16px;
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
  border-radius: 50px 50px 0 0;
  width: 100%;
  height: 70px;
  display: grid;
  place-items: center;
  box-shadow: 0 10px 22px rgba(59, 130, 246, 0.35);
}

.first .block {
  height: 100px;
}

.second .block {
  height: 85px;
}

.third .block {
  height: 70px;
}

/* Responsive */
@media (max-width: 980px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 680px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .banner-img {
    height: 170px;
  }
}

@media (max-width: 420px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>