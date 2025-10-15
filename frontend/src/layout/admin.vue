<template>
  <div class="admin-layout">
    <aside class="sidebar">
      <ul>
        <li><router-link to="/admin">Dashboard</router-link></li>
        <li><router-link to="/admin/tambah-buku">Tambah Buku</router-link></li>
        <li><router-link to="/admin/hapus-buku">Hapus Buku</router-link></li>
      </ul>
    </aside>

    <main class="content">
      <router-view /> <!-- 👈 isi halaman admin tampil di sini -->
    </main>
  </div>
</template>

<script setup> 
import Sidebar from '@/components/admin/sidebar.vue'
</script>


<style scoped>
.admin-layout {
  display: flex;
}
.sidebar {
  width: 250px;
  background: #2c3e50;
  color: white;
  height: 100vh;
  padding: 1rem;
}
.content {
  flex: 1;
  padding: 1rem;
}
</style>