<template>
  <div class="slider-section">
    <div class="header">
      <h2>{{ title }}</h2>
      <a href="/cari" class="view-all">
        Lihat Selengkapnya
      </a>
    </div>

    <div class="slider-wrapper">
      <button 
        class="nav-btn prev" 
        @click="prevSlide"
        v-show="currentIndex > 0"
      >
        ‹
      </button>

      <div class="slider-container" ref="sliderContainer">
        <div 
          class="slider-track" 
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

      <button 
        class="nav-btn next" 
        @click="nextSlide"
        v-show="currentIndex < maxIndex"
      >
        ›
      </button>
    </div>

    <div class="dots" v-if="totalDots > 1">
      <span 
        v-for="(dot, index) in totalDots" 
        :key="index" 
        class="dot" 
        :class="{ active: index === currentIndex }"
        @click="goToSlide(index)"
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
      cardWidth = containerWidth - 80 // Kurangi padding kiri kanan (45px x 2 = 90px, sisa 10px untuk spacing)
      gap = 12
      cardsPerView.value = 1
      slideWidth.value = cardWidth + gap
    } else if (windowWidth <= 768) {
      // Tablet
      cardWidth = containerWidth - 100 // Kurangi padding
      gap = 16
      cardsPerView.value = 1
      slideWidth.value = cardWidth + gap
    } else {
      // Desktop
      cardWidth = 174
      gap = 20
      cardsPerView.value = Math.floor(containerWidth / (cardWidth + gap))
      slideWidth.value = cardWidth + gap
    }
  }
}

const maxIndex = computed(() => {
  if (props.books.length === 0) return 0
  
  // Maksimal index adalah total buku dikurangi jumlah kartu yang terlihat
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
    sliderContainer.value.style.cursor = 'grabbing'
  }
}

const onDrag = (e) => {
  if (!isDragging.value) return
  e.preventDefault()
  
  const clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX
  const diff = startX.value - clientX
  const threshold = slideWidth.value / 3 // Minimal 1/3 card width untuk pindah
  
  if (Math.abs(diff) > threshold) {
    if (diff > 0 && currentIndex.value < maxIndex.value) {
      // Drag ke kiri, pindah ke next
      currentIndex.value = scrollLeft.value + 1
      startX.value = clientX
      scrollLeft.value = currentIndex.value
    } else if (diff < 0 && currentIndex.value > 0) {
      // Drag ke kanan, pindah ke prev
      currentIndex.value = scrollLeft.value - 1
      startX.value = clientX
      scrollLeft.value = currentIndex.value
    }
  }
}

const stopDrag = () => {
  isDragging.value = false
  if (sliderContainer.value) {
    sliderContainer.value.style.cursor = 'grab'
  }
}

onMounted(() => {
  calculateSlideWidth()
  window.addEventListener('resize', calculateSlideWidth)
  
  // Add drag event listeners
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
  
  // Remove drag event listeners
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
.slider-section {
  width: 100%;
  padding: 40px 0;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 0 20px;
}

.header h2 {
  font-size: 24px;
  color: #1a1a1a;
  font-weight: 600;
}

.view-all {
  color: #2196F3;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.3s;
  cursor: pointer;
}

.view-all:hover {
  color: #1976D2;
}

.slider-wrapper {
  position: relative;
  padding: 0 60px;
  overflow: hidden;
}

.slider-container {
  overflow: hidden;
  width: 100%;
  position: relative;
  cursor: grab;
  user-select: none;
}

.slider-track {
  display: flex;
  gap: 20px;
  width: max-content;
  padding: 0 20px;
  transition: transform 0.4s ease-in-out;
}

.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: white;
  border: 2px solid #e0e0e0;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 24px;
  color: #666;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 10;
  transition: all 0.3s;
}

.nav-btn:hover {
  background: #2196F3;
  border-color: #2196F3;
  color: white;
  transform: translateY(-50%) scale(1.1);
}

.nav-btn.prev {
  left: 0;
}

.nav-btn.next {
  right: 0;
}

.dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 30px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ddd;
  cursor: pointer;
  transition: all 0.3s;
}

.dot:hover {
  background: #bbb;
}

.dot.active {
  background: #2C64E3;
  width: 24px;
  border-radius: 4px;
}

@media (max-width: 768px) {
  .slider-section {
    padding: 30px 0;
  }

  .header {
    padding: 0 16px;
    margin-bottom: 20px;
  }
  
  .header h2 {
    font-size: 20px;
  }

  .view-all {
    font-size: 13px;
  }
  
  .slider-wrapper {
    padding: 0 50px;
    overflow: hidden;
  }
  
  .slider-track {
    gap: 16px;
    padding: 0 16px;
  }
  
  .nav-btn {
    width: 36px;
    height: 36px;
    font-size: 20px;
  }

  .nav-btn.prev {
    left: 5px;
  }

  .nav-btn.next {
    right: 5px;
  }

  .dots {
    margin-top: 20px;
    gap: 6px;
  }

  .dot {
    width: 6px;
    height: 6px;
  }

  .dot.active {
    width: 20px;
  }
}

@media (max-width: 480px) {
  .slider-wrapper {
    padding: 0 45px;
    overflow: hidden;
  }

  .slider-track {
    gap: 12px;
    padding: 0 16px;
  }

  .nav-btn {
    width: 32px;
    height: 32px;
    font-size: 18px;
  }

  .nav-btn.prev {
    left: 5px;
  }

  .nav-btn.next {
    right: 5px;
  }
}
</style>