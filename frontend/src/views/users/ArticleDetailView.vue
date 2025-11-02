<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2C64F9]"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="container mx-auto px-4 py-20 text-center">
      <h2 class="text-2xl font-bold text-gray-800 mb-4">Artikel tidak ditemukan</h2>
      <router-link to="/article" class="text-[#2C64F9] hover:underline">Kembali ke halaman artikel</router-link>
    </div>

    <!-- Article Content -->
    <article v-else-if="article" class="animate-fade-in">
      <!-- Hero Section -->
      <div class="bg-white border-b">
        <div class="container mx-auto px-4 py-12 md:py-16 max-w-4xl">
          <!-- Category Badge -->
          <div class="mb-4">
            <span class="inline-block bg-[#2C64F9] text-white px-4 py-1.5 rounded-full text-sm font-medium">
              {{ article.category }}
            </span>
          </div>

          <!-- Title -->
          <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {{ article.title }}
          </h1>

          <!-- Meta Info -->
          <div class="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span class="font-medium">{{ article.author_name || 'Admin' }}</span>
            </div>

            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{{ article.reading_time }} menit baca</span>
            </div>

            <div v-if="article.created_at" class="flex items-center gap-2">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{{ formattedDate }}</span>
            </div>

            <div v-if="article.views" class="flex items-center gap-2">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>{{ formattedViews }} views</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Cover Image -->
      <div class="container mx-auto px-4 py-8 max-w-5xl">
        <div class="rounded-2xl overflow-hidden shadow-lg">
          <img 
            :src="article.cover_image" 
            :alt="article.title"
            class="w-full h-auto object-cover"
            @error="handleImageError"
          />
        </div>
      </div>

      <!-- Article Body -->
      <div class="container mx-auto px-4 py-8 max-w-4xl">
        <div class="bg-white rounded-2xl shadow-sm p-6 md:p-10">
          <!-- Content with formatted headers and optional images -->
          <div class="prose prose-lg max-w-none" v-html="formattedContent"></div>
        </div>
      </div>

      <!-- Related Articles -->
      <div v-if="relatedArticles.length > 0" class="container mx-auto px-4 py-16 max-w-6xl">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Artikel Terkait</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ArticleCard 
            v-for="relatedArticle in relatedArticles" 
            :key="relatedArticle.id"
            :article="relatedArticle"
          />
        </div>
      </div>

      <!-- Back to Articles Button -->
      <div class="container mx-auto px-4 pb-16 max-w-4xl">
        <router-link 
          to="/article" 
          class="inline-flex items-center gap-2 px-6 py-3 bg-[#2C64F9] text-white rounded-lg hover:bg-[#1e4fd6] transition-colors duration-300 font-medium"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali ke Artikel
        </router-link>
      </div>
    </article>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ArticleCard from '@/components/users/ArticleCard.vue'

const route = useRoute()
const article = ref(null)
const relatedArticles = ref([])
const loading = ref(true)
const error = ref(false)

// API Base URL from environment variable
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// Fetch article data
const fetchArticle = async () => {
  try {
    loading.value = true
    const slug = route.params.slug
    
    console.log('Fetching article with slug:', slug)
    
    // Fetch article by slug
    const response = await fetch(`${API_BASE_URL}/api/articles/${slug}`)
    
    console.log('Response status:', response.status)
    
    if (!response.ok) {
      throw new Error('Article not found')
    }
    
    const data = await response.json()
    console.log('Article data:', data)
    
    // Handle response structure: {success: true, data: {...}}
    article.value = data.data || data
    
    // Increment view count
    try {
      await fetch(`${API_BASE_URL}/api/articles/${slug}/view`, { method: 'POST' })
    } catch (viewErr) {
      console.warn('Failed to increment view count:', viewErr)
    }
    
    // Fetch related articles
    if (article.value.category) {
      await fetchRelatedArticles(article.value.category, article.value.id)
    }
    
    loading.value = false
  } catch (err) {
    console.error('Error fetching article:', err)
    error.value = true
    loading.value = false
  }
}

// Fetch related articles by category
const fetchRelatedArticles = async (category, currentId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/articles?category=${encodeURIComponent(category)}&limit=3`)
    
    if (!response.ok) {
      throw new Error('Failed to fetch related articles')
    }
    
    const articles = await response.json()
    
    // Handle response structure: {success: true, data: [...]}
    const articlesList = articles.data || articles
    
    // Filter out current article and limit to 3
    relatedArticles.value = articlesList
      .filter(a => a.id !== currentId)
      .slice(0, 3)
  } catch (err) {
    console.error('Error fetching related articles:', err)
  }
}

// Format content with headers and optional images
const formattedContent = computed(() => {
  if (!article.value?.content) return ''
  
  let content = article.value.content
  
  // Convert ## headers to styled h2 elements
  content = content.replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b-2 border-[#2C64F9]">$1</h2>')
  
  // Convert paragraphs
  const paragraphs = content.split('\n').filter(p => p.trim() !== '')
  let formattedParagraphs = []
  let imageInserted = false
  
  paragraphs.forEach((para, index) => {
    // Skip if it's already an h2
    if (para.includes('<h2')) {
      formattedParagraphs.push(para)
      return
    }
    
    // Add paragraph
    formattedParagraphs.push(`<p class="text-gray-700 leading-relaxed mb-4">${para}</p>`)
    
    // Insert images after 2nd paragraph if available
    if (index === 1 && !imageInserted) {
      const images = []
      if (article.value.image_1) images.push(article.value.image_1)
      if (article.value.image_2) images.push(article.value.image_2)
      if (article.value.image_3) images.push(article.value.image_3)
      
      if (images.length > 0) {
        imageInserted = true
        
        if (images.length === 1) {
          formattedParagraphs.push(`
            <div class="my-8 rounded-xl overflow-hidden shadow-md">
              <img src="${images[0]}" alt="Article image" class="w-full h-auto object-cover" />
            </div>
          `)
        } else if (images.length === 2) {
          formattedParagraphs.push(`
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
              <div class="rounded-xl overflow-hidden shadow-md">
                <img src="${images[0]}" alt="Article image 1" class="w-full h-full object-cover" />
              </div>
              <div class="rounded-xl overflow-hidden shadow-md">
                <img src="${images[1]}" alt="Article image 2" class="w-full h-full object-cover" />
              </div>
            </div>
          `)
        } else if (images.length === 3) {
          formattedParagraphs.push(`
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
              <div class="rounded-xl overflow-hidden shadow-md">
                <img src="${images[0]}" alt="Article image 1" class="w-full h-full object-cover" />
              </div>
              <div class="rounded-xl overflow-hidden shadow-md">
                <img src="${images[1]}" alt="Article image 2" class="w-full h-full object-cover" />
              </div>
              <div class="rounded-xl overflow-hidden shadow-md">
                <img src="${images[2]}" alt="Article image 3" class="w-full h-full object-cover" />
              </div>
            </div>
          `)
        }
      }
    }
  })
  
  return formattedParagraphs.join('')
})

// Format date
const formattedDate = computed(() => {
  if (!article.value?.created_at) return ''
  
  const date = new Date(article.value.created_at)
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return date.toLocaleDateString('id-ID', options)
})

// Format views
const formattedViews = computed(() => {
  if (!article.value?.views) return '0'
  
  const views = article.value.views
  if (views >= 1000000) {
    return (views / 1000000).toFixed(1).replace('.0', '') + 'M'
  }
  if (views >= 1000) {
    return (views / 1000).toFixed(1).replace('.0', '') + 'K'
  }
  return views.toString()
})

// Handle image error
const handleImageError = (e) => {
  e.target.src = '/placeholder-cover.svg'
}

onMounted(() => {
  fetchArticle()
})
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out;
}

/* Prose styling for content */
.prose {
  color: #374151;
  font-size: 1.125rem;
  line-height: 1.75;
}

.prose :deep(h2) {
  scroll-margin-top: 100px;
}

.prose :deep(p) {
  margin-bottom: 1.5rem;
}

.prose :deep(img) {
  transition: transform 0.3s ease;
}

.prose :deep(img:hover) {
  transform: scale(1.02);
}
</style>