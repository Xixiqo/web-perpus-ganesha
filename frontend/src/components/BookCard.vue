<template>
  <div class="book-card" @click="handleClick">
    <!-- Thumbnail -->
    <div 
      class="thumb" 
      :class="{ 'placeholder': !book.cover }"
      :style="book.cover ? `background-image: url(${book.cover})` : ''"
    ></div>
    
    <!-- Meta Info -->
    <div class="meta">
      <h4>{{ book.title || `Judul Buku ${index}` }}</h4>
      <p class="author">{{ book.category || 'Kategori' }} • {{ book.author || 'Penulis' }}</p>
      <div class="rating small">
        <span class="stars">{{ renderStars(book.rating || 4.2) }}</span>
        <span class="score">{{ book.rating || 4.2 }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  book: {
    type: Object,
    default: () => ({})
  },
  index: {
    type: Number,
    default: 1
  }
})

const emit = defineEmits(['click'])

const handleClick = () => {
  emit('click', props.book)
}

const renderStars = (rating) => {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  let stars = '⭐'.repeat(fullStars)
  if (hasHalfStar && fullStars < 5) {
    stars += '✨'
  }
  return stars
}
</script>

<style scoped>
.book-card {
  background: #fff;
  border: 2px solid #eef2ff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.08);
  transition: transform 0.2s ease;
  cursor: pointer;
}

.book-card:hover {
  transform: translateY(-4px);
  border: 2px solid #3b82f6;
  box-shadow: 0 10px 24px rgba(37, 99, 235, 0.2);
  transition: all 0.5s ease-in-out;
}

.thumb {
  height: 150px;
  background: #f8fafc;
  background-size: cover;
  background-position: center;
}

.placeholder {
  background-image: 
    linear-gradient(45deg, #f3f4f6 25%, transparent 25%),
    linear-gradient(-45deg, #f3f4f6 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #f3f4f6 75%),
    linear-gradient(-45deg, transparent 75%, #f3f4f6 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
  background-color: #f8fafc;
}

.meta {
  padding: 0.8rem;
}

.meta h4 {
  font-size: 0.95rem;
  color: #111827;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.meta .author {
  font-size: 0.8rem;
  color: #64748b;
  margin-bottom: 6px;
}

.rating.small {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.rating.small .stars {
  font-size: 0.9rem;
}

.rating.small .score {
  font-size: 0.85rem;
  color: #475569;
}
</style>