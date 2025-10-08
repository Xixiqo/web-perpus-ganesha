<template>
  <nav class="navbar">
    <div class="nav-container">
      <!-- Brand -->
      <div class="nav-brand">
        
        <h2>Ganesha</h2>
      </div>

      <!-- Tombol menu mobile -->
      <button class="menu-btn" @click="toggleMenu">
        <span class="bar" />
        <span class="bar" />
        <span class="bar" />
      </button>

      <!-- Link navigasi -->
      <div :class="['nav-links', { active: menuOpen }]">
        <RouterLink to="/" class="nav-link" @click="closeMenu">Beranda</RouterLink>
        <RouterLink to="/informasi" class="nav-link" @click="closeMenu">Informasi</RouterLink>
        <RouterLink to="/cari" class="nav-link" @click="closeMenu">Pencarian</RouterLink>
        <RouterLink to="/pinjam" class="nav-link" @click="closeMenu">Peminjaman</RouterLink>
        <RouterLink to="/artikel" class="nav-link" @click="closeMenu">Artikel</RouterLink>
      </div>

      <!-- User -->
    <RouterLink to="/login">
      <div class="nav-right">
        <div class="user-chip">
          <img
            class="avatar"
            src="https://i.pinimg.com/736x/05/11/45/051145a8e366876f859378154aa7df8b.jpg"
            alt="avatar"
          />
          <span>Login!</span>
        </div>
      </div>
    </RouterLink>

    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'

const menuOpen = ref(false)
const toggleMenu = () => (menuOpen.value = !menuOpen.value)
const closeMenu = () => (menuOpen.value = false)
</script>

<style scoped>
/* --- Struktur utama --- */
.navbar {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
}

.nav-brand h2 {
  color: #667eea;
  font-weight: 700;
  font-size: 1.5rem;
}

/* --- Link utama --- */
.nav-links {
  display: flex;
  gap: 1rem;
  transition: all 0.3s ease;
}

.nav-link {
  text-decoration: none;
  color: #444;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.nav-link:hover,
.nav-link.router-link-exact-active {
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
  transform: translateY(-2px);
}

/* --- User chip --- */
.user-chip {
  background: #f3f4f6;
  border-radius: 20px;
  padding: 4px 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #374151;
  font-weight: 600;
}

.user-chip .avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
}

/* --- Tombol menu (hamburger) --- */
.menu-btn {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 24px;
  height: 18px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.menu-btn .bar {
  height: 3px;
  width: 100%;
  background: #374151;
  border-radius: 10px;
}

/* --- Responsif untuk layar kecil --- */
@media (max-width: 768px) {
  .menu-btn {
    display: flex;
  }

  .nav-links {
    position: absolute;
    top: 70px;
    left: 0;
    width: 100%;
    flex-direction: column;
    background: #ffffff;
    border-top: 1px solid rgba(0, 0, 0, 0.05);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.05);
    max-height: 0;
    overflow: hidden;
    opacity: 0;
  }

  .nav-links.active {
    max-height: 300px;
    opacity: 1;
    padding: 1rem 0;
  }

  .nav-link {
    display: block;
    padding: 1rem;
    text-align: center;
    width: 100%;
  }

  .nav-right {
    display: none; /* Sembunyikan chip di mobile */
  }
}
</style>
