<template>
  <router-link 
    :to="`/articles/${article.slug}`"
    class="flex gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 no-underline group border-b border-gray-100 last:border-0"
  >
    <!-- Thumbnail -->
    <div class="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200">
      <img 
        :src="imageUrl" 
        :alt="article.title"
        :class="[
          'w-full h-full object-cover transition-all duration-[600ms] ease-out',
          imageLoaded ? 'opacity-100' : 'opacity-0',
          'group-hover:scale-110'
        ]"
        @error="handleImageError"
        @load="handleImageLoad"
      />
      <div 
        v-if="!imageLoaded"
        class="absolute inset-0 w-full h-full flex items-center justify-center bg-gray-100"
      >
        <svg class="w-16 h-16 text-gray-300 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>

      <div 
        v-else 
        class="w-full h-full flex items-center justify-center bg-gray-100"
      >
        <svg class="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 min-w-0">
      <h4 class="text-sm font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
        {{ article.title }}
      </h4>
      
      <!-- Meta Info -->
      <div class="flex items-center gap-2 text-xs text-gray-500">
        <span v-if="article.reading_time" class="flex items-center gap-1">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ article.reading_time }} min
        </span>
        
        <span v-if="article.views !== undefined && article.views !== null" class="flex items-center gap-1">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          {{ formattedViews }}
        </span>

        <span v-if="article.created_at" class="flex items-center gap-1">
          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {{ relativeDate }}
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
const imageError = ref(false)
const imageUrl = ref('')
const fallbackImage = '/placeholder-cover.svg'

// Initialize image URL and start loading
onMounted(() => {
  imageUrl.value = getImageUrl(props.article.cover_image)
  
  // Pre-check if image exists (optional optimization)
  if (imageUrl.value && imageUrl.value !== fallbackImage) {
    // Image will load via @load event
  } else {
    // No valid image, show placeholder immediately
    imageLoaded.value = true
  }
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
  console.error('Failed to load image:', imageUrl.value)
  imageError.value = true
  imageLoaded.value = true // Still set to true to hide loading state
  e.target.src = fallbackImage
}

// Handle successful image load
const handleImageLoad = () => {
  imageLoaded.value = true
  imageError.value = false
}

// Format views count (compact format)
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

// Relative date (short format for sidebar)
const relativeDate = computed(() => {
  if (!props.article.created_at) {
    return ''
  }
  
  try {
    const date = new Date(props.article.created_at)
    const now = new Date()
    
    if (isNaN(date.getTime())) {
      return ''
    }
    
    const diffTime = Math.abs(now - date)
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
    
    if (diffHours < 1) {
      return 'Baru saja'
    }
    
    if (diffHours < 24) {
      return `${diffHours}j`
    }
    
    if (diffDays < 7) {
      return `${diffDays}h`
    }
    
    if (diffDays < 30) {
      return `${Math.floor(diffDays / 7)}mg`
    }
    
    if (diffDays < 365) {
      return `${Math.floor(diffDays / 30)}bl`
    }
    
    return `${Math.floor(diffDays / 365)}th`
  } catch (error) {
    console.error('Error formatting date:', error)
    return ''
  }
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>