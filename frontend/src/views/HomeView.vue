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
        <RouterLink to="/cari" class="see-all">Lihat semua</RouterLink>
      </div>
      <div class="grid">
        <BookCard
          v-for="(book, index) in displayBooks"
          :key="book.id || `rec-${index}`"
          :book="book"
          :index="index + 1"
          @click="handleBookClick"
        />
      </div>
    </section>

    <!-- Pilih Buku Berdasarkan Kategori -->
    <section class="container section">
      <div class="section-header">
        <h3>Pilih Buku Berdasarkan</h3>
        <a href="#" class="see-all">Lihat lainnya</a>
      </div>
      <div class="grid categories">
        <CategoryCard
          v-for="(category, index) in categories"
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
import { useRouter } from 'vue-router'
import BookCard from '../components/users/BookCard.vue'
import CategoryCard from '../components/users/CategoryCard.vue'

const router = useRouter()

// State untuk data dari database
const books = ref([])
const loading = ref(true)

// Kategori berdasarkan genre buku dari database
const categories = ref([
  { id: 1, name: 'Fiksi', bookCount: 0, icon: '📖', color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { id: 2, name: 'Fiksi Fantasi', bookCount: 0, icon: '🐉', color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { id: 3, name: 'Romansa', bookCount: 0, icon: '💕', color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
  { id: 4, name: 'Komedi', bookCount: 0, icon: '😂', color: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)' },
  { id: 5, name: 'Pengembangan Diri', bookCount: 0, icon: '🌱', color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' },
  { id: 6, name: 'Ekonomi', bookCount: 0, icon: '💰', color: 'linear-gradient(135deg, #ffd89b 0%, #19547b 100%)' },
  { id: 7, name: 'Klasik', bookCount: 0, icon: '📚', color: 'linear-gradient(135deg, #868f96 0%, #596164 100%)' },
  { id: 8, name: 'Motivasi', bookCount: 0, icon: '🔥', color: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)' }
])

// Computed untuk menampilkan data atau placeholder
const displayBooks = computed(() => {
  if (books.value.length > 0) {
    return books.value.slice(0, 8)
  }
  return Array(8).fill({})
})

// Fetch data dari API
const fetchBooks = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/books')
    if (response.ok) {
      const data = await response.json()
      books.value = data
      
      // Hitung jumlah buku per kategori
      updateCategoryCount(data)
    }
  } catch (error) {
    console.error('Error fetching books:', error)
  }
}

// Update jumlah buku per kategori
const updateCategoryCount = (booksData) => {
  categories.value.forEach(category => {
    const count = booksData.filter(book => book.kategori === category.name).length
    category.bookCount = count
  })
  
  // Filter hanya kategori yang memiliki buku
  categories.value = categories.value.filter(cat => cat.bookCount > 0)
}

// Handle click events
const handleBookClick = (book) => {
  if (book.id) {
    console.log('Book clicked:', book)
    router.push(`/buku/${book.id}`)
  }
}

const handleCategoryClick = (category) => {
  if (category.name) {
    console.log('Category clicked:', category)
    router.push(`/cari?kategori=${encodeURIComponent(category.name)}`)
  }
}

// Load data saat component di-mount
onMounted(async () => {
  loading.value = true
  await fetchBooks()
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
  color: var(--primary);
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s;
}

.see-all:hover {
  color: var(--primary);
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
  margin: 0 auto 16px;
}

.podium-title span {
  color: var(--primary);
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
  background: var(--primary);
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
  .grid.categories {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 680px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .grid.categories {
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
  .grid.categories {
    grid-template-columns: 1fr;
  }
}
</style>