<template>
  <router-link 
    :to="`/articles/${article.slug}`" 
    class="group relative rounded-[10px] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.25)] transition-all duration-300 cursor-pointer block no-underline hover:-translate-y-[3px]"
  >
    <!-- Image -->
    <div class="relative h-[400px] overflow-hidden bg-gray-200">
      <img 
        v-if="imageLoaded"
        :src="imageUrl" 
        :alt="article.title"
        class="w-full h-full object-cover transition-transform duration-[600ms] ease-out group-hover:scale-110"
        @error="handleImageError"
        @load="imageLoaded = true"
      />
      
      <!-- Image Loading Placeholder -->
      <div 
        v-else
        class="w-full h-full flex items-center justify-center bg-gray-100"
      >
        <svg class="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      
      <!-- Category Badge -->
      <div class="absolute top-4 left-4 z-10">
        <span class="bg-white text-gray-800 px-2.5 py-1 rounded-full text-[0.85rem] font-medium shadow-sm">
          {{ article.category || 'Uncategorized' }}
        </span>
      </div>
      
      <!-- Gradient Overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-100 transition-opacity duration-300"></div>
    </div>

    <!-- Content - Default state: sedikit turun (translateY(25%)) -->
    <div class="absolute bottom-0 left-0 right-0 p-6 text-white transition-transform duration-400 z-10 translate-y-[25%] group-hover:translate-y-0">
      <!-- Title - selalu terlihat -->
      <h3 class="text-[1.1rem] font-bold mb-2 leading-snug line-clamp-2 transition-transform duration-400">
        {{ article.title }}
      </h3>
      
      <!-- Excerpt - hidden by default, muncul saat hover -->
      <p class="text-[0.9rem] text-gray-300 opacity-0 translate-y-2.5 transition-all duration-400 line-clamp-2 group-hover:opacity-100 group-hover:translate-y-0">
        {{ excerpt }}
      </p>
      
      <!-- Meta Info -->
      <div class="flex items-center gap-4 mt-3 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-400">
        <span v-if="article.reading_time" class="flex items-center gap-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ article.reading_time }} min
        </span>
        
        <span v-if="article.views !== undefined && article.views !== null" class="flex items-center gap-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          {{ formattedViews }}
        </span>
        
        <span v-if="article.created_at" class="flex items-center gap-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {{ formattedDate }}
        </span>
      </div>
    </div>
  </router-link>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  article: {
    type: Object,
    required: true
  }
})

// Image state
const imageLoaded = ref(false)
const imageUrl = ref('')
const fallbackImage = '/placeholder-cover.svg'

// Initialize image URL
onMounted(() => {
  imageUrl.value = getImageUrl(props.article.cover_image)
})

// Helper function to get image URL from database
const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return fallbackImage
  }
  
  // If it's already a full URL (http:// or https://)
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }
  
  // If path starts with /uploads/ (already correct format from API)
  if (imagePath.startsWith('/uploads/')) {
    return imagePath
  }
  
  // If it's just a filename without path
  if (!imagePath.includes('/')) {
    return `/uploads/articles/${imagePath}`
  }
  
  // Default: assume it's already a valid path
  return imagePath
}

// Handle image loading error
const handleImageError = (e) => {
  console.warn('Failed to load image:', imageUrl.value)
  e.target.src = fallbackImage
  imageLoaded.value = true
}

// Get excerpt from content (strip HTML tags)
const excerpt = computed(() => {
  if (!props.article.content) {
    return 'Baca selengkapnya...'
  }
  
  // Remove HTML tags
  const plainText = props.article.content.replace(/<[^>]*>/g, '').trim()
  
  // Truncate to 150 characters
  if (plainText.length > 150) {
    return plainText.substring(0, 150).trim() + '...'
  }
  
  return plainText || 'Baca selengkapnya...'
})

// Format views count (1K, 1M format)
const formattedViews = computed(() => {
  const views = props.article.views || 0
  
  if (views >= 1000000) {
    return (views / 1000000).toFixed(1).replace('.0', '') + 'M'
  }
  
  if (views >= 1000) {
    return (views / 1000).toFixed(1).replace('.0', '') + 'K'
  }
  
  return views.toString()
})

// Format date to Indonesian relative time
const formattedDate = computed(() => {
  if (!props.article.created_at) {
    return ''
  }
  
  try {
    const date = new Date(props.article.created_at)
    const now = new Date()
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return ''
    }
    
    const diffTime = Math.abs(now - date)
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
    const diffMinutes = Math.floor(diffTime / (1000 * 60))
    
    // Relative time for recent posts
    if (diffMinutes < 60) {
      return diffMinutes === 0 ? 'Baru saja' : `${diffMinutes} menit lalu`
    }
    
    if (diffHours < 24) {
      return `${diffHours} jam lalu`
    }
    
    if (diffDays === 0) {
      return 'Hari ini'
    }
    
    if (diffDays === 1) {
      return 'Kemarin'
    }
    
    if (diffDays < 7) {
      return `${diffDays} hari lalu`
    }
    
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7)
      return `${weeks} minggu lalu`
    }
    
    if (diffDays < 365) {
      const months = Math.floor(diffDays / 30)
      return `${months} bulan lalu`
    }
    
    // Format: DD MMM YYYY for older posts
    const options = { day: 'numeric', month: 'short', year: 'numeric' }
    return date.toLocaleDateString('id-ID', options)
  } catch (error) {
    console.error('Error formatting date:', error)
    return ''
  }
})
</script>

<style scoped>
/* Line clamp utilities */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>