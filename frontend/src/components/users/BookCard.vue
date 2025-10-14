<template>
  <div class="book-card" @click="handleClick">
    <!-- Thumbnail -->
    <div 
      class="thumb" 
      :class="{ 'placeholder': !book.cover }"
      :style="book.cover ? `background-image: url(/covers/${book.cover})` : ''"
    ></div>
    
    <!-- Meta Info -->
    <div class="meta">
      <h4>{{ book.judul || `Judul Buku ${index}` }}</h4>
      <p class="author">{{ book.kategori || 'Kategori' }} • {{ book.pembuat || 'Penulis' }}</p>
      <div class="info">
        <span class="publisher">{{ book.penerbit || 'Penerbit' }}</span>
        <span class="year">{{ book.tahun_rilis || '2024' }}</span>
      </div>
      <div class="stock" :class="getStockClass(book.stok)">
        <span class="stock-icon">📚</span>
        <span>{{ book.stok ? `${book.stok} tersedia` : 'Tersedia' }}</span>
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

const getStockClass = (stok) => {
  if (!stok) return ''
  if (stok >= 10) return 'stock-high'
  if (stok >= 5) return 'stock-medium'
  return 'stock-low'
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
  height: 200px;
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
  padding: 0.9rem;
}

.meta h4 {
  font-size: 1rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.meta .author {
  font-size: 0.8rem;
  color: #64748b;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f1f5f9;
}

.publisher {
  font-size: 0.75rem;
  color: #94a3b8;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.year {
  font-size: 0.75rem;
  color: #3b82f6;
  font-weight: 600;
  padding: 2px 8px;
  background: #eff6ff;
  border-radius: 6px;
  margin-left: 8px;
}

.stock {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 6px 10px;
  border-radius: 8px;
  background: #f1f5f9;
  color: #64748b;
}

.stock-icon {
  font-size: 1rem;
}

.stock-high {
  background: #d1fae5;
  color: #065f46;
}

.stock-medium {
  background: #fef3c7;
  color: #92400e;
}

.stock-low {
  background: #fee2e2;
  color: #991b1b;
}
</style>