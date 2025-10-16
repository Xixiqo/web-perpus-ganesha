<template>
  <div class="book-detail-container">
    <div class="book-detail-wrapper">
      <!-- Left Side - Book Cover (Sticky) -->
      <aside class="book-cover-section">
          <button class="btn-back" @click="goBack">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Kembali
          </button>
        <div class="book-cover-sticky">
            <img 
              :src="book.coverImage" 
              :alt="book.title" 
              class="book-cover" 
              @error="onImageError"
            />

          
          <!-- Action Buttons -->
          <div class="action-buttons">
            <button class="btn-primary">
              Pinjam Buku
            </button>
          </div>

          <!-- Action Icons -->
          <div class="action-icons">
            <button :class="['icon-btn save', { active: isBookmarked }]" @click="saveToCollection" title="Simpan ke Koleksi">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" :fill="isBookmarked ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
            </button>
            <button :class="['icon-btn like', { active: isFavorited }]" @click="addToFavorites" title="Sukai">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" :fill="isFavorited ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
            <button class="icon-btn share" @click="shareBook" title="Bagikan">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
              </svg>
            </button>
          </div>
        </div>
      </aside>

      <!-- Right Side - Book Details -->
      <main class="book-info-section">
        <!-- Book Title & Meta -->
        <div class="book-header">
          <h1 class="book-title">{{ book.title }}</h1>
          <p class="book-author">oleh <a :href="book.authorLink" class="author-link">{{ book.author }}</a> | {{ book.publishDate }}</p>
          
          <!-- Rating & Badges -->
          <div class="book-meta">
            <div class="rating">
              <div class="stars">
                <span v-for="i in 5" :key="i" :class="i <= book.rating ? 'star filled' : 'star'">★</span>
              </div>
              <span class="rating-text">({{ book.reviewCount }} reviews)</span>
              <span class="reader-count">• {{ book.readerCount }} pembaca</span>
            </div>
            
            <div class="badges">
              <span class="badge badge-first" v-if="book.isFirstRead">📖 First Read</span>
              <span class="badge badge-best" v-if="book.isBestOfMonth">🔥 Best Of Month</span>
              <span class="badge badge-choice" v-if="book.isReaderChoice">⭐ Reader Choice</span>
            </div>
          </div>
        </div>

        <!-- Description -->
        <div class="book-description">
          <p>{{ book.description }}</p>
          <a :href="book.bookLink" class="read-more">Baca review lengkap →</a>
        </div>

        <!-- Detail Buku -->
        <section class="book-details">
          <h2 class="section-title">Detail Buku</h2>
          <div class="details-grid">
            <div class="detail-item">
              <span class="detail-label">Penerbit</span>
              <span class="detail-value">{{ book.publisher }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Tanggal Terbit</span>
              <span class="detail-value">{{ book.publishDate }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">ISBN</span>
              <span class="detail-value">{{ book.isbn }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Halaman</span>
              <span class="detail-value">{{ book.pages }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Bahasa</span>
              <span class="detail-value">{{ book.language }}</span>
            </div>
          </div>
        </section>

        <!-- Ketersediaan Buku -->
        <section class="book-availability">
          <h2 class="section-title">Lokasi dan Ketersediaan</h2>
          <div class="availability-table">
            <div class="availability-header">
              <div class="col-location">Lokasi dan Nomor Panggil</div>
              <div class="col-code">Kode Buku</div>
              <div class="col-status">Status</div>
            </div>
            <div v-for="item in book.availability" :key="item.code" class="availability-row">
              <div class="col-location">
                <div class="location-name">{{ item.location }}</div>
                <div class="call-number">{{ item.callNumber }}</div>
              </div>
              <div class="col-code">{{ item.code }}</div>
              <div class="col-status">
                <span :class="['status-badge', `status-${item.status.toLowerCase()}`]">
                  <span v-if="item.status === 'Tersedia'">✓</span>
                  <span v-else-if="item.status === 'Dipinjam'">📚</span>
                  <span v-else>⏱</span>
                  {{ item.status }}
                </span>
              </div>
            </div>
          </div>
        </section>

        <!-- Buku Lainnya -->
        <section class="related-books">
          <h2 class="section-title">Buku Lainnya</h2>
          <div class="books-grid">
            <div v-for="relatedBook in book.relatedBooks" :key="relatedBook.id" class="related-book-card">
              <img :src="relatedBook.cover" :alt="relatedBook.title" class="related-book-cover" />
              <div class="related-book-info">
                <h4 class="related-book-title">{{ relatedBook.title }}</h4>
                <p class="related-book-author">oleh {{ relatedBook.author }} | {{ relatedBook.year }}</p>
                <div class="related-book-rating">
                  <span class="stars-small">★★★★★</span>
                  <span class="rating-count">({{ relatedBook.reviews }})</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>

    <!-- Alert Notifications -->
    <transition name="slide-fade">
      <div v-if="alert.show" :class="['alert-notification', `alert-${alert.type}`]">
        <div class="alert-icon">
          <span v-if="alert.type === 'success'">●</span>
          <span v-if="alert.type === 'error'">●</span>
          <span v-if="alert.type === 'warning'">●</span>
          <span v-if="alert.type === 'info'">●</span>
          <span v-if="alert.type === 'favorite'">●</span>
          <span v-if="alert.type === 'library'">●</span>
        </div>
        <div class="alert-content">
          <span class="alert-message">{{ alert.message }}</span>
          <span v-if="alert.action" class="alert-action">{{ alert.action }}</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const isBookmarked = ref(false)
const isFavorited = ref(false)

const onImageError = (event) => {
  event.target.src = '/placeholder-cover.svg'
}

const book = ref({
  title: 'The Watchmaker of Filigree Street',
  author: 'Natasha Pulley',
  publishDate: 'Jul 2015',
  coverImage: '/placeholder-cover.svg',
  bookLink:'https://www.goodreads.com/book/show/22929563-the-watchmaker-of-filigree-street',
  rating: 4,
  reviewCount: 156,
  readerCount: 4872,
  isFirstRead: false,
  isBestOfMonth: true,
  isReaderChoice: true,
  description: 'Novel fiksi historis yang memukau berlatar London era Victoria tahun 1883. Menceritakan Thaniel Steepleton, seorang telegrafis yang menemukan jam saku misterius di mejanya setelah serangkaian serangan bom teroris. Jam tersebut membawanya ke toko jam tangan di Filigree Street milik Keita Mori, seorang pembuat jam Jepang yang penuh misteri. Dengan elemen fantasi ringan, steampunk, dan romance yang halus, novel ini mengeksplorasi tema waktu, takdir, dan hubungan antarmanusia dengan gaya penulisan yang puitis.',
  publisher: 'Bloomsbury Publishing',
  isbn: '978-1620408339',
  pages: '336',
  language: 'English',
  category: 'Historical Fiction, Fantasy',
  genre: ['Historical Fiction', 'Fantasy', 'Mystery', 'LGBT', 'Steampunk'],
  availability: [
    { location: 'Ganesha Lantai 1', callNumber: '823.92 PUL W', code: '3421', status: 'Tersedia' },
    { location: 'Ganesha Lantai 1', callNumber: '823.92 PUL W', code: '3422', status: 'Tersedia' },
    { location: 'Ganesha Lantai 1', callNumber: '823.92 PUL W', code: '3423', status: 'Dipinjam' }
  ],
  
  relatedBooks: [
  { 
    id: 1, 
    title: 'The Bedlam Stacks', 
    author: 'Natasha Pulley', 
    year: '2017', 
    reviews: 89,
    cover: 'https://covers.openlibrary.org/b/id/8308654-L.jpg'
  },
  { 
    id: 2, 
    title: 'The Lost Future of Pepperharrow', 
    author: 'Natasha Pulley', 
    year: '2020', 
    reviews: 112,
    cover: 'https://covers.openlibrary.org/b/id/10529531-L.jpg'
  },
  { 
    id: 3, 
    title: 'The Invisible Library', 
    author: 'Genevieve Cogman', 
    year: '2015', 
    reviews: 203,
    cover: 'https://covers.openlibrary.org/b/id/8376302-L.jpg'
  },
  { 
    id: 4, 
    title: 'Sorcerer to the Crown', 
    author: 'Zen Cho', 
    year: '2015', 
    reviews: 167,
    cover: 'https://covers.openlibrary.org/b/id/8376301-L.jpg'
  }
  ],
  reviews: [
    { id: 1, name: 'Rina Wijaya', date: '3 minggu lalu', rating: 5, text: 'Novel yang sangat unik! Perpaduan antara fiksi historis Victorian era dengan elemen fantasi yang subtle. Karakternya kompleks dan well-developed, terutama Mori yang penuh misteri. Pacing-nya memang agak lambat di awal, tapi worldbuilding-nya luar biasa detail.' },
    { id: 2, name: 'Ahmad Rizki', date: '1 bulan lalu', rating: 4, text: 'Atmosfernya amazing banget, bener-bener berasa di London 1880-an. Twist tentang jam dan kemampuan Mori bikin penasaran terus. Romance-nya subtle dan nggak cheesy. Recommended buat yang suka historical fiction dengan sentuhan magic realism!' },
    { id: 3, name: 'Dea Maharani', date: '2 bulan lalu', rating: 5, text: 'Salah satu buku favorit! Gaya penulisan Pulley itu puitis tapi nggak bertele-tele. Eksplor budaya Jepang dan Inggris di era Victoria dengan respect. Hubungan Thaniel dan Mori dikembangkan dengan natural. Clockwork octopus-nya adorable!' }
  ]
})

// Build full URL for cover filenames or use existing absolute URLs
const getCoverUrl = (filename) => {
  const base = import.meta.env.VITE_API_BASE || 'http://localhost:5000'
  if (!filename) return '/placeholder-cover.svg'
  if (/^https?:\/\//i.test(filename)) return filename
  return `${base}/uploads/${filename}`
}

const route = useRoute()

onMounted(async () => {
  const id = route.params.id
  if (id) {
    try {
      const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:5000'
      const res = await fetch(`${apiBase}/api/books/${id}`)
      if (res.ok) {
        const data = await res.json()
        // data should include `cover` field with filename
        book.value = {
          ...book.value,
          title: data.judul || data.title || book.value.title,
          author: data.pembuat || data.author || book.value.author,
          publishDate: data.tahun_rilis || book.value.publishDate,
          coverImage: getCoverUrl(data.cover),
          description: data.sinopsis || data.description || book.value.description,
          publisher: data.penerbit || book.value.publisher,
          isbn: data.isbn_issn || book.value.isbn,
          pages: data.halaman || book.value.pages,
          language: data.bahasa_buku || book.value.language,
          relatedBooks: (data.relatedBooks || book.value.relatedBooks).map(rb => ({
            ...rb,
            cover: getCoverUrl(rb.cover || rb.sampul || rb.cover)
          }))
        }
      }
    } catch (err) {
      console.error('Failed to fetch book details', err)
    }
  }
})

const goBack = () => {
  window.history.back()
}

const alert = reactive({
  show: false,
  type: 'success',
  message: '',
  action: ''
})

const showAlert = (type, message, action = '') => {
  alert.type = type
  alert.message = message
  alert.action = action
  alert.show = true
  
  setTimeout(() => {
    alert.show = false
  }, 4000)
}

const saveToCollection = () => {
  isBookmarked.value = !isBookmarked.value
  if (isBookmarked.value) {
    showAlert('library', 'This book is now on your library.', 'My Library')
  } else {
    showAlert('info', 'Buku dihapus dari koleksi Anda.')
  }
}

const addToFavorites = () => {
  isFavorited.value = !isFavorited.value
  if (isFavorited.value) {
    showAlert('favorite', 'This book just made it to your favourites!', 'My Favourite')
  } else {
    showAlert('info', 'Buku dihapus dari favorit Anda.')
  }
}

const shareBook = () => {
  if (navigator.share) {
    navigator.share({
      title: book.value.title,
      text: `Baca buku "${book.value.title}" oleh ${book.value.author}`,
      url: window.location.href
    }).then(() => {
      showAlert('success', 'Buku berhasil dibagikan!')
    }).catch(() => {
      copyToClipboard()
    })
  } else {
    copyToClipboard()
  }
}

const copyToClipboard = () => {
  navigator.clipboard.writeText(window.location.href)
  showAlert('info', 'Link buku berhasil disalin ke clipboard!')
}
</script>

<style scoped>
.book-detail-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 20px;
  background: #FAFAFA;
}

.book-detail-wrapper {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 60px;
  align-items: start;
}

/* Left Side - Book Cover */
.book-cover-section {
  position: relative;
}

.book-cover-sticky {
  position: sticky;
  top: 20px;
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.btn-back {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  margin-bottom: 20px;
  background: #F3F4F6;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-back:hover {
  background: #E5E7EB;
  color: #111827;
}

.btn-back svg {
  transition: transform 0.3s ease;
}

.btn-back:hover svg {
  transform: translateX(-4px);
}

.book-cover {
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  margin-bottom: 24px;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.btn-primary, .btn-secondary {
  padding: 14px 20px;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-primary {
  background: #2C64F9;
  color: white;
}

.btn-primary:hover {
  background: #1e4ed8;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(44, 100, 249, 0.3);
}

.btn-secondary {
  background: #F3F4F6;
  color: #374151;
}

.btn-secondary:hover {
  background: #E5E7EB;
}

.share-icons {
  display: flex;
  justify-content: center;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #E5E7EB;
}

.action-icons {
  display: flex;
  justify-content: center;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #E5E7EB;
}

.icon-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: #F3F4F6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #6B7280;
}

.icon-btn.save:hover {
  background: #ffc8004b;
  color: #131313;
  transform: translateY(-2px);
}

.icon-btn.save.active {
  background: #ffc8004b;
  color: #ffc800;
;
}

.icon-btn.save.active:hover {
  background: #ffc8004b;
}

.icon-btn.like:hover {
  background: #d9467e35;
  color: #D9467F;
  transform: translateY(-2px);
}

.icon-btn.like.active {
  background: #d9467e35;
  color: #D9467F;
}

.icon-btn.like.active:hover {
  background: #13131325;
}

.icon-btn.share:hover {
  background: #13131325;
  color: #131313;
  transform: translateY(-2px);
}

.icon-btn.share.active {
  background: #13131325;
  color: #131313;
}

.icon-btn.share.active:hover {
  background: #13131325;
}

.book-info-section {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.book-header {
  margin-bottom: 32px;
}

.book-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 12px;
  line-height: 1.2;
}

.book-author {
  font-size: 1.1rem;
  color: #6B7280;
  margin-bottom: 16px;
}

.author-link {
  color: #2C64F9;
  text-decoration: none;
  font-weight: 600;
}

.author-link:hover {
  text-decoration: underline;
}

.book-meta {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.rating {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stars {
  display: flex;
  gap: 2px;
}

.star {
  color: #D1D5DB;
  font-size: 1.2rem;
}

.star.filled {
  color: #FBBF24;
}

.rating-text, .reader-count {
  font-size: 0.9rem;
  color: #6B7280;
}

.badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.badge {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.badge-first {
  background: #FEF3C7;
  color: #92400E;
}

.badge-best {
  background: #FEE2E2;
  color: #991B1B;
}

.badge-choice {
  background: #DBEAFE;
  color: #1E40AF;
}

.book-description {
  margin-bottom: 40px;
  padding: 24px;
  background: #F9FAFB;
  border-radius: 8px;
  border-left: 4px solid #2C64F9;
}

.book-description p {
  font-size: 1rem;
  line-height: 1.7;
  color: #374151;
  margin-bottom: 12px;
}

.read-more {
  color: #2C64F9;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
}

.read-more:hover {
  text-decoration: underline;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid #E5E7EB;
}

.book-details {
  margin-bottom: 40px;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-label {
  font-size: 0.85rem;
  color: #6B7280;
  font-weight: 500;
}

.detail-value {
  font-size: 1rem;
  color: #111827;
  font-weight: 600;
}

/* Availability Table */
.book-availability {
  margin-bottom: 40px;
}

.availability-table {
  background: #F9FAFB;
  border-radius: 8px;
  overflow: hidden;
}

.availability-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 16px;
  padding: 16px 20px;
  background: #DBEAFE;
  font-weight: 600;
  font-size: 0.9rem;
  color: #1E40AF;
}

.availability-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 16px;
  padding: 16px 20px;
  border-bottom: 1px solid #E5E7EB;
}

.availability-row:last-child {
  border-bottom: none;
}

.location-name {
  font-weight: 600;
  color: #111827;
  margin-bottom: 4px;
}

.call-number {
  font-size: 0.85rem;
  color: #6B7280;
}

.col-code {
  display: flex;
  align-items: center;
  font-weight: 600;
  color: #374151;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.status-tersedia {
  background: #D1FAE5;
  color: #065F46;
}

.status-dipinjam {
  background: #FEF3C7;
  color: #92400E;
}

.status-tidak {
  background: #F3F4F6;
  color: #6B7280;
}

/* Author Card */
.about-author {
  margin-bottom: 40px;
}

.author-card {
  display: flex;
  gap: 20px;
  padding: 24px;
  background: #F9FAFB;
  border-radius: 8px;
}

.author-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}

.author-info {
  flex: 1;
}

.author-name {
  font-size: 1.2rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 8px;
}

.author-bio {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #374151;
  margin-bottom: 12px;
}

.view-profile {
  color: #2C64F9;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
}

.view-profile:hover {
  text-decoration: underline;
}

/* Related Books */
.related-books {
  margin-bottom: 40px;
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.related-book-card {
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
}

.related-book-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
}

.related-book-cover {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.related-book-info {
  padding: 16px;
}

.related-book-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 6px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.related-book-author {
  font-size: 0.8rem;
  color: #6B7280;
  margin-bottom: 8px;
}

.related-book-rating {
  display: flex;
  align-items: center;
  gap: 6px;
}

.stars-small {
  color: #FBBF24;
  font-size: 0.85rem;
}

.rating-count {
  font-size: 0.8rem;
  color: #6B7280;
}

.btn-view-all {
  width: 100%;
  padding: 14px;
  background: white;
  border: 2px solid #E5E7EB;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-view-all:hover {
  border-color: #2C64F9;
  color: #2C64F9;
  background: #F9FAFB;
}

@media (max-width: 1024px) {
  .book-detail-wrapper {
    grid-template-columns: 1fr;
  }
  
  .book-cover-sticky {
    position: static;
  }
  
  .books-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .details-grid {
    grid-template-columns: 1fr;
  }
  
  .availability-header, .availability-row {
    grid-template-columns: 1fr;
  }
  
  .books-grid {
    grid-template-columns: 1fr;
  }
}

/* Alert Notifications */
.alert-notification {
  position: fixed;
  bottom: 24px;
  right: 24px;
  min-width: 320px;
  max-width: 420px;
  padding: 16px 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 9999;
  border-left: 4px solid;
}

.alert-success {
  background: #D1FAE5;
  border-left-color: #059669;
  color: #065F46;
}

.alert-error {
  background: #FEE2E2;
  border-left-color: #DC2626;
  color: #991B1B;
}

.alert-warning {
  background: #FEF3C7;
  border-left-color: #F59E0B;
  color: #92400E;
}

.alert-info {
  background: #DBEAFE;
  border-left-color: #3B82F6;
  color: #1E40AF;
}

.alert-favorite {
  background: #FCE7F3;
  border-left-color: #EC4899;
  color: #9F1239;
}

.alert-library {
  background: #EDE9FE;
  border-left-color: #8B5CF6;
  color: #5B21B6;
}

.alert-icon {
  font-size: 1.2rem;
  line-height: 1;
}

.alert-success .alert-icon span { color: #059669; }
.alert-error .alert-icon span { color: #DC2626; }
.alert-warning .alert-icon span { color: #F59E0B; }
.alert-info .alert-icon span { color: #3B82F6; }
.alert-favorite .alert-icon span { color: #EC4899; }
.alert-library .alert-icon span { color: #8B5CF6; }

.alert-content {
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.alert-message {
  font-size: 0.95rem;
  font-weight: 500;
  line-height: 1.4;
}

.alert-action {
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  opacity: 0.9;
}

.alert-action:hover {
  opacity: 1;
  text-decoration: underline;
}

/* Transition Animation */
.slide-fade-enter-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.slide-fade-leave-active {
  transition: all 0.3s ease-out;
}

.slide-fade-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>