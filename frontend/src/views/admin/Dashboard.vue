<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">📊 Statistik Buku</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard title="Total Koleksi" value="1.245" icon="📚" />
      <StatCard title="Total Eksemplar" value="3.478" icon="📖" />
      <StatCard title="Dipinjamkan" value="238" icon="📦" />
      <StatCard title="Tersedia" value="3.240" icon="✅" />
    </div>
  </div>
</template>

<script setup>
import StatCard from '@/components/admin/StatCard.vue'
</script>