<template>
  <div class="book-card" @click="handleClick">
    <!-- Thumbnail/Cover -->
    <div class="cover-wrapper">
      <img 
        v-if="book.cover" 
        :src="`/covers/${book.cover}`" 
        :alt="book.judul"
        class="cover-image"
        @error="handleImageError"
      >
      <div v-else class="cover-placeholder">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
        </svg>
      </div>
    </div>
    
    <!-- Book Info -->
    <div class="book-info">
      <!-- Judul Buku -->
      <h3 class="book-title">{{ book.judul || 'Judul Buku' }}</h3>
      
      <!-- Kategori & Penulis -->
      <p class="book-meta">
        {{ book.kategori || 'Kategori' }} • {{ book.pembuat || 'Penulis' }}
      </p>

      <!-- Status Stok -->
      <div class="stock-status" :class="stockStatusClass">
        <span class="stock-icon">📚</span>
        <span class="stock-text">{{ stockText }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue'

const props = defineProps({
  book: {
    type: Object,
    required: true,
    default: () => ({})
  },
  index: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['click', 'book-selected'])

const handleClick = () => {
  emit('click', props.book)
  emit('book-selected', props.book)
}

const handleImageError = (e) => {
  e.target.style.display = 'none'
}

// Computed untuk status stok
const stockStatusClass = computed(() => {
  const stok = props.book.stok || 0
  
  if (stok === 0) return 'stock-unavailable'
  if (stok >= 10) return 'stock-available'
  if (stok >= 5) return 'stock-limited'
  return 'stock-low'
})

const stockText = computed(() => {
  const stok = props.book.stok || 0
  
  if (stok === 0) return 'Tidak Tersedia'
  if (stok === 1) return '1 Tersedia'
  return `${stok} Tersedia`
})
</script>

<style scoped>
.book-card {
  background: #ffffff;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.book-card:hover {
  transform: translateY(-6px);
  border-color: #3b82f6;
  box-shadow: 0 12px 28px rgba(59, 130, 246, 0.25);
}

/* Cover Image */
.cover-wrapper {
  position: relative;
  width: 100%;
  height: 250px;
  background: linear-gradient(135deg, #f0f4ff 0%, #e8ecff 100%);
  overflow: hidden;
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.book-card:hover .cover-image {
  transform: scale(1.05);
}

.cover-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
}

.cover-placeholder svg {
  color: #9ca3af;
  opacity: 0.5;
}

/* Book Info */
.book-info {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.book-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 2.8em;
}

.book-meta {
  font-size: 0.85rem;
  color: #6b7280;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.publisher {
  font-size: 0.8rem;
  color: #9ca3af;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.year {
  font-size: 0.8rem;
  font-weight: 600;
  color: #3b82f6;
  padding: 4px 10px;
  background: #eff6ff;
  border-radius: 6px;
  flex-shrink: 0;
}

/* Stock Status */
.stock-status {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-top: auto;
}

.stock-icon {
  font-size: 1rem;
}

.stock-text {
  flex: 1;
}

/* Stock Status Colors */
.stock-available {
  background: #d1fae5;
  color: #065f46;
  border: 1px solid #a7f3d0;
}

.stock-limited {
  background: #fef3c7;
  color: #92400e;
  border: 1px solid #fde68a;
}

.stock-low {
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

.stock-unavailable {
  background: #f3f4f6;
  color: #6b7280;
  border: 1px solid #e5e7eb;
}

/* Responsive */
@media (max-width: 768px) {
  .cover-wrapper {
    height: 200px;
  }

  .book-title {
    font-size: 0.95rem;
  }

  .book-meta {
    font-size: 0.8rem;
  }

  .book-info {
    padding: 14px;
  }
}

@media (max-width: 480px) {
  .cover-wrapper {
    height: 180px;
  }

  .book-title {
    font-size: 0.9rem;
    -webkit-line-clamp: 2;
    line-clamp: 2;
  }

  .book-meta {
    font-size: 0.75rem;
  }

  .publisher,
  .year {
    font-size: 0.75rem;
  }

  .stock-status {
    font-size: 0.8rem;
    padding: 6px 10px;
  }

  .book-info {
    padding: 12px;
    gap: 6px;
  }
}
</style>