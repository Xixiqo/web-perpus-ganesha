<template>
  <div class="book-detail-container">
    <!-- Loading State -->
    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>Memuat detail buku...</p>
    </div>

    <!-- Content -->
    <div v-else-if="book" class="book-detail-wrapper">
      <!-- Left Side - Book Cover (Sticky) -->
      <aside class="book-cover-section">
        <button class="btn-back" @click="goBack">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Kembali
        </button>
        
        <div class="book-cover-sticky">
          <div class="cover-wrapper">
            <img 
              :src="book.coverImage" 
              :alt="book.title" 
              class="book-cover" 
              @error="onImageError"
            />
            
            <!-- Share Button -->
            <button 
              :class="['btn-share', { copied: isLinkCopied }]" 
              @click="copyLink"
              :title="isLinkCopied ? 'Link tersalin!' : 'Salin link'"
            >
              <svg v-if="!isLinkCopied" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </button>
          </div>

          <!-- Action Buttons -->
          <div class="action-buttons">
            <button class="btn-primary" @click="openBorrowModal">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
              Pinjam Buku
            </button>
          </div>
        </div>
      </aside>

      <!-- Right Side - Book Details -->
      <main class="book-info-section">
        <!-- Book Title & Meta -->
        <div class="book-header">
          <h1 class="book-title">{{ book.title }}</h1>
          <p class="book-author">oleh <span class="author-name">{{ book.author }}</span> | {{ book.publishDate }}</p>
          
          <!-- Rating & Badges -->
          <div class="book-meta">
            <div class="rating" v-if="book.rating">
              <div class="stars"> 
                <span v-for="i in 5" :key="i" :class="i <= book.rating ? 'star filled' : 'star'">★</span>
              </div>
              <span class="rating-text">({{ book.reviewCount }} reviews)</span>
              <span class="reader-count" v-if="book.readerCount">• {{ book.readerCount }} pembaca</span>
            </div>
          </div>
        </div>

        <!-- Description -->
        <div class="book-description" v-if="book.description">
          <div class="description-content" :class="{ expanded: isDescriptionExpanded }">
            <p>{{ book.description }}</p>
          </div>
          <button 
            v-if="book.description && book.description.length > 300" 
            class="btn-read-more" 
            @click="isDescriptionExpanded = !isDescriptionExpanded"
          >
            {{ isDescriptionExpanded ? 'Tampilkan Lebih Sedikit' : 'Baca Selengkapnya' }}
          </button>
        </div>

        <!-- Detail Buku -->
        <section class="book-details">
          <h2 class="section-title">Detail Buku</h2>
          <div class="details-grid">
            <div class="detail-item" v-if="book.publisher">
              <span class="detail-label">Penerbit</span>
              <span class="detail-value">{{ book.publisher }}</span>
            </div>
            <div class="detail-item" v-if="book.publishDate">
              <span class="detail-label">Tanggal Terbit</span>
              <span class="detail-value">{{ book.publishDate }}</span>
            </div>
            <div class="detail-item" v-if="book.isbn">
              <span class="detail-label">ISBN</span>
              <span class="detail-value">{{ book.isbn }}</span>
            </div>
            <div class="detail-item" v-if="book.pages">
              <span class="detail-label">Halaman</span>
              <span class="detail-value">{{ book.pages }}</span>
            </div>
            <div class="detail-item" v-if="book.language">
              <span class="detail-label">Bahasa</span>
              <span class="detail-value">{{ book.language }}</span>
            </div>
          </div>
        </section>

        <!-- Ketersediaan Buku -->
        <section class="book-availability" v-if="book.availability && book.availability.length > 0">
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
          <h2 class="section-title">Rekomendasi Buku Lainnya</h2>
          
          <div v-if="isLoadingRelated" class="loading-related">
            <div class="spinner-small"></div>
            <p>Memuat rekomendasi...</p>
          </div>

          <div v-else-if="relatedBooks.length > 0" class="books-grid">
            <div 
              v-for="relatedBook in relatedBooks" 
              :key="relatedBook.id" 
              class="related-book-card"
              @click="goToBook(relatedBook.id)"
            >
              <img 
                :src="getCoverUrl(relatedBook.cover)" 
                :alt="relatedBook.title" 
                class="related-book-cover"
                @error="onRelatedImageError"
              />
              <div class="related-book-info">
                <h4 class="related-book-title">{{ relatedBook.title }}</h4>
                <p class="related-book-author">oleh {{ relatedBook.author }} | {{ relatedBook.year }}</p>
              </div>
            </div>
          </div>

          <div v-else class="no-related">
            <p>Tidak ada rekomendasi buku saat ini</p>
          </div>
        </section>
      </main>
    </div>

    <!-- Error State -->
    <div v-else class="error-state">
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <h2>Buku tidak ditemukan</h2>
      <p>Maaf, buku yang Anda cari tidak tersedia.</p>
      <button class="btn-secondary" @click="goBack">Kembali</button>
    </div>

    <!-- Member Modal (untuk non-member) -->
    <transition name="modal-fade">
      <div v-if="showMemberModal" class="modal-overlay" @click="closeMemberModal">
        <div class="modal-content member-modal" @click.stop>
          <div class="modal-header">
            <h3></h3>
            <button class="btn-close" @click="closeMemberModal">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div class="modal-body">
            <div class="member-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>

            <h4>Jadilah Member Perpustakaan</h4>
            <p class="member-description">
              Untuk meminjam buku, Anda harus menjadi member terdaftar. Kunjungi perpustakaan kami dan lakukan pendaftaran untuk mendapatkan akses penuh ke koleksi buku.
            </p>

            <div class="member-benefits">
              <h5>Keuntungan Member:</h5>
              <ul>
                <li>
                  <span class="benefit-icon">✓</span>
                  <span>Pinjam buku hingga 5 judul sekaligus</span>
                </li>
                <li>
                  <span class="benefit-icon">✓</span>
                  <span>Durasi peminjaman 14 hari</span>
                </li>
                <li>
                  <span class="benefit-icon">✓</span>
                  <span>Prioritas pemesanan buku</span>
                </li>
              </ul>
            </div>

            <div class="member-contact">
              <h5>Hubungi Kami:</h5>
              <div class="contact-info">
                <div class="info-item">
                  <span class="info-icon">⏰</span>
                  <div>
                    <p class="info-label">Jam Operasional</p>
                    <p class="info-value">Senin - Jumat: 07:00 - 15:00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn-confirm" @click="closeMemberModal">Tutup</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Borrow Confirmation Modal -->
    <transition name="modal-fade">
      <div v-if="showModal" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>Konfirmasi Peminjaman Buku</h3>
            <button class="btn-close" @click="closeModal">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div class="modal-body">
            <!-- Warning untuk data tidak lengkap -->
            <!-- <div v-if="!userDataStatus.isComplete" class="data-warning">
              <div class="warning-icon">⚠️</div>
              <div class="warning-content">
                <h5>Data Profil Belum Lengkap</h5>
                <p>Beberapa data Anda masih kosong. Mohon lengkapi data berikut di halaman profil:</p>
                <ul class="missing-fields">
                  <li v-for="field in userDataStatus.missingFields" :key="field">{{ field }}</li>
                </ul>
                <p class="warning-note">Anda tetap dapat mengajukan peminjaman, namun kami menyarankan untuk melengkapi data terlebih dahulu.</p>
              </div>
            </div> -->

            <p class="modal-question">Apakah Anda yakin ingin mengajukan peminjaman buku ini?</p>
            
            <div class="book-summary">
              <img 
                :src="book.coverImage" 
                :alt="book.title" 
                class="summary-cover"
                @error="e => e.target.src = '/default_cover.png'"
              />
              <div class="summary-info">
                <h4>{{ book.title }}</h4>
                <p class="summary-author">{{ book.author }}</p>
                <div class="summary-code" v-if="selectedBook">
                  <span class="code-label">Kode Buku:</span>
                  <span class="code-value">{{ selectedBook.code }}</span>
                </div>
                <div class="summary-location" v-if="selectedBook">
                  <span class="location-icon">📍</span>
                  <span>{{ selectedBook.location }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn-cancel" @click="closeModal">Batal</button>
            <button class="btn-confirm" @click="confirmBorrow">Ya, Ajukan Peminjaman</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Success Confirmation -->
    <transition name="modal-fade">
      <div v-if="showConfirmation" class="modal-overlay" @click="closeConfirmation">
        <div class="modal-content confirmation-modal" @click.stop>
          <div class="confirmation-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          
          <h3>Pengajuan Berhasil!</h3>
          <p>Peminjaman buku Anda telah diajukan. Pihak perpustakaan akan segera menghubungi Anda</p>

          <button class="btn-primary-full" @click="closeConfirmation">Mengerti</button>
        </div>
      </div>
    </transition>

    <!-- Alert Notifications -->
    <transition name="slide-fade">
      <div v-if="alert.show" :class="['alert-notification', `alert-${alert.type}`]">
        <div class="alert-icon">
          <span v-if="alert.type === 'success'">✓</span>
          <span v-else-if="alert.type === 'error'">✕</span>
          <span v-else-if="alert.type === 'info'">ℹ</span>
        </div>
        <div class="alert-content">
          <span class="alert-message">{{ alert.message }}</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// ===== AUTH STATE =====
const currentUser = ref(null)
const isLoadingAuth = ref(true)

// ===== BOOK STATE =====
const book = ref(null)
const relatedBooks = ref([])
const isLoading = ref(true)
const isLoadingRelated = ref(true)
const isDescriptionExpanded = ref(false)

// ===== MODAL STATE =====
const isLinkCopied = ref(false)
const showModal = ref(false)
const showConfirmation = ref(false)
const showMemberModal = ref(false)
const selectedBook = ref(null)
const userDataStatus = ref({ isComplete: true, missingFields: [] })

// ===== FETCH CURRENT USER =====
const fetchCurrentUser = async () => {
  isLoadingAuth.value = true
  try {
    const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:5000'
    const token = localStorage.getItem('token')
    
    if (!token) {
      currentUser.value = null
      isLoadingAuth.value = false
      return
    }

    const res = await fetch(`${apiBase}/api/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })

    if (res.ok) {
      const data = await res.json()
      currentUser.value = data.user || data
      console.log('✅ User logged in:', currentUser.value)
    } else {
      currentUser.value = null
      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('token')
      }
    }
  } catch (err) {
    console.error('❌ Error fetching user:', err)
    currentUser.value = null
  } finally {
    isLoadingAuth.value = false
  }
}

// ===== CHECK USER DATA COMPLETENESS =====
const checkUserDataCompleteness = (user) => {
  const requiredFields = [
    { key: 'nama_lengkap', label: 'Nama Lengkap' },
    { key: 'email', label: 'Email' },
    { key: 'no_telp', label: 'Nomor Telepon' },
    { key: 'alamat', label: 'Alamat' }
  ]

  const missingFields = []

  requiredFields.forEach(field => {
    const value = user[field.key]
    if (!value || value.toString().trim() === '' || value === null) {
      missingFields.push(field.label)
    }
  })

  return {
    isComplete: missingFields.length === 0,
    missingFields
  }
}

// ===== CHECK MEMBERSHIP STATUS =====
const checkMembershipStatus = (user) => {
  if (!user.id_anggota && !user.id) {
    return { isActive: false, reason: 'not_member' }
  }

  if (!user.member_expired) {
    return { isActive: false, reason: 'no_expiry_date' }
  }

  const today = new Date()
  const expiryDate = new Date(user.member_expired)
  
  if (expiryDate < today) {
    return { isActive: false, reason: 'expired' }
  }

  return { isActive: true }
}

// ===== BOOK DETAIL FUNCTIONS =====
const onImageError = (event) => {
  event.target.src = '/default_cover.png'
}

const onRelatedImageError = (event) => {
  event.target.src = '/default_cover.png'
}

const getCoverUrl = (filename) => {
  const base = import.meta.env.VITE_API_BASE || 'http://localhost:5000'
  if (!filename) return '/default_cover.png'
  if (/^https?:\/\//i.test(filename)) return filename
  return `${base}/uploads/${filename}`
}

const fetchBookDetails = async (id) => {
  try {
    const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:5000'
    const res = await fetch(`${apiBase}/api/books/${id}`)

    if (res.ok) {
      const data = await res.json()
      book.value = {  
        id: data.id,
        title: data.judul || data.title || '',
        author: data.pembuat || data.author || '',
        publishDate: data.tahun_rilis || data.publishDate || '',
        coverImage: getCoverUrl(data.cover),
        description: data.sinopsis || data.description || '',
        publisher: data.penerbit || data.publisher || '',
        isbn: data.isbn_issn || data.isbn || '',
        pages: data.halaman || data.pages || '',
        language: data.bahasa_buku || data.language || '',
        rating: data.rating || 0,
        reviewCount: data.reviewCount || 0,
        readerCount: data.readerCount || 0,
        availability: data.availability || []
      }
    } else {
      book.value = null
    }
  } catch (err) {
    console.error('Failed to fetch book details:', err)
    book.value = null
  } finally {
    isLoading.value = false
  }
}

const fetchRelatedBooks = async () => {
  try {
    const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:5000'
    const res = await fetch(`${apiBase}/api/books`)
    
    if (res.ok) {
      const data = await res.json()
      const allBooks = data.books || data || []
      
      const filtered = allBooks.filter(b => b.id !== book.value?.id)
      const shuffled = filtered.sort(() => Math.random() - 0.5)
      
      relatedBooks.value = shuffled.slice(0, 4).map(b => ({
        id: b.id,
        title: b.judul || b.title || '',
        author: b.pembuat || b.author || '',
        year: b.tahun_rilis || '',
        cover: b.cover || b.sampul || ''
      }))
    }
  } catch (err) {
    console.error('Failed to fetch related books:', err)
  } finally {
    isLoadingRelated.value = false
  }
}

// ===== BORROW FUNCTIONS =====
const openBorrowModal = () => {
  if (!currentUser.value) {
    showAlert('error', 'Silakan login terlebih dahulu untuk meminjam buku')
    return
  }

  const isMember = checkMembershipStatus(currentUser.value)

  if (!isMember.isActive) {
    showMemberModal.value = true
    return
  }

  // Check data completeness
  const dataStatus = checkUserDataCompleteness(currentUser.value)
  userDataStatus.value = dataStatus

  if (book.value?.availability?.length > 0) {
    const available = book.value.availability
      .filter(item => item.status === 'Tersedia')
      .sort((a, b) => a.code.localeCompare(b.code))
    
    if (available.length > 0) {
      selectedBook.value = available[0]
      showModal.value = true
    } else {
      showAlert('error', 'Maaf, tidak ada buku yang tersedia saat ini.')
    }
  } else {
    showAlert('error', 'Informasi ketersediaan buku tidak tersedia.')
  }
}

const confirmBorrow = async () => {
  if (!selectedBook.value || !currentUser.value) return

  try {
    const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:5000'
    const token = localStorage.getItem('token')

    const borrowData = {
      id_buku: book.value.id,
      tanggal_pinjam: new Date().toISOString().split('T')[0],
      status: 'Dipinjam'
    }

    const res = await fetch(`${apiBase}/api/peminjaman`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(borrowData)
    })

    const result = await res.json()

    if (res.ok) {
      showModal.value = false
      showConfirmation.value = true
      selectedBook.value = null
      await fetchBookDetails(book.value.id)
      showAlert('success', result.message || 'Peminjaman berhasil diajukan!')
    } else {
      showAlert('error', result.message || 'Gagal mengajukan peminjaman')
    }
  } catch (err) {
    console.error('Error confirming borrow:', err)
    showAlert('error', 'Terjadi kesalahan saat memproses peminjaman.')
  }
}

// ===== MODAL & NAVIGATION =====
const closeModal = () => {
  showModal.value = false
  selectedBook.value = null
}

const closeConfirmation = () => {
  showConfirmation.value = false
  selectedBook.value = null
}

const closeMemberModal = () => {
  showMemberModal.value = false
}

const goBack = () => {
  router.push('/')
}

const goToBook = (id) => {
  router.push(`/buku/${id}`)
  window.scrollTo({ top: 0, behavior: 'smooth' })
  
  isLoading.value = true
  isLoadingRelated.value = true
  fetchBookDetails(id).then(() => {
    if (book.value) {
      fetchRelatedBooks()
    }
  })
}

const copyLink = () => {
  const url = window.location.href
  navigator.clipboard.writeText(url).then(() => {
    isLinkCopied.value = true
    showAlert('success', 'Link berhasil disalin ke clipboard!')
    
    setTimeout(() => {
      isLinkCopied.value = false
    }, 3000)
  }).catch(() => {
    showAlert('error', 'Gagal menyalin link')
  })
}

// ===== ALERT =====
const alert = reactive({
  show: false,
  type: 'success',
  message: ''
})

const showAlert = (type, message) => {
  alert.type = type
  alert.message = message
  alert.show = true
  
  setTimeout(() => {
    alert.show = false
  }, 4000)
}

// ===== COMPONENT LIFECYCLE =====
onMounted(async () => {
  await fetchCurrentUser()
  
  const id = route.params.id
  if (id) {
    await fetchBookDetails(id)
    if (book.value) {
      await fetchRelatedBooks()
    }
  } else {
    isLoading.value = false
  }
})
</script>

<style scoped>
.book-detail-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 20px;
  background: #FAFAFA;
  min-height: 100vh;
}

.book-detail-wrapper {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 60px;
  align-items: start;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 20px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #E5E7EB;
  border-top-color: #2C64F9;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-state p {
  font-size: 1.1rem;
  color: #6B7280;
  font-weight: 500;
}

/* Error State */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 20px;
  text-align: center;
}

.error-state svg {
  color: #EF4444;
}

.error-state h2 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #111827;
}

.error-state p {
  font-size: 1rem;
  color: #6B7280;
  margin-bottom: 20px;
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

.cover-wrapper {
  position: relative;
  margin-bottom: 24px;
}

.book-cover {
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.btn-share {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 40px;
  height: 40px;
  border: none;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #374151;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

.btn-share:hover {
  background: white;
  transform: scale(1.1);
  color: #2C64F9;
}

.btn-share.copied {
  background: #2C64F9;
  color: white;
}

.btn-share.copied:hover {
  background: #2C64F9;
  transform: scale(1.1);
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.btn-primary {
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
  background: #2C64F9;
  color: white;
}

.btn-primary:hover {
  background: #1e4ed8;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(44, 100, 249, 0.3);
}

.btn-secondary {
  padding: 14px 32px;
  border: 2px solid #2C64F9;
  background: white;
  color: #2C64F9;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: #2C64F9;
  color: white;
}

/* Right Side - Book Info */
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

.author-name {
  color: #2C64F9;
  font-weight: 600;
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

/* Description with Read More */
.book-description {
  margin-bottom: 40px;
  padding: 24px;
  background: #F9FAFB;
  border-radius: 8px;
  border-left: 4px solid #2C64F9;
}

.description-content {
  position: relative;
  overflow: hidden;
  max-height: 150px;
  transition: max-height 0.4s ease;
}

.description-content.expanded {
  max-height: none;
}

.description-content p {
  font-size: 1rem;
  line-height: 1.8;
  color: #374151;
  margin: 0;
}

.btn-read-more {
  margin-top: 12px;
  padding: 8px 16px;
  background: transparent;
  border: 1px solid #2C64F9;
  color: #2C64F9;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-read-more:hover {
  background: #2C64F9;
  color: white;
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

.status-rusak, .status-hilang {
  background: #FEE2E2;
  color: #991B1B;
}

/* Related Books */
.related-books {
  margin-bottom: 20px;
}

.loading-related {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 40px 0;
}

.spinner-small {
  width: 30px;
  height: 30px;
  border: 3px solid #E5E7EB;
  border-top-color: #2C64F9;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-related p {
  font-size: 0.95rem;
  color: #6B7280;
}

.no-related {
  text-align: center;
  padding: 40px;
  color: #6B7280;
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
  border-color: #2C64F9;
}

.related-book-cover {
  width: 100%;
  height: 220px;
  object-fit: cover;
  background: #F3F4F6;
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
  line-height: 1.4;
  min-height: 2.8em;
}

.related-book-author {
  font-size: 0.8rem;
  color: #6B7280;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
  backdrop-filter: blur(4px);
  overflow-y: auto;
}

.modal-content {
  background: white;
  border-radius: 16px;
  max-width: 550px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  animation: modalSlideUp 0.3s ease-out;
  margin: auto;
}

@keyframes modalSlideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 24px 0 24px;
  margin-bottom: 20px;
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
}

.modal-header h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
}

.btn-close {
  width: 32px;
  height: 32px;
  border: none;
  background: #F3F4F6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #6B7280;
  flex-shrink: 0;
}

.btn-close:hover {
  background: #E5E7EB;
  color: #111827;
}

.modal-body {
  padding: 0 24px 24px 24px;
}

/* Data Warning */
.data-warning {
  display: flex;
  gap: 16px;
  padding: 20px;
  background: rgba(251, 191, 36, 0.1);
  border: 1px solid rgba(251, 191, 36, 0.3);
  border-radius: 12px;
  margin-bottom: 24px;
}

.warning-icon {
  font-size: 2rem;
  flex-shrink: 0;
  line-height: 1;
}

.warning-content {
  flex: 1;
}

.warning-content h5 {
  font-size: 1rem;
  font-weight: 700;
  color: #92400E;
  margin: 0 0 8px 0;
}

.warning-content > p {
  font-size: 0.9rem;
  color: #78350F;
  line-height: 1.6;
  margin: 0 0 12px 0;
}

.missing-fields {
  list-style: none;
  padding: 0;
  margin: 0 0 12px 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.missing-fields li {
  font-size: 0.85rem;
  color: #92400E;
  padding-left: 20px;
  position: relative;
  font-weight: 600;
}

.missing-fields li::before {
  content: "•";
  position: absolute;
  left: 8px;
  font-weight: 700;
}

.warning-note {
  font-size: 0.85rem !important;
  color: #78350F !important;
  font-style: italic;
  margin: 0 !important;
}

.modal-question {
  font-size: 1rem;
  color: #374151;
  margin-bottom: 24px;
  line-height: 1.6;
}

.book-summary {
  display: flex;
  gap: 16px;
  padding: 20px;
  background: #F9FAFB;
  border-radius: 12px;
  margin-bottom: 20px;
  border: 2px solid #E5E7EB;
}

.summary-cover {
  width: 80px;
  height: 120px;
  object-fit: cover;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  flex-shrink: 0;
}

.summary-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.summary-info h4 {
  font-size: 1.1rem;
  font-weight: 700;
  color: #111827;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;
}

.summary-author {
  font-size: 0.9rem;
  color: #6B7280;
}

.summary-code {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
  flex-wrap: wrap;
}

.code-label {
  font-size: 0.85rem;
  color: #6B7280;
  font-weight: 500;
}

.code-value {
  font-size: 0.9rem;
  color: #2C64F9;
  font-weight: 700;
  background: #DBEAFE;
  padding: 4px 12px;
  border-radius: 6px;
}

.summary-location {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  color: #6B7280;
  flex-wrap: wrap;
}

.location-icon {
  font-size: 1rem;
}

.modal-footer {
  display: flex;
  gap: 12px;
  padding: 0 24px 24px 24px;
  position: sticky;
  bottom: 0;
  background: white;
  padding-top: 16px;
}

.btn-cancel, .btn-confirm {
  flex: 1;
  padding: 14px 20px;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancel {
  background: #F3F4F6;
  color: #374151;
}

.btn-cancel:hover {
  background: #E5E7EB;
}

.btn-confirm {
  background: #2C64F9;
  color: white;
}

.btn-confirm:hover {
  background: #1e4ed8;
  box-shadow: 0 4px 12px rgba(44, 100, 249, 0.3);
}

/* Confirmation Modal */
.confirmation-modal {
  text-align: center;
  padding: 40px 30px;
  max-width: 450px;
}

.confirmation-icon {
  display: inline-flex;
  width: 80px;
  height: 80px;
  align-items: center;
  justify-content: center;
  background: #D1FAE5;
  border-radius: 50%;
  margin-bottom: 24px;
}

.confirmation-icon svg {
  color: #10B981;
}

.confirmation-modal h3 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 16px;
}

.confirmation-modal > p {
  font-size: 1rem;
  color: #6B7280;
  line-height: 1.6;
  margin-bottom: 24px;
}

.btn-primary-full {
  width: 100%;
  padding: 14px 20px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  background: #2C64F9;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary-full:hover {
  background: #1e4ed8;
  box-shadow: 0 4px 12px rgba(44, 100, 249, 0.3);
}

/* Member Modal */
.member-modal {
  max-width: 550px;
}

.member-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.member-icon svg {
  width: 64px;
  height: 64px;
  color: #2C64F9;
  stroke-width: 1.5;
}

.modal-body h4 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #111827;
  text-align: center;
  margin-bottom: 16px;
}

.member-description {
  font-size: 0.95rem;
  color: #6B7280;
  line-height: 1.6;
  text-align: center;
  margin-bottom: 32px;
  padding: 0 16px;
}

.member-benefits {
  background: #F0F9FF;
  border: 1px solid #DBEAFE;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
}

.member-benefits h5 {
  font-size: 0.95rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 16px;
  margin-top: 0;
}

.member-benefits ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.member-benefits li {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.9rem;
  color: #374151;
}

.benefit-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: #10B981;
  color: white;
  border-radius: 50%;
  flex-shrink: 0;
  font-weight: 700;
  font-size: 0.8rem;
}

.member-contact {
  background: #F9FAFB;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
}

.member-contact h5 {
  font-size: 0.95rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 16px;
  margin-top: 0;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.info-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
  margin-top: 2px;
}

.info-item div {
  flex: 1;
}

.info-label {
  font-size: 0.8rem;
  color: #6B7280;
  font-weight: 600;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 0.9rem;
  color: #111827;
  font-weight: 600;
  margin: 4px 0 0 0;
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

.alert-info {
  background: #DBEAFE;
  border-left-color: #3B82F6;
  color: #1E40AF;
}

.alert-icon {
  font-size: 1.2rem;
  line-height: 1;
  font-weight: 700;
}

.alert-success .alert-icon { color: #059669; }
.alert-error .alert-icon { color: #DC2626; }
.alert-info .alert-icon { color: #3B82F6; }

.alert-content {
  flex: 1;
}

.alert-message {
  font-size: 0.95rem;
  font-weight: 500;
  line-height: 1.4;
}

/* Transition Animations */
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

.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .modal-content {
  animation: modalSlideUp 0.3s ease-out;
}

/* Responsive Design */
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

@media (max-width: 768px) {
  .modal-content {
    max-width: 95%;
    max-height: 85vh;
  }

  .modal-header h3 {
    font-size: 1.2rem;
  }

  .book-summary {
    flex-direction: row;
    gap: 12px;
    padding: 16px;
  }

  .summary-cover {
    width: 70px;
    height: 105px;
  }

  .summary-info h4 {
    font-size: 1rem;
  }

  .data-warning {
    flex-direction: column;
    gap: 12px;
    padding: 16px;
  }

  .warning-icon {
    font-size: 1.5rem;
  }

  .member-description {
    padding: 0;
  }
}

@media (max-width: 640px) {
  .book-detail-container {
    padding: 20px 16px;
  }

  .book-info-section {
    padding: 24px 20px;
  }

  .book-title {
    font-size: 1.8rem;
  }

  .book-description {
    padding: 20px;
  }

  .description-content {
    max-height: 120px;
  }

  .details-grid {
    grid-template-columns: 1fr;
  }
  
  .availability-header {
    display: none;
  }

  .availability-row {
    display: flex;
    flex-direction: column;
    grid-template-columns: 1fr;
    gap: 8px;
    padding: 16px;
    background: white;
    border-radius: 8px;
    margin-bottom: 12px;
    border: 1px solid #E5E7EB;
  }

  .col-location, .col-code, .col-status {
    width: 100%;
  }

  .col-code, .col-status {
    justify-content: flex-start;
    margin-top: 8px;
  }

  .books-grid {
    grid-template-columns: 1fr;
  }

  .modal-footer {
    flex-direction: column;
  }

  .btn-cancel, .btn-confirm {
    width: 100%;
  }

  .alert-notification {
    left: 16px;
    right: 16px;
    min-width: auto;
  }
}

@media (max-width: 480px) {
  .modal-overlay {
    padding: 10px;
  }

  .modal-content {
    border-radius: 12px;
  }

  .modal-header {
    padding: 20px 20px 0 20px;
  }

  .modal-body {
    padding: 0 20px 20px 20px;
  }

  .modal-footer {
    padding: 16px 20px 20px 20px;
  }

  .book-summary {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .summary-cover {
    width: 100px;
    height: 150px;
  }

  .summary-info {
    align-items: center;
  }

  .summary-code, .summary-location {
    justify-content: center;
  }

  .data-warning {
    padding: 12px;
  }

  .warning-content h5 {
    font-size: 0.95rem;
  }

  .warning-content > p,
  .warning-note {
    font-size: 0.85rem;
  }

  .missing-fields li {
    font-size: 0.8rem;
  }

  .confirmation-modal {
    padding: 30px 20px;
  }

  .confirmation-icon {
    width: 64px;
    height: 64px;
  }

  .confirmation-modal h3 {
    font-size: 1.5rem;
  }

  .confirmation-modal > p {
    font-size: 0.9rem;
  }

  .member-modal .modal-body h4 {
    font-size: 1.3rem;
  }

  .member-description {
    font-size: 0.9rem;
  }

  .member-benefits,
  .member-contact {
    padding: 16px;
  }

  .member-benefits li,
  .info-value {
    font-size: 0.85rem;
  }
}
</style>