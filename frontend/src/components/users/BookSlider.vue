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

const calculateSlideWidth = () => {
  if (sliderContainer.value) {
    const containerWidth = sliderContainer.value.offsetWidth
    const cardWidth = 174 // sesuaikan dengan lebar card
    const gap = 20
    
    // Hitung berapa kartu yang bisa terlihat penuh
    cardsPerView.value = Math.floor(containerWidth / (cardWidth + gap))
    
    // Slide width adalah lebar satu kartu + gap
    slideWidth.value = cardWidth + gap
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

onMounted(() => {
  calculateSlideWidth()
  window.addEventListener('resize', calculateSlideWidth)
})

onUnmounted(() => {
  window.removeEventListener('resize', calculateSlideWidth)
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
}

.slider-container {
  overflow: hidden;
  width: 100%;
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
  .header {
    padding: 0 16px;
  }
  
  .header h2 {
    font-size: 20px;
  }
  
  .slider-wrapper {
    padding: 0 50px;
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
}
</style>  