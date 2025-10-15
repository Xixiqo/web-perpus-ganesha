<template>
  <div class="article-list-item">
    <!-- Thumbnail -->
    <div class="article-thumb">
      <img 
        :src="article.image" 
        :alt="article.title"
      />
    </div>
    
    <!-- Content -->
    <div class="article-info">
      <h4>{{ article.title }}</h4>
      <div class="article-meta">
        <i class="fa-regular fa-calendar"></i>
        <span>{{ formattedDate }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  article: {
    type: Object,
    required: true
  }
})

const formattedDate = computed(() => {
  const d = new Date(props.article.date)
  if (isNaN(d)) return props.article.date
  return d.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
})
</script>

<style scoped>
.article-list-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  border-bottom: 1px solid #e5e5e5;
  border-radius: 8px;
  transition: background-color 0.25s ease;
  transition: scale 200ms ease;
  cursor: pointer;
}

.article-list-item:hover {
  background-color: #f6f6f6;
  scale: 1.05 ;
}

.article-thumb {
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
}

.article-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.article-list-item:hover img {
  transform: scale(1.08);
}

.article-info {
  flex: 1;
  min-width: 0;
}

.article-info h4 {
  font-size: 0.95rem;
  font-weight: 600;
  color: #222;
  margin-bottom: 6px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: color 0.2s ease;
}

.article-list-item:hover h4 {
  color: var(--primary);
}

.article-meta {
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  color: #777;
  gap: 5px;
}

.article-meta i {
  font-size: 0.85rem;
  color: #9ca3af;
}
</style>