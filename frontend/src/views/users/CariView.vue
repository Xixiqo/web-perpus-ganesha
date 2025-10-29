<template>
  <div class="cari-page">
    <!-- Hero Section with Search Bar Overlay -->
    <section class="hero-section">
      <!-- Background Image -->
      <div class="hero-background"></div>
      
      <!-- Search Bar Overlay -->
      <div class="search-overlay">
        <div class="search-container">
          <div class="search-box">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Cari berdasarkan judul buku, penulis, penerbit, ISBN..."
              @input="debouncedSearch"
            >
            <button 
              v-if="searchQuery" 
              @click="clearSearch" 
              class="clear-button"
              title="Hapus pencarian"
            >
              ×
            </button>
          </div>
          
          <!-- Filter Button -->
          <button class="filter-button" @click="toggleFilter" title="Filter">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
            <span v-if="activeFiltersCount > 0" class="filter-badge">{{ activeFiltersCount }}</span>
          </button>
        </div>
      </div>
    </section>

    <!-- Filter Panel -->
    <transition name="slide-down">
      <div v-if="showFilter" class="filter-panel">
        <div class="filter-content">
          <div class="filter-header">
            <h3>Filter & Urutkan</h3>
            <button @click="clearAllFilters" class="clear-filter-button">Reset Semua</button>
          </div>

          <!-- Sort Options -->
          <div class="filter-section">
            <label class="filter-label">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 6h18M7 12h10M10 18h4"></path>
              </svg>
              Urutkan Berdasarkan
            </label>
            <div class="filter-options">
              <label :class="{ active: sortBy === 'newest' }">
                <input v-model="sortBy" type="radio" value="newest">
                <span>🆕 Terbaru</span>
              </label>
              <label :class="{ active: sortBy === 'oldest' }">
                <input v-model="sortBy" type="radio" value="oldest">
                <span>📅 Terlama</span>
              </label>
              <label :class="{ active: sortBy === 'title-asc' }">
                <input v-model="sortBy" type="radio" value="title-asc">
                <span>🔤 Judul A-Z</span>
              </label>
              <label :class="{ active: sortBy === 'title-desc' }">
                <input v-model="sortBy" type="radio" value="title-desc">
                <span>🔡 Judul Z-A</span>
              </label>
              <label :class="{ active: sortBy === 'stock-high' }">
                <input v-model="sortBy" type="radio" value="stock-high">
                <span>📊 Stok Terbanyak</span>
              </label>
              <label :class="{ active: sortBy === 'stock-low' }">
                <input v-model="sortBy" type="radio" value="stock-low">
                <span>📉 Stok Tersedikit</span>
              </label>
            </div>
          </div>

          <!-- Category Filter -->
          <div class="filter-section">
            <label class="filter-label">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
              </svg>
              Kategori
            </label>
            <div class="filter-options">
              <label :class="{ active: selectedCategory === '' }">
                <input v-model="selectedCategory" type="radio" value="">
                <span>Semua Kategori</span>
              </label>
              <label 
                v-for="category in categories" 
                :key="category.id"
                :class="{ active: selectedCategory === category.id }"
              >
                <input v-model="selectedCategory" type="radio" :value="category.id">
                <span>{{ category.name }}</span>
              </label>
            </div>
          </div>

          <!-- Language Filter -->
          <div class="filter-section" v-if="languages.length > 0">
            <label class="filter-label">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
              </svg>
              Bahasa Buku
            </label>
            <div class="filter-options">
              <label :class="{ active: selectedLanguage === '' }">
                <input v-model="selectedLanguage" type="radio" value="">
                <span>Semua Bahasa</span>
              </label>
              <label 
                v-for="lang in languages" 
                :key="lang"
                :class="{ active: selectedLanguage === lang }"
              >
                <input v-model="selectedLanguage" type="radio" :value="lang">
                <span>{{ lang }}</span>
              </label>
            </div>
          </div>

          <!-- Year Range Filter -->
          <div class="filter-section" v-if="years.length > 0">
            <label class="filter-label">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              Tahun Rilis
            </label>
            <div class="year-range">
              <div class="year-display">
                <input v-model.number="selectedYearRange[0]" type="number" :min="minYear" :max="selectedYearRange[1]" class="year-input">
                <span class="separator">-</span>
                <input v-model.number="selectedYearRange[1]" type="number" :min="selectedYearRange[0]" :max="maxYear" class="year-input">
              </div>
              <div class="range-slider-container">
                <input 
                  v-model.number="selectedYearRange[0]" 
                  type="range" 
                  :min="minYear" 
                  :max="maxYear"
                  class="year-slider"
                >
                <input 
                  v-model.number="selectedYearRange[1]" 
                  type="range" 
                  :min="minYear" 
                  :max="maxYear"
                  class="year-slider"
                >
              </div>
              <div class="range-values">
                <span>{{ minYear }}</span>
                <span>{{ maxYear }}</span>
              </div>
            </div>
          </div>

          <!-- Publisher Filter -->
          <div class="filter-section" v-if="publishers.length > 1">
            <label class="filter-label">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
              Penerbit
            </label>
            <div class="select-wrapper">
              <select v-model="selectedPublisher" class="filter-select">
                <option value="">Semua Penerbit</option>
                <option v-for="pub in publishers" :key="pub" :value="pub">
                  {{ pub }}
                </option>
              </select>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="filter-actions">
            <button @click="toggleFilter" class="close-button">Tutup</button>
          </div>

        </div>
      </div>
    </transition>

    <!-- Books Section -->
    <section class="books-section">
      <div class="container">
        <!-- Active Filters Info -->
        <div v-if="hasActiveFilters" class="search-info">
          <div class="active-filters">
            <span class="filter-label-inline">Filter Aktif:</span>
            <span v-if="searchQuery" class="filter-tag">
              🔍 "{{ searchQuery }}"
              <button @click="clearSearch" class="remove-filter">×</button>
            </span>
            <span v-if="selectedCategory" class="filter-tag">
              📁 {{ getCategoryName(selectedCategory) }}
              <button @click="selectedCategory = ''" class="remove-filter">×</button>
            </span>
            <span v-if="selectedLanguage" class="filter-tag">
              🌐 {{ selectedLanguage }}
              <button @click="selectedLanguage = ''" class="remove-filter">×</button>
            </span>
            <span v-if="isYearRangeActive" class="filter-tag">
              📅 {{ selectedYearRange[0] }} - {{ selectedYearRange[1] }}
              <button @click="resetYearRange" class="remove-filter">×</button>
            </span>
            <span v-if="selectedPublisher" class="filter-tag">
              📚 {{ selectedPublisher }}
              <button @click="selectedPublisher = ''" class="remove-filter">×</button>
            </span>
            <button @click="clearAllFilters" class="clear-all-btn">Hapus Semua</button>
          </div>
          <p class="results-count">
            Menampilkan <strong>{{ filteredBooks.length }}</strong> dari <strong>{{ allBooks.length }}</strong> buku
          </p>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="loading-container">
          <div class="spinner"></div>
          <p>Memuat buku...</p>
        </div>

        <!-- Results Found -->
        <div v-else-if="paginatedBooks && paginatedBooks.length > 0" class="books-wrapper">
          <div class="books-grid">
            <BookCard 
              v-for="book in paginatedBooks"
              :key="book.id"
              :book="book"
              @book-selected="onBookSelected"
            />
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="pagination">
            <button 
              @click="previousPage" 
              :disabled="currentPage === 1"
              class="pagination-button"
            >
              ← Sebelumnya
            </button>

            <div class="pagination-info">
              <span>Halaman {{ currentPage }} dari {{ totalPages }}</span>
              <span class="page-details">{{ filteredBooks.length }} buku ditemukan</span>
            </div>

            <button 
              @click="nextPage" 
              :disabled="currentPage === totalPages"
              class="pagination-button"
            >
              Selanjutnya →
            </button>
          </div>
        </div>

        <!-- No Results -->
        <div v-else class="no-results">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <h3>Tidak Ada Hasil Ditemukan</h3>
          <p v-if="searchQuery">Tidak ada buku yang cocok dengan pencarian "{{ searchQuery }}"</p>
          <p v-else-if="hasActiveFilters">Tidak ada buku yang cocok dengan filter yang dipilih</p>
          <p v-else>Tidak ada buku yang tersedia saat ini</p>
          <button v-if="hasActiveFilters" @click="clearAllFilters" class="reset-button">
            Reset Semua Filter
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import BookCard from '@/components/users/BookCard.vue'

export default {
  name: 'CariView',
  components: {
    BookCard
  },
  data() {
    return {
      apiBaseUrl: import.meta.env.VITE_API_BASE || 'http://localhost:5000',
      searchQuery: '',
      allBooks: [],
      categories: [],
      loading: false,
      showFilter: false,
      
      // Filter options
      selectedCategory: '',
      selectedLanguage: '',
      selectedYearRange: [1900, 2025],
      selectedPublisher: '',
      sortBy: 'newest',
      
      // Pagination
      currentPage: 1,
      itemsPerPage: 18,
      
      // Utilities
      searchTimeout: null,
      initialFetchDone: false,
      
      // Dynamic filter data
      languages: [],
      years: [],
      publishers: []
    }
  },
  computed: {
    activeFiltersCount() {
      let count = 0
      if (this.selectedCategory) count++
      if (this.selectedLanguage) count++
      if (this.isYearRangeActive) count++
      if (this.selectedPublisher) count++
      return count
    },

    hasActiveFilters() {
      return this.searchQuery || this.activeFiltersCount > 0
    },

    isYearRangeActive() {
      return this.selectedYearRange[0] !== this.minYear || this.selectedYearRange[1] !== this.maxYear
    },

    minYear() {
      if (this.years.length === 0) return 1900
      return Math.min(...this.years)
    },

    maxYear() {
      if (this.years.length === 0) return new Date().getFullYear()
      return Math.max(...this.years)
    },

    filteredBooks() {
      let books = [...this.allBooks]

      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase().trim()
        books = books.filter(book => {
          return (
            (book.judul && book.judul.toLowerCase().includes(query)) ||
            (book.pembuat && book.pembuat.toLowerCase().includes(query)) ||
            (book.penerbit && book.penerbit.toLowerCase().includes(query)) ||
            (book.kategori && book.kategori.toLowerCase().includes(query)) ||
            (book.isbn_issn && book.isbn_issn.toLowerCase().includes(query)) ||
            (book.kode_buku && book.kode_buku.toLowerCase().includes(query))
          )
        })
      }

      if (this.selectedCategory) {
        books = books.filter(book => {
          const bookCategory = book.kategori_id || book.kategori
          return bookCategory == this.selectedCategory
        })
      }

      if (this.selectedLanguage) {
        books = books.filter(book => book.bahasa_buku === this.selectedLanguage)
      }

      if (this.isYearRangeActive) {
        books = books.filter(book => {
          const year = book.tahun_rilis
          return year >= this.selectedYearRange[0] && year <= this.selectedYearRange[1]
        })
      }

      if (this.selectedPublisher) {
        books = books.filter(book => book.penerbit === this.selectedPublisher)
      }

      books = this.sortBooks(books)

      return books
    },

    totalPages() {
      return Math.ceil(this.filteredBooks.length / this.itemsPerPage)
    },

    paginatedBooks() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage
      const endIndex = startIndex + this.itemsPerPage
      return this.filteredBooks.slice(startIndex, endIndex)
    }
  },
  watch: {
    filteredBooks() {
      this.currentPage = 1
    },

    allBooks: {
      handler() {
        this.updateDynamicFilters()
      },
      deep: true
    }
  },
  methods: {
    toggleFilter() {
      this.showFilter = !this.showFilter
    },

    clearAllFilters() {
      this.selectedCategory = ''
      this.selectedLanguage = ''
      this.resetYearRange()
      this.selectedPublisher = ''
      this.sortBy = 'newest'
      this.searchQuery = ''
    },

    resetYearRange() {
      this.selectedYearRange = [this.minYear, this.maxYear]
    },

    clearSearch() {
      this.searchQuery = ''
    },

    applyFilters() {
      this.showFilter = false
    },

    debouncedSearch() {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout)
      }

      this.searchTimeout = setTimeout(() => {
        console.log('Search:', this.searchQuery)
      }, 300)
    },

    sortBooks(books) {
      const sorted = [...books]

      switch (this.sortBy) {
        case 'newest':
          return sorted.sort((a, b) => (b.tahun_rilis || 0) - (a.tahun_rilis || 0))
        
        case 'oldest':
          return sorted.sort((a, b) => (a.tahun_rilis || 0) - (b.tahun_rilis || 0))
        
        case 'title-asc':
          return sorted.sort((a, b) => {
            const titleA = (a.judul || '').toLowerCase()
            const titleB = (b.judul || '').toLowerCase()
            return titleA.localeCompare(titleB)
          })
        
        case 'title-desc':
          return sorted.sort((a, b) => {
            const titleA = (a.judul || '').toLowerCase()
            const titleB = (b.judul || '').toLowerCase()
            return titleB.localeCompare(titleA)
          })
        
        case 'stock-high':
          return sorted.sort((a, b) => (b.stok || 0) - (a.stok || 0))
        
        case 'stock-low':
          return sorted.sort((a, b) => (a.stok || 0) - (b.stok || 0))
        
        default:
          return sorted
      }
    },

    updateDynamicFilters() {
      const langSet = new Set()
      this.allBooks.forEach(book => {
        if (book.bahasa_buku) {
          langSet.add(book.bahasa_buku)
        }
      })
      this.languages = Array.from(langSet).sort()

      const yearSet = new Set()
      this.allBooks.forEach(book => {
        if (book.tahun_rilis) {
          yearSet.add(book.tahun_rilis)
        }
      })
      this.years = Array.from(yearSet).sort((a, b) => a - b)
      
      if (this.years.length > 0 && this.selectedYearRange[0] === 1900 && this.selectedYearRange[1] === 2025) {
        this.selectedYearRange = [this.minYear, this.maxYear]
      }

      const pubSet = new Set()
      this.allBooks.forEach(book => {
        if (book.penerbit && book.penerbit.trim()) {
          pubSet.add(book.penerbit.trim())
        }
      })
      this.publishers = Array.from(pubSet).sort()
    },

    getCoverUrl(filename) {
      if (!filename) return '/placeholder-cover.svg'
      if (/^https?:\/\//i.test(filename)) return filename
      return `${this.apiBaseUrl}/uploads/${filename}`
    },

    getCategoryName(categoryId) {
      if (!categoryId) return ''
      const category = this.categories.find(cat => cat.id == categoryId)
      return category ? category.name : ''
    },

    async fetchBooks() {
      if (this.loading || this.initialFetchDone) return
      
      this.loading = true

      try {
        const response = await fetch(`${this.apiBaseUrl}/api/books`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error('Gagal mengambil data buku')
        }

        const result = await response.json()
        let booksData = []
        
        if (Array.isArray(result)) {
          booksData = result
        } else if (result && result.success) {
          booksData = result.data || []
        } else {
          throw new Error('Unexpected response shape when fetching books')
        }

        this.allBooks = booksData.map(book => ({
          id: book.id,
          kode_buku: book.kode_buku,
          judul: book.judul,
          pembuat: book.pembuat,
          penerbit: book.penerbit,
          tahun_rilis: book.tahun_rilis,
          isbn_issn: book.isbn_issn,
          kategori: book.kategori,
          kategori_id: book.kategori_id,
          sinopsis: book.sinopsis,
          stok: book.stok,
          bahasa_buku: book.bahasa_buku,
          cover: this.getCoverUrl(book.cover)
        }))

        console.log('Loaded books:', this.allBooks.length)
      } catch (error) {
        console.error('Fetch books error:', error)
        this.allBooks = []
      } finally {
        this.loading = false
        this.initialFetchDone = true
      }
    },

    async fetchCategories() {
      try {
        const response = await fetch(`${this.apiBaseUrl}/api/categories`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          const result = await response.json()
          if (result.success) {
            this.categories = result.data
            console.log('Loaded categories:', this.categories.length)
          } else {
            throw new Error(result.message || 'Gagal mengambil kategori')
          }
        }
      } catch (error) {
        console.error('Fetch categories error:', error)
        this.categories = []
      }
    },

    onBookSelected(book) {
      console.log('Selected book:', book)
      this.$router.push(`/buku/${book.id}`)
    },

    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    },

    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
  },
  mounted() {
    this.fetchBooks()
    this.fetchCategories()
  },
  beforeUnmount() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout)
    }
  }
}
</script>

<style scoped>
.cari-page {
  min-height: 100vh;
  background: #f9fafb;
}

.hero-section {
  position: relative;
  height: 350px;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('/ganesha-profile/ganesha7.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  z-index: 1;
}

.hero-section::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.4) 0%,
    rgba(30, 60, 114, 0.3) 50%,
    rgba(0, 0, 0, 0.4) 100%
  );
  z-index: 2;
}

.search-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  padding: 0 20px;
  z-index: 3;
}

.search-container {
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  gap: 12px;
  align-items: center;
}

.search-box {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
  padding: 14px 20px;
  border-radius: 50px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.search-box svg {
  color: #2C64F9;
  flex-shrink: 0;
  width: 20px;
  height: 20px;
}

.search-box input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 0.95rem;
  color: #1f2937;
}

.search-box input::placeholder {
  color: #9ca3af;
}

.search-box:focus-within {
  box-shadow: 0 8px 30px rgba(44, 100, 249, 0.3);
}

.clear-button {
  background: #e5e7eb;
  color: #6b7280;
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 20px;
  line-height: 1;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.clear-button:hover {
  background: #d1d5db;
  color: #374151;
}

.filter-button {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #2C64F9;
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(44, 100, 249, 0.3);
  flex-shrink: 0;
  position: relative;
}

.filter-button:hover:not(:disabled) {
  background: #1a4fd6;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(44, 100, 249, 0.4);
}

.filter-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #ef4444;
  color: white;
  min-width: 20px;
  height: 20px;
  padding: 0 4px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 700;
  border: 2px solid white;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.filter-panel {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 24px 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.filter-content {
  max-width: 1000px;
  margin: 0 auto;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f3f4f6;
}

.filter-header h3 {
  margin: 0;
  color: #1f2937;
  font-weight: 700;
  font-size: 1.25rem;
}

.clear-filter-button {
  background: #fee2e2;
  color: #dc2626;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.clear-filter-button:hover {
  background: #fecaca;
  transform: translateY(-1px);
}

.filter-section {
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f3f4f6;
}

.filter-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.filter-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
  font-size: 0.95rem;
}

.filter-label svg {
  color: #2C64F9;
}

.filter-options {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.filter-options label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #4b5563;
  font-weight: 500;
  font-size: 0.9rem;
  padding: 8px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 20px;
  transition: all 0.2s ease;
  background: white;
}

.filter-options label:hover {
  border-color: #2C64F9;
  background: #eff6ff;
  transform: translateY(-1px);
}

.filter-options label.active {
  border-color: #2C64F9;
  background: #2C64F9;
  color: white;
}

.filter-options input[type="radio"] {
  cursor: pointer;
  accent-color: #2C64F9;
}

.filter-options label.active input[type="radio"] {
  accent-color: white;
}

.year-range {
  padding: 16px;
  background: #f9fafb;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
}

.year-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 16px;
}

.year-input {
  width: 100px;
  padding: 8px 12px;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 700;
  color: #1f2937;
  text-align: center;
  transition: all 0.2s ease;
}

.year-input:focus {
  outline: none;
  border-color: #2C64F9;
  box-shadow: 0 0 0 3px rgba(44, 100, 249, 0.1);
}

.separator {
  color: #9ca3af;
  font-weight: 600;
}

.range-slider-container {
  position: relative;
  height: 40px;
  margin-bottom: 8px;
}

.year-slider {
  position: absolute;
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: transparent;
  outline: none;
  cursor: pointer;
  -webkit-appearance: none;
  appearance: none;
  pointer-events: none;
}

.year-slider::-webkit-slider-runnable-track {
  width: 100%;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
}

.year-slider::-moz-range-track {
  width: 100%;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  border: none;
}

.year-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #2C64F9;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
  pointer-events: all;
  position: relative;
  z-index: 3;
}

.year-slider::-webkit-slider-thumb:hover {
  transform: scale(1.15);
  box-shadow: 0 4px 8px rgba(44, 100, 249, 0.4);
}

.year-slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #2C64F9;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
  pointer-events: all;
}

.year-slider::-moz-range-thumb:hover {
  transform: scale(1.15);
  box-shadow: 0 4px 8px rgba(44, 100, 249, 0.4);
}

.year-slider:first-child::-webkit-slider-thumb {
  z-index: 4;
}

.range-values {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 0.85rem;
  color: #6b7280;
  font-weight: 500;
}

.select-wrapper {
  position: relative;
}

.filter-select {
  width: 100%;
  padding: 10px 14px;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  background: white;
  color: #374151;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  padding-right: 36px;
}

.filter-select:hover {
  border-color: #2C64F9;
  background-color: #eff6ff;
}

.filter-select:focus {
  outline: none;
  border-color: #2C64F9;
  box-shadow: 0 0 0 3px rgba(44, 100, 249, 0.1);
}

.filter-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #f3f4f6;
}

.apply-button {
  flex: 1;
  padding: 12px 24px;
  background: #2C64F9;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.apply-button:hover {
  background: #1a4fd6;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(44, 100, 249, 0.3);
}

.close-button {
  flex: 1;
  padding: 12px 24px;
  background: #e5e7eb;
  color: #374151;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-button:hover {
  background: #d1d5db;
  transform: translateY(-2px);
}

.search-info {
  background: white;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 24px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.active-filters {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.filter-label-inline {
  font-weight: 600;
  color: #374151;
  font-size: 0.9rem;
}

.filter-tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #2C64F9;
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.remove-filter {
  background: rgba(255, 255, 255, 0.3);
  border: none;
  color: white;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  transition: all 0.2s ease;
  font-weight: 700;
}

.remove-filter:hover {
  background: rgba(255, 255, 255, 0.5);
  transform: scale(1.1);
}

.clear-all-btn {
  background: #fee2e2;
  color: #dc2626;
  border: none;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.clear-all-btn:hover {
  background: #fecaca;
  transform: translateY(-1px);
}

.results-count {
  margin: 0;
  color: #6b7280;
  font-size: 0.95rem;
  padding-top: 12px;
  border-top: 1px solid #f3f4f6;
}

.results-count strong {
  color: #2C64F9;
  font-weight: 700;
}

.books-section {
  padding: 40px 20px;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
}

.books-wrapper {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #9ca3af;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top-color: #2C64F9;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
  padding: 32px 20px;
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.pagination-button {
  padding: 10px 20px;
  background: #2C64F9;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.pagination-button:hover:not(:disabled) {
  background: #1a4fd6;
  transform: translateY(-2px);
}

.pagination-button:disabled {
  background: #d1d5db;
  cursor: not-allowed;
  opacity: 0.6;
}

.pagination-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: #1f2937;
  font-weight: 600;
}

.page-details {
  font-size: 0.85rem;
  color: #6b7280;
  font-weight: 400;
}

.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: #9ca3af;
  text-align: center;
}

.no-results svg {
  margin-bottom: 24px;
  opacity: 0.5;
}

.no-results h3 {
  font-size: 1.5rem;
  color: #374151;
  margin: 0 0 12px 0;
}

.no-results p {
  font-size: 1rem;
  margin: 0 0 24px 0;
  color: #6b7280;
  max-width: 500px;
}

.reset-button {
  padding: 12px 24px;
  background: #2C64F9;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.reset-button:hover {
  background: #1a4fd6;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(44, 100, 249, 0.3);
}

@media (max-width: 768px) {
  .hero-section {
    height: 280px;
    background-attachment: scroll;
  }

  .search-overlay {
    top: 50%;
  }

  .search-container {
    gap: 8px;
  }

  .search-box {
    padding: 12px 16px;
  }

  .search-box input {
    font-size: 0.9rem;
  }

  .filter-button {
    width: 44px;
    height: 44px;
  }

  .filter-panel {
    padding: 20px 16px;
  }

  .filter-header h3 {
    font-size: 1.1rem;
  }

  .filter-options {
    gap: 8px;
  }

  .filter-options label {
    padding: 7px 12px;
    font-size: 0.85rem;
  }

  .books-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 16px;
  }

  .pagination {
    gap: 16px;
    padding: 24px 16px;
  }

  .pagination-button {
    padding: 8px 14px;
    font-size: 0.85rem;
  }

  .pagination-info {
    font-size: 0.9rem;
  }

  .active-filters {
    gap: 8px;
  }

  .filter-tag {
    font-size: 0.8rem;
    padding: 5px 10px;
  }

  .filter-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .hero-section {
    height: 220px;
  }

  .search-box {
    padding: 10px 12px;
  }

  .search-box input {
    font-size: 0.85rem;
  }

  .search-box svg {
    width: 18px;
    height: 18px;
  }

  .filter-button {
    width: 40px;
    height: 40px;
  }

  .filter-button svg {
    width: 18px;
    height: 18px;
  }

  .filter-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .clear-filter-button {
    width: 100%;
    padding: 10px;
  }

  .filter-options label {
    font-size: 0.8rem;
    padding: 6px 10px;
  }

  .books-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 12px;
  }

  .books-section {
    padding: 24px 12px;
  }

  .pagination {
    flex-direction: column;
    gap: 16px;
  }

  .pagination-button {
    width: 100%;
    padding: 10px;
  }

  .active-filters {
    flex-direction: column;
    align-items: flex-start;
  }

  .clear-all-btn {
    width: 100%;
    padding: 8px;
    text-align: center;
  }

  .no-results h3 {
    font-size: 1.25rem;
  }

  .no-results p {
    font-size: 0.9rem;
  }

  .year-display {
    flex-direction: column;
    gap: 8px;
  }

  .year-input {
    width: 100%;
  }
}
</style>