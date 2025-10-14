<template>
  <div class="cursor"></div>
  <div id="app">
    <!-- Navbar hanya muncul jika BUKAN di halaman login -->
    <Navbar v-if="!isLoginPage" />
    
    <main class="main-content">
      <RouterView />
    </main>
    
    <!-- Footer hanya muncul jika BUKAN di halaman login -->
    <Footer v-if="!isLoginPage" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from './components/users/Navbar.vue'
import Footer from './components/users/Footer.vue'

const route = useRoute()

// Computed property untuk cek apakah di halaman login
const isLoginPage = computed(() => {
  return route.path === '/login'
})

document.addEventListener("DOMContentLoaded", () => {
  const cursor = document.querySelector(".cursor");
  let mouseX = 0, mouseY = 0;
  let currentX = 0, currentY = 0;

  // update posisi mouse
  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Animasi smooth mengikuti kursor (lerp)
  function animate() {
    currentX += (mouseX - currentX) * 0.15; // semakin kecil -> semakin lambat
    currentY += (mouseY - currentY) * 0.15;

    // Posisikan tepat di tengah pointer
    cursor.style.left = currentX + "px";
    cursor.style.top = currentY + "px";

    requestAnimationFrame(animate);
  }

  animate();

  // Efek hover di elemen interaktif
  document.querySelectorAll("a, button, .nav-link, input, textarea").forEach((el) => {
    el.addEventListener("mouseenter", () => cursor.classList.add("hover"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("hover"));
  });
});
</script>

<style>
/* === Custom Cursor Glow === */
.cursor {
  position: fixed;
  top: 0;
  left: 0;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(102,126,234,0.45) 0%, rgba(102,126,234,0.05) 70%, transparent 100%);
  filter: blur(12px);
  pointer-events: none;
  transform: translate(-50%, -50%); /* agar glow tepat di tengah pointer */
  z-index: 9999;
  transition: width 0.2s ease, height 0.2s ease, background 0.3s ease, filter 0.3s ease;
}

/* Saat hover elemen interaktif */
.cursor.hover {
  width: 40px;
  height: 40px;
  background: radial-gradient(circle, rgba(102,126,234,0.6) 0%, rgba(102,126,234,0.15) 70%, transparent 100%);
  filter: blur(15px);
}

/* Struktur dasar layout */
body {
  font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
  background: #f7f9fc;
  min-height: 100vh;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  min-height: calc(100vh - 140px); /* Navbar + Footer */
}

/* Paksa hapus semua garis dari navbar */
nav, .navbar {
  box-shadow: none !important;
  border: none !important;
  border-bottom: none !important;
  border-top: none !important;
}

nav::before, nav::after,
.navbar::before, .navbar::after {
  display: none !important;
  content: none !important;
}
</style>