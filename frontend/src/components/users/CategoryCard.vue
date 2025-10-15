<template>
  <div class="category-card-container">
    <!-- Header Section -->
    <div class="category-header">
      <h2 class="category-title">{{ title }}</h2>
      <RouterLink v-if="showViewAll" :to="viewAllLink" class="view-all-link">
        {{ viewAllText }}
      </RouterLink>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="skeleton-grid">
        <div v-for="i in 4" :key="i" class="skeleton-card">
          <div class="skeleton-image"></div>
          <div class="skeleton-text"></div>
          <div class="skeleton-text short"></div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <p class="error-message">{{ error }}</p>
      <button @click="fetchCategories" class="retry-button">Coba Lagi</button>
    </div>

    <!-- Categories Grid -->
    <div v-else-if="categories && categories.length > 0" class="categories-grid">
      <div 
        v-for="(category, index) in displayedCategories" 
        :key="category.id || index"
        class="category-item"
        :class="{ featured: category.featured }"
        @click="selectCategory(category)"
      >
        <!-- Category Image -->
        <div class="category-image-wrapper">
          <img 
            v-if="category.image" 
            :src="category.image" 
            :alt="category.name"
            class="category-image"
          >
          <div v-else class="category-image-placeholder">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
          </div>
        </div>

        <!-- Category Info -->
        <div class="category-info">
          <h3 class="category-name">{{ category.name }}</h3>
          <p class="category-count">{{ category.bookCount || 0 }}+ buku</p>
          
          <!-- Rating -->
          <div class="category-rating">
            <div class="stars">
              <span 
                v-for="star in 5" 
                :key="star"
                class="star"
                :class="{ filled: star <= Math.round(category.rating || 0) }"
              >
                ★
              </span>
            </div>
            <span class="rating-value">{{ category.rating || 0 }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-container">
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
      </svg>
      <p class="empty-message">Tidak ada kategori tersedia</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CategoryCard',
  props: {
    title: {
      type: String,
      default: 'Pilih Buku Berdasarkan'
    },
    apiEndpoint: {
      type: String,
      default: '/api/categories'
    },
    itemsPerRow: {
      type: Number,
      default: 4
    },
    showViewAll: {
      type: Boolean,
      default: true
    },
    viewAllText: {
      type: String,
      default: 'Lihat lainnya'
    },
    viewAllLink: {
      type: String,
      default: '/kategori'
    },
    initialCategories: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      categories: [],
      loading: false,
      error: null,
      selectedCategory: null
    }
  },
  computed: {
    displayedCategories() {
      return this.categories.slice(0, this.itemsPerRow);
    }
  },
  methods: {
    async fetchCategories() {
      // Jika ada initialCategories prop, gunakan itu
      if (this.initialCategories && this.initialCategories.length > 0) {
        this.categories = this.initialCategories;
        return;
      }

      this.loading = true;
      this.error = null;

      try {
        const response = await fetch(this.apiEndpoint, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Gagal mengambil data kategori');
        }

        const data = await response.json();

        // Normalize data dari API
        if (data.categories) {
          this.categories = data.categories;
        } else if (Array.isArray(data)) {
          this.categories = data;
        } else {
          this.categories = [];
        }

      } catch (error) {
        console.error('Error fetching categories:', error);
        this.error = error.message || 'Terjadi kesalahan saat mengambil data';
        // Tetap tampilkan placeholder jika ada error
        this.categories = [];
      } finally {
        this.loading = false;
      }
    },
    selectCategory(category) {
      this.selectedCategory = category;
      this.$emit('category-selected', category);
    }
  },
  mounted() {
    this.fetchCategories();
  }
}
</script>

<style scoped>
.category-card-container {
  width: 100%;
  padding: 0;
}

/* Header */
.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.category-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
}

.view-all-link {
  color: var(--primary);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  transition: color 0.3s ease;
}

.view-all-link:hover {
  color: #764ba2;
  text-decoration: underline;
}

/* Grid */
.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  width: 100%;
}

.category-item {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  display: flex;
  flex-direction: column;
}

.category-item:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.category-item.featured {
  border: 2px solid var(--primary);
}

/* Image */
.category-image-wrapper {
  width: 100%;
  height: 180px;
  background: linear-gradient(135deg, #f0f4ff 0%, #e8ecff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
}

.category-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.category-item:hover .category-image {
  transform: scale(1.05);
}

.category-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #d1d5db;
}

.category-image-placeholder svg {
  opacity: 0.5;
}

/* Info */
.category-info {
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.category-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.category-count {
  font-size: 0.85rem;
  color: #6b7280;
  margin: 0 0 12px 0;
}

/* Rating */
.category-rating {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stars {
  display: flex;
  gap: 2px;
}

.star {
  font-size: 1rem;
  color: #d1d5db;
  transition: color 0.2s ease;
}

.star.filled {
  color: #fbbf24;
}

.rating-value {
  font-size: 0.9rem;
  font-weight: 600;
  color: #1f2937;
}

/* Loading State */
.loading-container {
  width: 100%;
}

.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
}

.skeleton-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.skeleton-image {
  width: 100%;
  height: 180px;
  background: linear-gradient(90deg, #f0f4ff 0%, #e8ecff 50%, #f0f4ff 100%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

.skeleton-text {
  height: 12px;
  background: linear-gradient(90deg, #f0f4ff 0%, #e8ecff 50%, #f0f4ff 100%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  margin: 12px;
  border-radius: 4px;
}

.skeleton-text.short {
  width: 60%;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Error State */
.error-container {
  text-align: center;
  padding: 40px 20px;
  background: #fef2f2;
  border-radius: 16px;
  border: 1px solid #fecaca;
}

.error-message {
  color: #dc2626;
  font-size: 1rem;
  margin-bottom: 16px;
}

.retry-button {
  padding: 10px 20px;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s ease;
}

.retry-button:hover {
  background: #b91c1c;
}

/* Empty State */
.empty-container {
  text-align: center;
  padding: 60px 20px;
  color: #9ca3af;
}

.empty-container svg {
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-message {
  font-size: 1.1rem;
  color: #6b7280;
}

/* Responsive */
@media (max-width: 1024px) {
  .categories-grid {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 20px;
  }

  .category-title {
    font-size: 1.5rem;
  }
}

@media (max-width: 640px) {
  .category-header {
    margin-bottom: 24px;
  }

  .category-title {
    font-size: 1.25rem;
  }

  .view-all-link {
    font-size: 0.85rem;
  }

  .categories-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 16px;
  }

  .category-image-wrapper {
    height: 150px;
  }

  .category-name {
    font-size: 1rem;
  }

  .category-count {
    font-size: 0.8rem;
  }

  .star {
    font-size: 0.85rem;
  }

  .rating-value {
    font-size: 0.8rem;
  }
}
</style>