<template>
  <div class="home">
    <!-- Top banner image -->
    <section class="container banner">
      <div class="banner-img" role="img" aria-label="Rak buku perpustakaan"></div>
    </section>

    <!-- Top 10 Book -->
    <section class="container section stack">
      <StackPopBook
        v-if="topBooks.length > 0"
        :books="topBooks"
        :autoplay="true"
        :interval="5000"
        @view-book="handleViewBook"
      />
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

const router = useRouter()

// State untuk data dari database
const books = ref([])
const loading = ref(true)

// Data rekomendasi buku (bisa diganti dengan data dari API)
const recommendedBooks = ref([
  {
    id: 1,
    title: "Filosofi Teras",
    author: "Henry Manampiring",
    rating: 4.5,
    cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop"
  },
  {
    id: 2,
    title: "Atomic Habits",
    author: "James Clear",
    rating: 5,
    cover: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=300&h=400&fit=crop"
  },
  {
    id: 3,
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    rating: 4.8,
    cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop"
  },
  {
    id: 4,
    title: "Laskar Pelangi",
    author: "Andrea Hirata",
    rating: 4.7,
    cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop"
  },
  {
    id: 5,
    title: "Bumi Manusia",
    author: "Pramoedya Ananta Toer",
    rating: 4.9,
    cover: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=300&h=400&fit=crop"
  },
  {
    id: 6,
    title: "Cantik Itu Luka",
    author: "Eka Kurniawan",
    rating: 4.6,
    cover: "https://images.unsplash.com/photo-1513001900722-370f803f498d?w=300&h=400&fit=crop"
  },
  {
    id: 6,
    title: "Cantik Itu Luka",
    author: "Eka Kurniawan",
    rating: 4.6,
    cover: "https://images.unsplash.com/photo-1513001900722-370f803f498d?w=300&h=400&fit=crop"
  },
    {
    id: 6,
    title: "Cantik Itu Luka",
    author: "Eka Kurniawan",
    rating: 4.6,
    cover: "https://images.unsplash.com/photo-1513001900722-370f803f498d?w=300&h=400&fit=crop"
  },
      {
    id: 6,
    title: "Cantik Itu Luka",
    author: "Eka Kurniawan",
    rating: 4.6,
    cover: "https://images.unsplash.com/photo-1513001900722-370f803f498d?w=300&h=400&fit=crop"
  },
      {
    id: 6,
    title: "Cantik Itu Luka",
    author: "Eka Kurniawan",
    rating: 4.6,
    cover: "https://images.unsplash.com/photo-1513001900722-370f803f498d?w=300&h=400&fit=crop"
  }
])

// Data buku baru (duplikat untuk demo, bisa diganti dengan data dari API)
const newArrivals = ref([...recommendedBooks.value])

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

// Computed property untuk Top 10 Buku dari database
const topBooks = computed(() => {
  if (!books.value || books.value.length === 0) {
    // Fallback ke dummy data jika database kosong
    return [
      {
        id: 1,
        title: 'See You Again Love',
        author: 'Avryn Delvina',
        rating: 4,
        cover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop',
        synopsis: 'Kisah cinta yang penuh lika-liku antara dua insan yang dipertemukan kembali oleh takdir. Sebuah perjalanan emosional yang menghangatkan hati dan mengajarkan arti cinta sejati yang tak pernah pudar oleh waktu.'
      },
      {
        id: 2,
        title: 'Midnight Library',
        author: 'Matt Haig',
        rating: 5,
        cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop',
        synopsis: 'Antara hidup dan mati terdapat perpustakaan yang menyimpan semua kemungkinan hidup yang berbeda. Setiap buku memberi kesempatan untuk melihat bagaimana hidup bisa berjalan jika keputusan berbeda diambil.'
      },
      {
        id: 3,
        title: 'The Silent Patient',
        author: 'Alex Michaelides',
        rating: 5,
        cover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop',
        synopsis: 'Seorang wanita yang membunuh suaminya kemudian berhenti berbicara. Seorang psikolog terpikat untuk mengungkap misterinya. Thriller psikologis yang akan membuat Anda terpaku hingga halaman terakhir.'
      },
      {
        id: 4,
        title: 'Atomic Habits',
        author: 'James Clear',
        rating: 5,
        cover: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&h=600&fit=crop',
        synopsis: 'Panduan praktis untuk membangun kebiasaan baik dan menghilangkan kebiasaan buruk. Pelajari bagaimana perubahan kecil dapat menghasilkan hasil yang luar biasa dalam hidup Anda.'
      },
      {
        id: 5,
        title: 'Where the Crawdads Sing',
        author: 'Delia Owens',
        rating: 4,
        cover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop',
        synopsis: 'Kisah mengharukan tentang gadis yang tumbuh sendirian di rawa-rawa Carolina Utara. Sebuah misteri pembunuhan yang terjerat dengan cerita tentang ketahanan, cinta, dan keindahan alam.'
      },
      {
        id: 6,
        title: 'The Seven Husbands of Evelyn Hugo',
        author: 'Taylor Jenkins Reid',
        rating: 5,
        cover: 'https://images.unsplash.com/photo-1535666669445-e8c15cd2e7d9?w=400&h=600&fit=crop',
        synopsis: 'Ikon Hollywood yang sudah pensiun akhirnya siap menceritakan kisah hidupnya yang penuh skandal, ambisi, dan cinta terlarang yang membentuk kariernya yang gemilang.'
      },
      {
        id: 7,
        title: 'The Alchemist',
        author: 'Paulo Coelho',
        rating: 4,
        cover: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop',
        synopsis: 'Sebuah fabel tentang mengikuti impian Anda. Perjalanan seorang penggembala muda dari Spanyol ke piramida Mesir mengajarkan pelajaran hidup yang mendalam tentang mendengarkan hati kita.'
      },
      {
        id: 8,
        title: 'Educated',
        author: 'Tara Westover',
        rating: 5,
        cover: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400&h=600&fit=crop',
        synopsis: 'Memoar yang luar biasa tentang seorang wanita yang tumbuh di keluarga survivalis di Idaho dan tidak pernah bersekolah, namun berhasil meraih gelar PhD dari Cambridge University.'
      },
      {
        id: 9,
        title: 'The Song of Achilles',
        author: 'Madeline Miller',
        rating: 5,
        cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop',
        synopsis: 'Kisah epik tentang cinta antara Achilles, pahlawan terbesar Yunani, dan Patroclus, sahabatnya. Sebuah retelling mitologi Yunani yang memukau dan penuh emosi.'
      },
      {
        id: 10,
        title: 'Sapiens',
        author: 'Yuval Noah Harari',
        rating: 5,
        cover: 'https://images.unsplash.com/photo-1495640452828-3df6795cf69b?w=400&h=600&fit=crop',
        synopsis: 'Sebuah eksplorasi brilian tentang sejarah umat manusia dari Zaman Batu hingga era modern, mengungkap bagaimana Homo sapiens menjadi spesies dominan di planet ini.'
      }
    ]
  }

  // Ambil 10 buku terpopuler dari database
  return books.value
    .slice(0, 10)
    .map(book => ({
      id: book.id,
      title: book.judul || book.title,
      author: book.penulis || book.author,
      rating: book.rating || 4,
      cover: book.sampul || book.cover || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop',
      synopsis: book.sinopsis || book.synopsis || 'Tidak ada sinopsis tersedia.'
    }))
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
const handleViewBook = (book) => {
  console.log('Viewing book from carousel:', book)
  if (book.id) {
    router.push(`/buku/${book.id}`)
  }
}

const handleBookClick = (book) => {
  if (book.id) {
    console.log('Book clicked:', book)
    router.push(`/buku/${book.id}`)
  }
}

const handleViewAll = (section) => {
  console.log('View all:', section)
  router.push('/cari')
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