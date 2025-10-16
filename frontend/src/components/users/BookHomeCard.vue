<template>
  <div 
    class="book-card"
    :class="{ hovered: isHovered }"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <div class="book-image">
      <img :src="getCoverUrl(book.cover)" :alt="book.title" @error="onError" />
    </div>
    <div class="book-info">
      <p class="book-author">{{ book.author }}</p>
      <h3 class="book-title">{{ book.title }}</h3>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  book: {
    type: Object,
    required: true
  }
})

const isHovered = ref(false)

const onError = (e) => {
  e.target.onerror = null
  e.target.src = '/placeholder-cover.svg'
}

const getCoverUrl = (filename) => {
  if (!filename) return '/placeholder-cover.svg'
  const base = import.meta.env.VITE_API_BASE || 'http://localhost:5000'
  if (/^https?:\/\//i.test(filename)) return filename
  return `${base}/uploads/${filename}`
}
</script>

<style scoped>
.book-card {
  width: 210px;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.book-card.hovered {
  border-color: #2196F3;
  box-shadow: 0 8px 24px rgba(33, 150, 243, 0.2);
  transform: translateY(-4px);
}

.book-image {
  width: 100%;
  height: 280px;
  overflow: hidden;
  background: #f5f5f5;
}

.book-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.book-card.hovered .book-image img {
  transform: scale(1.05);
}

.book-info {
  padding: 16px;
  background: white;
}

.category {
  display: inline-block;
  background: transparent;
  color: #2196F3;
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 8px;
}

.rating-top {
  float: right;
  margin-top: -24px;
}

.rating-value {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

.book-author {
  font-size: 12px;
  font-weight: 400;
  color: #666;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.book-title {
  font-size: 16px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 42px;
}

@media (max-width: 768px) {
  .book-card {
    min-width: 160px;
  }
  
  .book-image {
    height: 220px;
  }
  
  .book-info {
    padding: 12px;
  }
  
  .book-title {
    font-size: 14px;
    min-height: 40px;
  }
}
</style>