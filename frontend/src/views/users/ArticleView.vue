<template>
  <div class="min-h-screen bg-gray-50">
    
    <!-- Hero Section -->
    <section class="bg-white py-12 border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4">
        <div class="text-center max-w-3xl mx-auto">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">
            Temukan Berita Terbaru Kami
          </h1>
          <p class="text-gray-600 mb-8 leading-relaxed">
            Baca berita terkini tentang berbagai topik menarik. Dengan konten yang segar setiap hari dan artikel berkualitas yang disusun oleh tim penulis berpengalaman kami, temukan informasi yang relevan untuk meningkatkan pengalaman membaca Anda.
          </p>
          
          <!-- Search Bar -->
          <div class="relative max-w-2xl mx-auto">
            <svg 
              class="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-blue-600 pointer-events-none" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              stroke-width="2" 
              stroke-linecap="round" 
              stroke-linejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input
              type="text"
              v-model="searchQuery"
              @input="handleSearch"
              placeholder="Cari berdasarkan judul artikel, kategori..."
              class="w-full border-0 outline-none bg-white py-3.5 pl-11 pr-5 rounded-xl shadow-sm text-sm text-gray-900 placeholder:text-gray-400 focus:shadow-lg focus:shadow-blue-200/50 transition-all duration-300"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <section class="py-12">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex flex-col lg:flex-row gap-8">
          
          <!-- Left Side - Featured Articles -->
          <div class="flex-1 min-w-0">
            <h2 class="text-2xl font-bold text-gray-900 mb-6">
              Disini kata-kata beristirahat, lalu bangkit menjadi sebuah inspirasi.
            </h2>

            <!-- Loading State -->
            <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              <div 
                v-for="i in 6" 
                :key="i" 
                class="h-[400px] bg-white rounded-lg overflow-hidden relative"
              >
                <div class="w-full h-full bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_1.5s_infinite]"></div>
              </div>
            </div>

            <!-- Articles Grid -->
            <div 
              v-else-if="articles.length > 0" 
              class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
            >
              <ArticleCard 
                v-for="article in articles" 
                :key="article.id" 
                :article="article" 
              />
            </div>

            <!-- Empty State -->
            <div v-else class="col-span-full flex items-center justify-center min-h-[400px] py-10 px-5">
              <div class="text-center max-w-md">
                <i class="fa-solid fa-book-open-reader text-6xl text-gray-400 opacity-60 mb-5"></i>
                <h3 class="text-2xl font-semibold text-gray-700 mb-3">
                  Artikel Tidak Ditemukan
                </h3>
                <p class="text-base text-gray-500 leading-relaxed mb-2">
                  Maaf, kami tidak menemukan artikel yang Anda cari di koleksi kami.
                </p>
                <p class="text-sm text-gray-400 italic">
                  Coba gunakan kata kunci lain atau jelajahi koleksi artikel kami.
                </p>
              </div>
            </div>

            <!-- Pagination -->
            <div 
              v-if="pagination.totalPages > 1"
              class="flex items-center justify-center gap-2 mt-8 bg-white rounded-full shadow-sm py-1.5 px-3 w-fit mx-auto transition-opacity duration-300"
            >
              <button 
                class="border-0 bg-transparent text-blue-600 text-lg py-1.5 px-2.5 cursor-pointer transition-opacity duration-200 disabled:opacity-30 disabled:cursor-default hover:opacity-70"
                :disabled="pagination.page === 1" 
                @click="goToPage(1)"
              >
                «
              </button>
              <button 
                class="border-0 bg-transparent text-blue-600 text-lg py-1.5 px-2.5 cursor-pointer transition-opacity duration-200 disabled:opacity-30 disabled:cursor-default hover:opacity-70"
                :disabled="pagination.page === 1" 
                @click="goToPage(pagination.page - 1)"
              >
                ‹
              </button>
              <span class="font-semibold text-gray-900 px-2">
                {{ pagination.page }} dari {{ pagination.totalPages }}
              </span>
              <button 
                class="border-0 bg-transparent text-blue-600 text-lg py-1.5 px-2.5 cursor-pointer transition-opacity duration-200 disabled:opacity-30 disabled:cursor-default hover:opacity-70"
                :disabled="pagination.page === pagination.totalPages" 
                @click="goToPage(pagination.page + 1)"
              >
                ›
              </button>
              <button 
                class="border-0 bg-transparent text-blue-600 text-lg py-1.5 px-2.5 cursor-pointer transition-opacity duration-200 disabled:opacity-30 disabled:cursor-default hover:opacity-70"
                :disabled="pagination.page === pagination.totalPages" 
                @click="goToPage(pagination.totalPages)"
              >
                »
              </button>
            </div>
          </div>


          <!-- Sidebar -->
          <aside class="w-full lg:w-[350px] flex-shrink-0">
            <!-- Recent Articles Section -->
            <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h3 class="text-lg font-bold text-gray-900 mb-4">
                Artikel Terbaru
              </h3>
              <div v-if="loadingSidebar" class="flex flex-col gap-4">
                <div 
                  v-for="i in 3" 
                  :key="i"
                  class="h-20 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_1.5s_infinite] rounded"
                ></div>
              </div>
              <div v-else class="flex flex-col">
                <ArticleListItem 
                  v-for="article in recentArticles" 
                  :key="article.id"
                  :article="article"
                />
                <p v-if="recentArticles.length === 0" class="text-gray-500 text-sm text-center py-4">
                  Belum ada artikel
                </p>
              </div>
            </div>

            <!-- Popular Articles Section -->
            <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h3 class="text-lg font-bold text-gray-900 mb-4">
                Paling Populer
              </h3>
              <div v-if="loadingSidebar" class="flex flex-col gap-4">
                <div 
                  v-for="i in 3" 
                  :key="i"
                  class="h-20 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_1.5s_infinite] rounded"
                ></div>
              </div>
              <div v-else class="flex flex-col">
                <ArticleListItem 
                  v-for="article in popularArticles" 
                  :key="article.id"
                  :article="article"
                />
                <p v-if="popularArticles.length === 0" class="text-gray-500 text-sm text-center py-4">
                  Belum ada artikel
                </p>
              </div>
            </div>

            <!-- Categories Section -->
            <div class="bg-white rounded-xl shadow-sm p-6">
              <h3 class="text-lg font-bold text-gray-900 mb-4">
                Kategori
              </h3>
              <div v-if="loadingSidebar" class="flex flex-col gap-2">
                <div 
                  v-for="i in 5" 
                  :key="i"
                  class="h-8 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-[shimmer_1.5s_infinite] rounded"
                ></div>
              </div>
              <div v-else-if="categories.length > 0" class="flex flex-wrap gap-2">
                <button
                  v-for="cat in categories"
                  :key="cat.category"
                  @click="filterByCategory(cat.category)"
                  :class="[
                    'px-3 py-1.5 rounded-full text-sm font-medium transition-colors',
                    selectedCategory === cat.category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  ]"
                >
                  {{ cat.category }} ({{ cat.count }})
                </button>
                <button
                  v-if="selectedCategory"
                  @click="clearCategoryFilter"
                  class="px-3 py-1.5 rounded-full text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                >
                  Clear Filter
                </button>
              </div>
              <p v-else class="text-gray-500 text-sm text-center py-4">
                Belum ada kategori
              </p>
            </div>
          </aside>

        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import ArticleCard from '@/components/users/ArticleCard.vue'
import ArticleListItem from '@/components/users/ArticleListItem.vue'

// API Configuration
let base = import.meta.env.VITE_API_BASE_URL || (
  import.meta.env.DEV 
    ? 'http://localhost:5000/api'
    : '/api'
)

// Pastikan selalu diakhiri dengan /articles
if (!base.endsWith('/articles')) {
  base = base.replace(/\/$/, '') + '/articles'
}

const API_BASE = base

// State Management
const searchQuery = ref('')
const selectedCategory = ref(null)
const loading = ref(true)
const loadingSidebar = ref(true)

// Data
const articles = ref([])
const recentArticles = ref([])
const popularArticles = ref([])
const categories = ref([])
const pagination = ref({
  page: 1,
  limit: 6,
  total: 0,
  totalPages: 0
})

// Debounce timer
let searchTimeout = null

// Fetch main articles with filters
const fetchArticles = async () => {
  loading.value = true
  
  try {
    const params = new URLSearchParams({
      page: pagination.value.page,
      limit: pagination.value.limit,
      sort: 'created_at',
      order: 'DESC',
      is_published: '1'
    })

    if (searchQuery.value.trim()) {
      params.append('search', searchQuery.value.trim())
    }

    if (selectedCategory.value) {
      params.append('category', selectedCategory.value)
    }

    const response = await fetch(`${API_BASE}?${params}`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (data.success) {
      articles.value = data.data || []
      
      // Update pagination info from response
      if (data.pagination) {
        pagination.value = {
          page: data.pagination.page,
          limit: data.pagination.limit,
          total: data.pagination.total,
          totalPages: data.pagination.totalPages
        }
      }
    } else {
      console.error('API returned error:', data.message)
      articles.value = []
    }
  } catch (error) {
    console.error('Error fetching articles:', error)
    articles.value = []
    pagination.value.total = 0
    pagination.value.totalPages = 0
  } finally {
    loading.value = false
  }
}

// Fetch sidebar data (recent, popular, categories)
const fetchSidebarData = async () => {
  loadingSidebar.value = true
  
  try {
    // Fetch all sidebar data in parallel
    const [recentRes, popularRes, categoriesRes] = await Promise.allSettled([
      fetch(`${API_BASE}/recent?limit=3`),
      fetch(`${API_BASE}/popular?limit=3`),
      fetch(`${API_BASE}/categories`)
    ])

    // Process recent articles
    if (recentRes.status === 'fulfilled' && recentRes.value.ok) {
      const recentData = await recentRes.value.json()
      if (recentData.success) {
        recentArticles.value = recentData.data || []
      }
    } else {
      console.error('Failed to fetch recent articles:', recentRes)
    }

    // Process popular articles
    if (popularRes.status === 'fulfilled' && popularRes.value.ok) {
      const popularData = await popularRes.value.json()
      if (popularData.success) {
        popularArticles.value = popularData.data || []
      }
    } else {
      console.error('Failed to fetch popular articles:', popularRes)
    }

    // Process categories
    if (categoriesRes.status === 'fulfilled' && categoriesRes.value.ok) {
      const categoriesData = await categoriesRes.value.json()
      if (categoriesData.success) {
        categories.value = categoriesData.data || []
      }
    } else {
      console.error('Failed to fetch categories:', categoriesRes)
    }
  } catch (error) {
    console.error('Error fetching sidebar data:', error)
  } finally {
    loadingSidebar.value = false
  }
}

// Search handler with debounce (500ms)
const handleSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  
  searchTimeout = setTimeout(() => {
    pagination.value.page = 1
    fetchArticles()
  }, 500)
}

// Filter by category
const filterByCategory = (category) => {
  if (selectedCategory.value === category) {
    // Toggle off if clicking same category
    clearCategoryFilter()
  } else {
    selectedCategory.value = category
    pagination.value.page = 1
    fetchArticles()
  }
}

// Clear category filter
const clearCategoryFilter = () => {
  selectedCategory.value = null
  pagination.value.page = 1
  fetchArticles()
}

// Go to specific page
const goToPage = (page) => {
  if (page >= 1 && page <= pagination.value.totalPages && page !== pagination.value.page) {
    pagination.value.page = page
    fetchArticles()
    
    // Smooth scroll to top
    window.scrollTo({ 
      top: 0, 
      behavior: 'smooth' 
    })
  }
}

// Watch for category changes (in case it's changed programmatically)
watch(selectedCategory, (newVal, oldVal) => {
  if (newVal !== oldVal && oldVal !== null) {
    pagination.value.page = 1
    fetchArticles()
  }
})

// Initialize on component mount
onMounted(async () => {
  await Promise.all([
    fetchArticles(),
    fetchSidebarData()
  ])
})
</script>

<style scoped>
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
</style>