<template>
  <div class="riwayat-page">
    <h1>Riwayat Peminjaman</h1>
    <div class="riwayat-content">
      <div v-if="loading" class="loading">
        Loading...
      </div>
      <div v-else-if="pinjaman.length === 0" class="no-data">
        Belum ada riwayat peminjaman
      </div>
      <div v-else class="pinjaman-list">
        <BorrowCard 
          v-for="pinjam in pinjaman" 
          :key="pinjam.id"
          :pinjam="pinjam"
          @click="showDetail(pinjam)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import BorrowCard from '@/components/users/BorrowCard.vue';

const pinjaman = ref([]);
const loading = ref(true);

const fetchRiwayat = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5000/api/profile/pinjaman', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        pinjaman.value = data.data;
      }
    }
  } catch (error) {
    console.error('Error fetching riwayat:', error);
  } finally {
    loading.value = false;
  }
};

const showDetail = (pinjam) => {
  // Implementasi tampilan detail peminjaman
  console.log('Show detail for:', pinjam);
};

onMounted(() => {
  fetchRiwayat();
});
</script>

<style scoped>
.riwayat-page {
  padding: 2rem;
}

.riwayat-content {
  max-width: 800px;
  margin: 0 auto;
}

.loading,
.no-data {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.pinjaman-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>