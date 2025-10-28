<template>
  <div class="w-full py-6 sm:py-8 lg:py-10">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6 sm:mb-8 px-4 sm:px-6">
      <h2 class="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-900 font-semibold">
        {{ title }}
      </h2>
      <a 
        href="/cari" 
        class="text-blue-500 hover:text-blue-700 text-xs sm:text-sm font-medium transition-colors duration-300 cursor-pointer"
      >
        Lihat Selengkapnya
      </a>
    </div>

    <!-- Slider Wrapper -->
    <div class="relative px-12 sm:px-14 lg:px-16 overflow-hidden">
      <!-- Previous Button -->
      <button 
        v-show="currentIndex > 0"
        @click="prevSlide"
        class="absolute left-0 sm:left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-11 sm:h-11 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center cursor-pointer text-xl sm:text-2xl text-gray-600 shadow-md hover:bg-blue-500 hover:border-blue-500 hover:text-white hover:scale-110 transition-all duration-300"
      >
        ‹
      </button>

      <!-- Slider Container -->
      <div 
        ref="sliderContainer" 
        class="overflow-hidden w-full relative cursor-grab select-none active:cursor-grabbing"
      >
        <div 
          class="flex gap-4 sm:gap-5 w-max px-4 sm:px-5 transition-transform duration-400 ease-in-out"
          :style="{ transform: `translateX(-${currentIndex * slideWidth}px)` }"
        >
          <BookCard 
            v-for="book in books" 
            :key="book.id" 
            :book="book"
            @click="$emit('book-click', book)"
          />
        </div>
      </div>

      <!-- Next Button -->
      <button 
        v-show="currentIndex < maxIndex"
        @click="nextSlide"
        class="absolute right-0 sm:right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 sm:w-11 sm:h-11 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center cursor-pointer text-xl sm:text-2xl text-gray-600 shadow-md hover:bg-blue-500 hover:border-blue-500 hover:text-white hover:scale-110 transition-all duration-300"
      >
        ›
      </button>
    </div>

    <!-- Dots Navigation -->
    <div v-if="totalDots > 1" class="flex justify-center gap-2 mt-6 sm:mt-8">
      <span 
        v-for="(dot, index) in totalDots" 
        :key="index" 
        @click="goToSlide(index)"
        :class="[
          'h-2 rounded-full cursor-pointer transition-all duration-300',
          index === currentIndex 
            ? 'w-6 bg-blue-600' 
            : 'w-2 bg-gray-300 hover:bg-gray-400'
        ]"
      ></span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import BookCard from './BookHomeCard.vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Rekomendasi Untukmu'
  },
  books: {
    type: Array,
    default: () => []
  }
})

defineEmits(['view-all', 'book-click'])

const currentIndex = ref(0)
const sliderContainer = ref(null)
const slideWidth = ref(0)
const cardsPerView = ref(5)

// Drag scroll variables
const isDragging = ref(false)
const startX = ref(0)
const scrollLeft = ref(0)

const calculateSlideWidth = () => {
  if (sliderContainer.value) {
    const containerWidth = sliderContainer.value.offsetWidth
    const windowWidth = window.innerWidth
    
    let cardWidth, gap
    
    if (windowWidth <= 480) {
      // Mobile kecil
      cardWidth = Math.min(containerWidth - 32, 280)
      gap = 16
      cardsPerView.value = 1
      slideWidth.value = cardWidth + gap
    } else if (windowWidth <= 768) {
      // Tablet
      cardWidth = Math.min((containerWidth - 60) / 2, 200)
      gap = 20
      cardsPerView.value = 2
      slideWidth.value = cardWidth + gap
    } else if (windowWidth <= 1024) {
      // Small desktop
      cardWidth = 174
      gap = 20
      cardsPerView.value = Math.floor(containerWidth / (cardWidth + gap))
      slideWidth.value = cardWidth + gap
    } else {
      // Large desktop
      cardWidth = 174
      gap = 20
      cardsPerView.value = Math.floor(containerWidth / (cardWidth + gap))
      slideWidth.value = cardWidth + gap
    }
  }
}

const maxIndex = computed(() => {
  if (props.books.length === 0) return 0
  const maxSlides = Math.max(0, props.books.length - cardsPerView.value)
  return maxSlides
})

const totalDots = computed(() => {
  return maxIndex.value + 1
})

const nextSlide = () => {
  if (currentIndex.value < maxIndex.value) {
    currentIndex.value++
  }
}

const prevSlide = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

const goToSlide = (index) => {
  if (index <= maxIndex.value) {
    currentIndex.value = index
  }
}

const startDrag = (e) => {
  isDragging.value = true
  const clientX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX
  startX.value = clientX
  scrollLeft.value = currentIndex.value
  
  if (sliderContainer.value) {
    sliderContainer.value.classList.add('cursor-grabbing')
  }
}

const onDrag = (e) => {
  if (!isDragging.value) return
  e.preventDefault()
  
  const clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX
  const diff = startX.value - clientX
  const threshold = slideWidth.value / 3
  
  if (Math.abs(diff) > threshold) {
    if (diff > 0 && currentIndex.value < maxIndex.value) {
      currentIndex.value = scrollLeft.value + 1
      startX.value = clientX
      scrollLeft.value = currentIndex.value
    } else if (diff < 0 && currentIndex.value > 0) {
      currentIndex.value = scrollLeft.value - 1
      startX.value = clientX
      scrollLeft.value = currentIndex.value
    }
  }
}

const stopDrag = () => {
  isDragging.value = false
  if (sliderContainer.value) {
    sliderContainer.value.classList.remove('cursor-grabbing')
  }
}

onMounted(() => {
  calculateSlideWidth()
  window.addEventListener('resize', calculateSlideWidth)
  
  if (sliderContainer.value) {
    sliderContainer.value.addEventListener('mousedown', startDrag)
    sliderContainer.value.addEventListener('touchstart', startDrag, { passive: false })
    
    document.addEventListener('mousemove', onDrag)
    document.addEventListener('touchmove', onDrag, { passive: false })
    
    document.addEventListener('mouseup', stopDrag)
    document.addEventListener('touchend', stopDrag)
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', calculateSlideWidth)
  
  if (sliderContainer.value) {
    sliderContainer.value.removeEventListener('mousedown', startDrag)
    sliderContainer.value.removeEventListener('touchstart', startDrag)
  }
  
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('touchmove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
  document.removeEventListener('touchend', stopDrag)
})
</script>

<style scoped>
/* Dyslexia Mode Support */
:global(body.dyslexia-mode) h2,
:global(body.dyslexia-mode) a {
  font-family: 'OpenDyslexic', sans-serif !important;
}

/* Responsive font sizes for dyslexia mode */
@media (max-width: 640px) {
  :global(body.dyslexia-mode) h2 {
    font-size: 1.125rem !important;
    line-height: 1.75rem !important;
  }
  
  :global(body.dyslexia-mode) a {
    font-size: 0.75rem !important;
  }
}

@media (min-width: 641px) and (max-width: 768px) {
  :global(body.dyslexia-mode) h2 {
    font-size: 1.25rem !important;
  }
}
</style>