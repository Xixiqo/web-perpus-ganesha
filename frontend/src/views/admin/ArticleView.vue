<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b sticky top-0 z-40 shadow-sm">
      <div class="container mx-auto px-4 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-[#2C64F9] rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-lg">L</span>
            </div>
            <div>
              <h1 class="font-bold text-lg">Admin Panel</h1>
              <p class="text-xs text-gray-500">Article Management</p>
            </div>
          </div>
          
          <div class="flex items-center space-x-3">
            <router-link to="/articles" class="text-sm text-gray-600 hover:text-[#2C64F9] transition">
              View Site
            </router-link>
            <button class="w-8 h-8 rounded-full bg-[#2C64F9] text-white flex items-center justify-center">
              A
            </button>
          </div>
        </div>
      </div>
    </header>

    <div class="container mx-auto px-4 lg:px-8 py-8">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-xl p-6 shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm mb-1">Total Articles</p>
              <p class="text-3xl font-bold text-gray-900">{{ stats.total }}</p>
            </div>
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-[#2C64F9]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm mb-1">Published</p>
              <p class="text-3xl font-bold text-green-600">{{ stats.published }}</p>
            </div>
            <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm mb-1">Draft</p>
              <p class="text-3xl font-bold text-orange-600">{{ stats.draft }}</p>
            </div>
            <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-sm">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-500 text-sm mb-1">Total Views</p>
              <p class="text-3xl font-bold text-purple-600">{{ formatNumber(stats.views) }}</p>
            </div>
            <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions Bar -->
      <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div class="flex-1 max-w-md">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search articles..."
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C64F9] focus:border-transparent"
                @input="handleSearch"
              />
              <svg class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div class="flex items-center space-x-3">
            <select
              v-model="filterCategory"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C64F9] focus:border-transparent"
              @change="fetchArticles"
            >
              <option value="">All Categories</option>
              <option value="Perpustakaan">Perpustakaan</option>
              <option value="Literasi">Literasi</option>
              <option value="Pendidikan">Pendidikan</option>
              <option value="Teknologi">Teknologi</option>
              <option value="Komunitas">Komunitas</option>
            </select>

            <button
              @click="openCreateModal"
              class="bg-[#2C64F9] text-white px-6 py-2 rounded-lg hover:bg-[#1e4fd6] transition flex items-center space-x-2 whitespace-nowrap"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>New Article</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Articles Table -->
      <div class="bg-white rounded-xl shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50 border-b">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Article</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Views</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-if="loading" v-for="i in 5" :key="i" class="animate-pulse">
                <td class="px-6 py-4" colspan="6">
                  <div class="h-12 bg-gray-200 rounded"></div>
                </td>
              </tr>

              <tr v-else-if="articles.length === 0">
                <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                  No articles found
                </td>
              </tr>

              <tr v-else v-for="article in articles" :key="article.id" class="hover:bg-gray-50 transition">
                <td class="px-6 py-4">
                  <div class="flex items-center space-x-3">
                    <img
                      :src="article.cover_image"
                      :alt="article.title"
                      class="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                      @error="e => e.target.src = '/placeholder-cover.svg'"
                    />
                    <div class="flex-1 min-w-0">
                      <p class="font-semibold text-gray-900 truncate">{{ article.title }}</p>
                      <p class="text-sm text-gray-500">{{ article.author_name || 'Admin' }}</p>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span class="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full whitespace-nowrap">
                    {{ article.category }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span
                    :class="article.is_published ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'"
                    class="px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap"
                  >
                    {{ article.is_published ? 'Published' : 'Draft' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-gray-700">
                  {{ formatNumber(article.views || 0) }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                  {{ formatDate(article.created_at) }}
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center space-x-2">
                    <button
                      @click="viewArticle(article.slug)"
                      class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="View"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button
                      @click="editArticle(article)"
                      class="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                      title="Edit"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      @click="deleteArticle(article)"
                      class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Delete"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="pagination.total > 0" class="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
          <p class="text-sm text-gray-600">
            Showing {{ (currentPage - 1) * pagination.limit + 1 }} - {{ Math.min(currentPage * pagination.limit, pagination.total) }} of {{ pagination.total }} articles
          </p>
          <div class="flex items-center space-x-2">
            <button
              @click="previousPage"
              :disabled="currentPage === 1"
              :class="currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'"
              class="px-4 py-2 border rounded-lg transition"
            >
              Previous
            </button>
            <span class="px-4 py-2 text-sm font-medium">
              Page {{ currentPage }} of {{ pagination.totalPages }}
            </span>
            <button
              @click="nextPage"
              :disabled="currentPage >= pagination.totalPages"
              :class="currentPage >= pagination.totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'"
              class="px-4 py-2 border rounded-lg transition"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <ArticleFormModal
      v-if="showModal"
      :article="selectedArticle"
      @close="closeModal"
      @saved="handleSaved"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ArticleFormModal from '@/components/admin/ArticleFormModal.vue'

const router = useRouter()
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const articles = ref([])
const loading = ref(false)
const searchQuery = ref('')
const filterCategory = ref('')
const showModal = ref(false)
const selectedArticle = ref(null)
const currentPage = ref(1)

const pagination = ref({
  total: 0,
  limit: 10,
  totalPages: 1
})

const stats = computed(() => {
  return {
    total: pagination.value.total,
    published: articles.value.filter(a => a.is_published).length,
    draft: articles.value.filter(a => !a.is_published).length,
    views: articles.value.reduce((sum, a) => sum + (a.views || 0), 0)
  }
})

// Fetch articles
const fetchArticles = async () => {
  loading.value = true
  try {
    const params = new URLSearchParams({
      page: currentPage.value,
      limit: pagination.value.limit
    })
    
    if (filterCategory.value) {
      params.append('category', filterCategory.value)
    }
    
    if (searchQuery.value) {
      params.append('search', searchQuery.value)
    }
    
    const response = await fetch(`${API_BASE_URL}/api/articles?${params}`)
    const data = await response.json()
    
    if (data.success) {
      articles.value = data.data || []
      pagination.value = data.pagination || { total: 0, limit: 10, totalPages: 1 }
    }
  } catch (error) {
    console.error('Error fetching articles:', error)
    articles.value = []
  } finally {
    loading.value = false
  }
}

// Search handler with debounce
let searchTimeout
const handleSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    fetchArticles()
  }, 500)
}

// Pagination
const nextPage = () => {
  if (currentPage.value < pagination.value.totalPages) {
    currentPage.value++
    fetchArticles()
  }
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchArticles()
  }
}

// Modal handlers
const openCreateModal = () => {
  selectedArticle.value = null
  showModal.value = true
}

const editArticle = (article) => {
  selectedArticle.value = article
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedArticle.value = null
}

const handleSaved = () => {
  closeModal()
  fetchArticles()
}

// Actions
const viewArticle = (slug) => {
  router.push(`/articles/${slug}`)
}

const deleteArticle = async (article) => {
  if (!confirm(`Are you sure you want to delete "${article.title}"?`)) {
    return
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/articles/${article.id}`, {
      method: 'DELETE'
    })
    
    const data = await response.json()
    
    if (data.success) {
      alert('Article deleted successfully')
      fetchArticles()
    } else {
      alert(data.message || 'Failed to delete article')
    }
  } catch (error) {
    console.error('Error deleting article:', error)
    alert('Failed to delete article')
  }
}

// Format helpers
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace('.0', '') + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace('.0', '') + 'K'
  }
  return num.toString()
}

onMounted(() => {
  fetchArticles()
})
</script>