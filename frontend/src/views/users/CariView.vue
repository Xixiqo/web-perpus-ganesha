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
              placeholder="Cari berdasarkan judul buku, penulis, dsb.."
              @keyup.enter="handleSearch"
            >
          </div>
          
          <!-- Filter Button -->
          <button class="filter-button" @click="toggleFilter" title="Filter">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
            </svg>
          </button>
        </div>
      </div>
    </section>

    <!-- Filter Panel -->
    <div v-if="showFilter" class="filter-panel">
      <div class="filter-content">
        <h3>Filter Pencarian</h3>
        <div class="filter-group">
          <label>
            <input v-model="selectedCategory" type="radio" value="">
            Semua Kategori
          </label>
          <label v-for="category in categories" :key="category.id">
            <input v-model="selectedCategory" type="radio" :value="category.id">
            {{ category.name }}
          </label>
        </div>
        <button @click="applyFilter" class="apply-button">Terapkan Filter</button>
      </div>
    </div>

    <!-- Books Section -->
    <section class="books-section">
      <div class="container">
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
              :book="{
                id: book.id,
                kode_buku: book.kode_buku,
                judul: book.judul,
                pembuat: book.pembuat,
                penerbit: book.penerbit,
                tahun_rilis: book.tahun_rilis,
                isbn_issn: book.isbn_issn,
                kategori: book.kategori,
                sinopsis: book.sinopsis,
                stok: book.stok,
                bahasa_buku: book.bahasa_buku,
                cover: book.cover
              }"
              @book-selected="onBookSelected"
            />
          </div>

          <!-- Pagination -->
          <div class="pagination">
            <button 
              @click="previousPage" 
              :disabled="currentPage === 1"
              class="pagination-button"
            >
              ← Sebelumnya
            </button>

            <div class="pagination-info">
              <span>Halaman {{ currentPage }} dari {{ totalPages }}</span>
              <span class="page-details">{{ totalBooks }} buku</span>
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
          <p v-if="searchQuery">Tidak ada buku yang ditemukan untuk "{{ searchQuery }}"</p>
          <p v-else-if="selectedCategory">Tidak ada buku dalam kategori ini</p>
          <p v-else>Tidak ada buku yang tersedia saat ini</p>
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
      searchQuery: '',
      books: [],
      categories: [],
      loading: false,
      showFilter: false,
      selectedCategory: '',
      currentPage: 1,
      itemsPerPage: 12,
      totalBooks: 0
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalBooks / this.itemsPerPage);
    },
    paginatedBooks() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.books.slice(startIndex, endIndex);
    }
  },
  methods: {
    toggleFilter() {
      this.showFilter = !this.showFilter;
    },

    async handleSearch() {
      this.currentPage = 1;
      this.loading = true;
      console.log('Starting search with query:', this.searchQuery);

      try {
        const baseUrl = 'http://localhost:5000/api/search';
        const params = new URLSearchParams();
        
        if (this.searchQuery.trim()) {
          params.append('query', this.searchQuery.trim());
        }
        
        if (this.selectedCategory) {
          params.append('category', this.selectedCategory);
        }

        const endpoint = `${baseUrl}/books${params.toString() ? `?${params.toString()}` : ''}`;
        console.log('Fetching from endpoint:', endpoint);

        const response = await fetch(endpoint, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Gagal mencari buku: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        console.log('Received data:', result);

        if (result.success) {
          // Format buku sesuai dengan data yang ada
          this.books = result.data.map(book => ({
            id: book.id,
            kode: book.kode_buku,
            judul: book.judul,
            penulis: book.pembuat,
            penerbit: book.penerbit,
            tahun: book.tahun_rilis,
            isbn: book.isbn_issn,
            kategori: book.kategori,
            sinopsis: book.sinopsis,
            stok: book.stok,
            bahasa: book.bahasa_buku,
            cover: book.cover ? `/cover/${book.cover}` : '/cover/default.jpg'
          }));
          this.totalBooks = result.total;
        } else {
          throw new Error(result.message || 'Gagal mengambil data buku');
        }
      } catch (error) {
        console.error('Search error:', error);
        this.books = [];
        this.totalBooks = 0;
      } finally {
        this.loading = false;
      }
    },

    async applyFilter() {
      this.showFilter = false;
      this.currentPage = 1;
      await this.handleSearch();
    },

    async fetchBooks() {
      this.loading = true;

      try {
        const response = await fetch('http://localhost:5000/api/search/books', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Gagal mengambil data buku');
        }

        const result = await response.json();
        console.log('Raw book data:', result); // Debugging
        if (result.success) {
          // Format data buku
          this.books = result.data.map(book => {
            console.log('Processing book:', book); // Debugging
            return {
              id: book.id,
              kode: book.kode_buku,
              judul: book.judul,
              penulis: book.pembuat,
              penerbit: book.penerbit,
              tahun: book.tahun_rilis,
              isbn: book.isbn_issn,
              kategori: book.kategori,
              sinopsis: book.sinopsis,
              stok: book.stok,
              bahasa: book.bahasa_buku,
              cover: book.cover ? `/cover/${book.cover}` : '/cover/default.jpg'
            };
          });
          this.totalBooks = result.total;
        } else {
          throw new Error(result.message || 'Gagal mengambil data buku');
        }
      } catch (error) {
        console.error('Fetch books error:', error);
        this.books = [];
        this.totalBooks = 0;
      } finally {
        this.loading = false;
      }
    },

    async fetchCategories() {
      try {
        const response = await fetch('http://localhost:5000/api/search/categories', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            this.categories = result.data;
          } else {
            throw new Error(result.message || 'Gagal mengambil kategori');
          }
        }
      } catch (error) {
        console.error('Fetch categories error:', error);
        this.categories = [];
      }
    },

    onBookSelected(book) {
      console.log('Selected book:', book);
      this.$router.push(`/buku/${book.id}`);
    },

    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },

    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  },
  mounted() {
    this.fetchBooks();
    this.fetchCategories();
  }
}
</script>

<style scoped>
.cari-page {
  min-height: 100vh;
  background: #f9fafb;
}

/* Hero Section */
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
  background-image: url('/emyu.jpg');
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

/* Search Overlay */
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
  color: var(--primary);
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
  box-shadow: 0 8px 30px rgba(102, 126, 234, 0.3);
}

.filter-button {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--primary);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  flex-shrink: 0;
}

.filter-button:hover:not(:disabled) {
  background: #764ba2;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.filter-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Filter Panel */
.filter-panel {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 16px 20px;
  max-width: 100%;
}

.filter-content {
  max-width: 1000px;
  margin: 0 auto;
}

.filter-content h3 {
  margin-bottom: 12px;
  color: #1f2937;
  font-weight: 600;
  font-size: 0.95rem;
}

.filter-group {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 12px;
}

.filter-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #4b5563;
  font-weight: 500;
  font-size: 0.9rem;
}

.filter-group input {
  cursor: pointer;
}

.apply-button {
  padding: 8px 16px;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.apply-button:hover {
  background: #764ba2;
}

/* Books Section */
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

/* Loading State */
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
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Pagination */
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
  background: var(--primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.pagination-button:hover:not(:disabled) {
  background: #764ba2;
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

/* No Results */
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

.no-results p {
  font-size: 1.1rem;
  margin: 0;
  color: #6b7280;
}

/* Responsive */
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
}</style>