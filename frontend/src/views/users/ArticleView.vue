<template>
  <div class="article-page">
    
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">Temukan Berita Terbaru Kami</h1>
          <p class="hero-description">
            Baca berita terkini tentang berbagai topik menarik. Dengan konten yang segar setiap hari dan artikel berkualitas yang disusun oleh tim penulis berpengalaman kami, temukan informasi yang relevan untuk meningkatkan pengalaman membaca Anda.
          </p>
          
          <!-- Search Bar -->
          <div class="search-bar">
            <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input
              type="text"
              v-model="searchQuery"
              @input="goToFirstPage"
              placeholder="Cari berdasarkan judul artikel, kategori..."
              class="search-input"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <section class="main-content">
      <div class="container">
        <div class="content-layout">
          
          <!-- Left Side - Featured Articles -->
          <div class="featured-section">
            <h2 class="section-title">
              Disini kata-kata beristirahat, lalu bangkit menjadi sebuah inspirasi.
            </h2>

              <div v-if="paginatedArticles.length > 0" class="articles-grid">
              <ArticleCard 
                v-for="article in paginatedArticles" 
                :key="article.id" 
                :article="article" 
              />
            </div>

            <!-- Feedback jika kosong -->
            <div v-else class="no-results">
              <div class="no-results-content">
                <i class="fa-solid fa-book-open-reader"></i>
                <h3>Artikel Tidak Ditemukan</h3>
                <p>Maaf, kami tidak menemukan artikel yang Anda cari di koleksi kami.</p>
                <p class="suggestion">Coba gunakan kata kunci lain atau jelajahi koleksi artikel kami.</p>
              </div>
            </div>

            <div 
                class="pagination"
                :class="{ 'hidden-pagination': paginatedArticles.length === 0 }"
                >
                <button class="page-arrow" :disabled="currentPage === 1" @click="goToPage(1)">«</button>
                <button class="page-arrow" :disabled="currentPage === 1" @click="prevPage">‹</button>
                <span class="page-info">{{ currentPage }} dari {{ totalPages }}</span>
                <button class="page-arrow" :disabled="currentPage === totalPages" @click="nextPage">›</button>
                <button class="page-arrow" :disabled="currentPage === totalPages" @click="goToPage(totalPages)">»</button>
            </div>
          </div>


          <!-- Sidebar -->
          <aside class="sidebar">
            <!-- Santren Section -->
            <div class="sidebar-section">
              <h3 class="sidebar-title">Sorotan</h3>
              <div class="sidebar-articles">
                <ArticleListItem 
                  v-for="article in santrenArticles" 
                  :key="article.id"
                  :article="article"
                />
              </div>
            </div>

            <!-- Bidang Hits Section -->
            <div class="sidebar-section">
              <h3 class="sidebar-title">Bidang Hits</h3>
              <div class="sidebar-articles">
                <ArticleListItem 
                  v-for="article in bidangHitsArticles" 
                  :key="article.id"
                  :article="article"
                />
              </div>
            </div>
          </aside>

        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ArticleCard from '@/components/users/ArticleCard.vue'
import ArticleListItem from '@/components/users/ArticleListItem.vue'

const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 6

const featuredArticles = ref([
  { 
    id: 1, 
    title: 'Perpustakaan Sekolah Luncurkan Pojok Baca Digital', 
    excerpt: 'Siswa kini dapat mengakses ribuan e-book dan jurnal akademik melalui platform digital perpustakaan.', 
    image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800', 
    category: 'Koleksi Baru',
    date: '2025-10-10'
  },
  { 
    id: 2, 
    title: 'Tips Menumbuhkan Minat Baca pada Generasi Z', 
    excerpt: 'Strategi efektif untuk membuat siswa lebih tertarik membaca di tengah gempuran media sosial.', 
    image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800', 
    category: 'Literasi',
    date: '2025-10-08'
  },
  { 
    id: 3, 
    title: 'Mengenal Sistem Katalog Digital Perpustakaan', 
    excerpt: 'Panduan lengkap menggunakan OPAC untuk pencarian buku yang lebih mudah dan cepat.', 
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800', 
    category: 'Edukasi',
    date: '2025-10-05'
  },
  { 
    id: 4, 
    title: '10 Buku Wajib untuk Persiapan UTBK 2026', 
    excerpt: 'Rekomendasi buku pendamping yang telah terbukti membantu ribuan siswa lolos PTN impian.', 
    image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800', 
    category: 'Review',
    date: '2025-10-01'
  },
  { 
    id: 5, 
    title: 'Klub Literasi Sekolah Raih Juara Nasional', 
    excerpt: 'Prestasi membanggakan siswa dalam kompetisi bedah buku tingkat nasional 2025.', 
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800', 
    category: 'Prestasi',
    date: '2025-09-28'
  },
  { 
    id: 6, 
    title: 'Cara Efektif Membuat Catatan Membaca', 
    excerpt: 'Teknik note-taking yang terbukti meningkatkan pemahaman dan daya ingat dari buku yang dibaca.', 
    image: 'https://images.unsplash.com/photo-1519682577862-22b62b24e493?w=800', 
    category: 'Tips',
    date: '2025-09-25'
  },
  { 
    id: 7, 
    title: 'Perpustakaan Resmikan Ruang Diskusi Kolaboratif', 
    excerpt: 'Fasilitas baru untuk mendukung pembelajaran kelompok dan presentasi siswa.', 
    image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800', 
    category: 'Fasilitas',
    date: '2025-09-20'
  },
  { 
    id: 8, 
    title: 'Novel Karya Siswa Resmi Masuk Koleksi Perpustakaan', 
    excerpt: 'Karya kreatif siswa kelas XII berhasil diterbitkan dan menjadi inspirasi bagi adik tingkat.', 
    image: 'https://images.unsplash.com/photo-1491841573634-28140fc7ced7?w=800', 
    category: 'Inspirasi',
    date: '2025-09-15'
  },
  { 
    id: 9, 
    title: 'Panduan Memilih Buku Sesuai Minat dan Bakat', 
    excerpt: 'Kenali jenis bacaan yang tepat untuk mengembangkan potensi diri sejak dini.', 
    image: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?w=800', 
    category: 'Panduan',
    date: '2025-09-12'
  },
  { 
    id: 10, 
    title: 'Program Satu Siswa Satu Buku Dimulai', 
    excerpt: 'Gerakan literasi sekolah mendorong setiap siswa menuntaskan minimal satu buku per bulan.', 
    image: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=800', 
    category: 'Program',
    date: '2025-09-08'
  },
  { 
    id: 11, 
    title: 'Koleksi Komik Edukatif Hadir di Perpustakaan', 
    excerpt: 'Alternatif bacaan menarik untuk meningkatkan literasi visual siswa.', 
    image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800', 
    category: 'Koleksi Baru',
    date: '2025-09-05'
  },
  { 
    id: 12, 
    title: 'Workshop Menulis Kreatif untuk Siswa', 
    excerpt: 'Mengasah kemampuan menulis melalui bimbingan penulis profesional.', 
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800', 
    category: 'Acara',
    date: '2025-09-01'
  },
  { 
    id: 13, 
    title: 'Workshop Menulis Kreatif untuk Siswa', 
    excerpt: 'Mengasah kemampuan menulis melalui bimbingan penulis profesional.', 
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800', 
    category: 'Acara',
    date: '2025-09-01'
  }
])

const filteredArticles = computed(() => {
  const q = searchQuery.value.toLowerCase()
  return featuredArticles.value.filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      a.excerpt.toLowerCase().includes(q)
  )
})

const totalPages = computed(() =>
  Math.ceil(filteredArticles.value.length / itemsPerPage)
)

const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredArticles.value.slice(start, start + itemsPerPage)
})

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++
}
function prevPage() {
  if (currentPage.value > 1) currentPage.value--
}
function goToPage(page) {
  currentPage.value = page
}
function goToFirstPage() {
  currentPage.value = 1
}

/* Sidebar dummy data */
const santrenArticles = ref(featuredArticles.value.slice(0, 3))
const bidangHitsArticles = ref(featuredArticles.value.slice(3, 6))
</script>

<style scoped>
.article-page {
  min-height: 100vh;
  background-color: #f9fafb;
}

.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Hero Section */
.hero-section {
  background-color: white;
  padding: 48px 0;
  border-bottom: 1px solid #e5e7eb;
}

.hero-content {
  text-align: center;
  max-width: 768px;
  margin: 0 auto;
}

.hero-title {
  font-size: 36px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 16px;
}

.hero-description {
  color: #4b5563;
  margin-bottom: 32px;
  line-height: 1.6;
}

/* 🔍 Search Bar */
.search-bar {
  position: relative;
  max-width: 700px;
  margin: 0 auto;
}

.search-input {
  width: 100%;
  border: none;
  outline: none;
  background: #fff;
  padding: 14px 20px 14px 45px;
  border-radius: 12px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
  font-size: 14px;
  color: #333;
  transition: all 0.3s ease;
}

.search-input::placeholder {
  color: #9ca3af;
}

.search-input:focus {
  box-shadow: 0 2px 10px rgba(37, 99, 235, 0.2);
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--primary);
  width: 18px;
  height: 18px;
  pointer-events: none;
}

/* Main Content */
.main-content {
  padding: 48px 0;
}

.content-layout {
  display: flex;
  gap: 32px;
}

.featured-section {
    flex: 1;
    min-width: 0;
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 24px;
}

.no-results {
  grid-column: 1 / -1; /* Memenuhi seluruh grid */
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 40px 20px;
}

.no-results-content {
  text-align: center;
  max-width: 400px;
}

.no-results-content i {
  font-size: 4rem;
  color: #9ca3af;
  margin-bottom: 20px;
  opacity: 0.6;
}

.no-results-content h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
}

.no-results-content p {
  font-size: 1rem;
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 8px;
}

.no-results-content .suggestion {
  font-size: 0.9rem;
  color: #9ca3af;
  font-style: italic;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

/* Pagination Styling */
.pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-top: 32px;
    background: white;
    border-radius: 9999px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    padding: 6px 12px;
    width: fit-content;
    margin-inline: auto;
}

.hidden-pagination {
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.page-arrow {
  border: none;
  background: transparent;
  color: var(--primary);
  font-size: 18px;
  padding: 6px 10px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.page-arrow:disabled {
  opacity: 0.3;
  cursor: default;
}

.page-info {
  font-weight: 600;
  color: #111827;
}

/* Sidebar */
.sidebar {
  width: 350px;
  flex-shrink: 0;
}

.sidebar-section {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 24px;
}

.sidebar-title {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 16px;
}

.sidebar-articles {
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* Responsive */
@media (max-width: 1024px) {
  .content-layout {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
  }

  .articles-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 28px;
  }

  .section-title {
    font-size: 20px;
  }

  .articles-grid {
    grid-template-columns: 1fr;
  }

  .search-input {
    padding-right: 20px;
  }

  .search-button {
    position: static;
    transform: none;
    width: 100%;
    margin-top: 12px;
  }

  .search-container {
    display: flex;
    flex-direction: column;
  }
}
</style>
