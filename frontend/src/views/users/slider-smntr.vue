<template>
  <div class="container">
    <div class="header">
      <h2>Rekomendasi Untukmu</h2>
      <a href="#" class="view-all">Lihat Selengkapnya →</a>
    </div>

    <div class="slider-wrapper">
      <button 
        class="nav-btn prev" 
        @click="prevSlide" 
        :disabled="currentIndex === 0"
        v-show="currentIndex > 0"
      >
        ‹
      </button>

      <div class="slider-container" ref="sliderContainer">
        <div 
          class="slider-track" 
          :style="{ transform: `translateX(-${currentIndex * (cardWidth + gap)}px)` }"
        >
          <div class="book-card" v-for="book in books" :key="book.id">
            <div class="book-image">
              <img :src="book.image" :alt="book.title">
              <div class="overlay">
                <button class="btn-detail">Lihat Detail</button>
              </div>
            </div>
            <div class="book-info">
              <span class="category">{{ book.category }}</span>
              <h3 class="book-title">{{ book.title }}</h3>
              <p class="book-author">{{ book.author }}</p>
              <div class="rating">
                <div class="stars">
                  <span 
                    v-for="i in 5" 
                    :key="i" 
                    class="star"
                    :class="{ 
                      filled: i <= Math.floor(book.rating), 
                      half: i === Math.ceil(book.rating) && book.rating % 1 !== 0 && i > Math.floor(book.rating)
                    }"
                  >     
                    ★
                  </span>
                </div>
                <span class="rating-value">{{ book.rating }}/5</span>
              </div>
              <div class="book-footer">
                <span class="price">{{ book.price }}</span>
                <button class="btn-cart">🛒</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button 
        class="nav-btn next" 
        @click="nextSlide" 
        :disabled="currentIndex >= maxIndex"
        v-show="currentIndex < maxIndex"
      >
        ›
      </button>
    </div>

    <div class="dots">
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
import { ref, computed, onMounted } from 'vue'

const currentIndex = ref(0)
const sliderContainer = ref(null)
const cardWidth = ref(220)
const gap = ref(20)

// Data dummy untuk 10 buku
const books = ref([
  {
    id: 1,
    title: "Filosofi Teras",
    author: "Henry Manampiring",
    rating: 4.5,
    price: "Rp 95.000",
    category: "Populer",
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop"
  },
  {
    id: 2,
    title: "Atomic Habits",
    author: "James Clear",
    rating: 5,
    price: "Rp 120.000",
    category: "Populer",
    image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=300&h=400&fit=crop"
  },
  {
    id: 3,
    title: "Sapiens",
    author: "Yuval Noah Harari",
    rating: 4.8,
    price: "Rp 150.000",
    category: "Populer",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop"
  },
  {
    id: 4,
    title: "Laskar Pelangi",
    author: "Andrea Hirata",
    rating: 4.7,
    price: "Rp 85.000",
    category: "Populer",
    image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop"
  },
  {
    id: 5,
    title: "Bumi Manusia",
    author: "Pramoedya Ananta Toer",
    rating: 4.9,
    price: "Rp 110.000",
    category: "Populer",
    image: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=300&h=400&fit=crop"
  },
  {
    id: 6,
    title: "Cantik Itu Luka",
    author: "Eka Kurniawan",
    rating: 4.6,
    price: "Rp 95.000",
    category: "Populer",
    image: "https://images.unsplash.com/photo-1513001900722-370f803f498d?w=300&h=400&fit=crop"
  },
  {
    id: 7,
    title: "Perahu Kertas",
    author: "Dee Lestari",
    rating: 4.4,
    price: "Rp 88.000",
    category: "Populer",
    image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=300&h=400&fit=crop"
  },
  {
    id: 8,
    title: "Negeri 5 Menara",
    author: "Ahmad Fuadi",
    rating: 4.7,
    price: "Rp 92.000",
    category: "Populer",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop"
  },
  {
    id: 9,
    title: "Sang Pemimpi",
    author: "Andrea Hirata",
    rating: 4.6,
    price: "Rp 87.000",
    category: "Populer",
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=300&h=400&fit=crop"
  },
  {
    id: 10,
    title: "Hujan",
    author: "Tere Liye",
    rating: 4.8,
    price: "Rp 98.000",
    category: "Populer",
    image: "https://images.unsplash.com/photo-1526243741027-444d633d7365?w=300&h=400&fit=crop"
  }
])

const maxIndex = computed(() => {
  return Math.max(0, books.value.length - Math.floor(sliderContainer.value?.offsetWidth / (cardWidth.value + gap.value)) || 5)
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
  currentIndex.value = index
}

onMounted(() => {
  // Bisa ditambahkan auto-play atau swipe gesture di sini
})
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.header h2 {
  font-size: 24px;
  color: #1a1a1a;
  font-weight: 600;
}

.view-all {
  color: #666;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s;
}

.view-all:hover {
  color: #ff6b6b;
}

.slider-wrapper {
  position: relative;
  padding: 0 50px;
}

.slider-container {
  overflow: hidden;
  width: 100%;
}

.slider-track {
  display: flex;
  gap: 20px;
  transition: transform 0.4s ease-in-out;
}

.book-card {
  min-width: 220px;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

.book-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.book-image {
  position: relative;
  width: 100%;
  height: 300px;
  overflow: hidden;
}

.book-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.book-card:hover .overlay {
  opacity: 1;
}

.btn-detail {
  background: white;
  color: #1a1a1a;
  border: none;
  padding: 10px 24px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: transform 0.2s;
}

.btn-detail:hover {
  transform: scale(1.05);
}

.book-info {
  padding: 16px;
}

.category {
  display: inline-block;
  background: #fff3e0;
  color: #ff9800;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.book-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 6px;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.book-author {
  font-size: 13px;
  color: #666;
  margin-bottom: 10px;
}

.rating {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.stars {
  display: flex;
  gap: 2px;
}

.star {
  color: #ddd;
  font-size: 16px;
}

.star.filled {
  color: #ffc107;
}

.star.half {
  background: linear-gradient(90deg, #ffc107 50%, #ddd 50%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.rating-value {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

.book-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #eee;
}

.price {
  font-size: 16px;
  font-weight: 700;
  color: #ff6b6b;
}

.btn-cart {
  background: #ff6b6b;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s, background 0.2s;
  font-size: 16px;
}

.btn-cart:hover {
  background: #ff5252;
  transform: scale(1.1);
}

.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 24px;
  color: #333;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 10;
  transition: all 0.3s;
}

.nav-btn:hover:not(:disabled) {
  background: #ff6b6b;
  color: white;
  transform: translateY(-50%) scale(1.1);
}

.nav-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
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
  background: #ff6b6b;
  width: 24px;
  border-radius: 4px;
}

@media (max-width: 768px) {
  .slider-wrapper {
    padding: 0 40px;
  }
  
  .book-card {
    min-width: 180px;
  }
  
  .book-image {
    height: 240px;
  }
  
  .nav-btn {
    width: 32px;
    height: 32px;
    font-size: 20px;
  }
}
</style>