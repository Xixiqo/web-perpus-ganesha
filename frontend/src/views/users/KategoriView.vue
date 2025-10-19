<template>
  <div class="kategori-page">
    <h1>Kategori Buku</h1>
    <div class="kategori-grid">
      <CategoryCard 
        v-for="category in categories" 
        :key="category.id"
        :category="category"
        @click="handleCategoryClick"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import CategoryCard from '@/components/users/CategoryCard.vue';

const router = useRouter();
const categories = ref([]);

// Dynamic API Base URL
const apiBaseUrl = import.meta.env.VITE_API_BASE || process.env.VUE_APP_API_BASE_URL || 'http://localhost:5000';

const fetchCategories = async () => {
  try {
    const response = await fetch(`${apiBaseUrl}/api/search/categories`);
    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        categories.value = data.data;
      }
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
};

const handleCategoryClick = (category) => {
  router.push(`/cari?kategori=${encodeURIComponent(category.name)}`);
};

onMounted(() => {
  fetchCategories();
});
</script>

<style scoped>
.categories-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  padding: 1rem;
}
</style>

<style scoped>
.kategori-page {
  padding: 2rem;
}

.kategori-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
  padding: 1rem;
}

@media (max-width: 768px) {
  .kategori-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }
}
</style>