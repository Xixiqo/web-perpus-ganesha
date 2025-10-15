<template>
  <div class="article-card">
    <!-- Image -->
    <div class="article-image">
      <img :src="article.image" :alt="article.title" />
      <div class="article-category"><span>{{ article.category }}</span></div>
      <div class="article-overlay"></div>
    </div>

    <!-- Content -->
    <div class="article-content">
      <h3>{{ article.title }}</h3>
      <p>{{ article.excerpt }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  article: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.article-card {
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  transition: all 0.3s ease;
  cursor: pointer;
}

.article-card:hover {
  box-shadow: 0 8px 24px rgba(0,0,0,0.25);
  transform: translateY(-3px);
}

.article-image {
  position: relative;
  height: 400px;
  overflow: hidden;
}

.article-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.article-card:hover img {
  transform: scale(1.1);
}

.article-category {
  position: absolute;
  top: 1rem;
  left: 1rem;
}

.article-category span {
  background: white;
  color: #333;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 500;
}

.article-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.3), transparent);
  opacity: 1;
  transition: opacity 0.3s ease;
}

/* --- FIX AREA --- */
.article-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.5rem;
  color: white;
  transition: transform 0.4s ease;
  
  /* Default: sedikit turun */
  transform: translateY(25%);
}

.article-card:hover .article-content {
  transform: translateY(0);
}

.article-content h3 {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.4rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: transform 0.4s ease;
}

.article-content p {
  font-size: 0.9rem;
  color: #ddd;
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.4s ease, transform 0.4s ease;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-card:hover .article-content p {
  opacity: 1;
  transform: translateY(0);
}
</style>
