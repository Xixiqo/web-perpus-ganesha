<template>
  <nav class="navbar">
    <div class="nav-container">
      <!-- Tombol menu mobile (pindah ke kiri) -->
      <button class="menu-btn" @click="toggleMenu">
        <span class="bar" />
        <span class="bar" />
        <span class="bar" />
      </button>
      
      <!-- Brand dengan Logo (pindah ke tengah di mobile) -->
      <div class="nav-brand">
        <img 
          src="/logo.png" 
          alt="Logo Ganesha" 
          class="logo-img"
        />
        <h2>Ganesha Stembayo</h2>
      </div>
      
      <!-- Link navigasi -->
      <div :class="['nav-links', { active: menuOpen }]">
        <RouterLink to="/" class="nav-link" @click="closeMenu">Beranda</RouterLink>
        <RouterLink to="/informasi" class="nav-link" @click="closeMenu">Informasi</RouterLink>
        <RouterLink to="/cari" class="nav-link" @click="closeMenu">Pencarian</RouterLink>
        <RouterLink to="/article" class="nav-link" @click="closeMenu">Artikel</RouterLink>
      </div>
      
      <!-- User Section -->
      <div class="nav-right">
        <!-- Jika belum login -->
        <RouterLink v-if="!isLoggedIn" to="/login" class="user-chip-link">
          <div class="btn-login">
            <span>Login</span>
          </div>
        </RouterLink>
        
        <!-- Jika sudah login -->
        <div v-else class="user-menu">
          <div class="user-chip logged-in" @click="toggleUserMenu">
            <img
              class="avatar"
              :src="user?.avatar || 'https://i.pinimg.com/736x/05/11/45/051145a8e366876f859378154aa7df8b.jpg'"
              :alt="user?.name || 'User'"
            />
            <span>{{ user?.name || 'User' }}</span>
            <svg 
              class="dropdown-icon" 
              :class="{ open: userMenuOpen }"
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              stroke-width="2" 
              stroke-linecap="round" 
              stroke-linejoin="round"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
          
          <!-- Dropdown Menu -->
          <div v-if="userMenuOpen" class="dropdown-menu">
            <RouterLink to="/profil" class="dropdown-item" @click="closeUserMenu">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              Profil Saya
            </RouterLink>
            <RouterLink to="/riwayat" class="dropdown-item" @click="closeUserMenu">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 3h18v18H3zM21 9H3M21 15H3M12 3v18"></path>
              </svg>
              Riwayat Peminjaman
            </RouterLink>
            <div class="dropdown-divider"></div>
            <button class="dropdown-item logout" @click="handleLogout">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Keluar
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const menuOpen = ref(false)
const userMenuOpen = ref(false)
const isLoggedIn = ref(false)
const user = ref(null)

onMounted(() => {
  checkLoginStatus()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const checkLoginStatus = () => {
  const token = localStorage.getItem('token')
  const userData = localStorage.getItem('user')
  
  if (token && userData) {
    try {
      isLoggedIn.value = true
      user.value = JSON.parse(userData)
    } catch (error) {
      console.error('Error parsing user data:', error)
      isLoggedIn.value = false
      user.value = null
    }
  } else {
    isLoggedIn.value = false
    user.value = null
  }
}

const toggleMenu = () => (menuOpen.value = !menuOpen.value)
const closeMenu = () => (menuOpen.value = false)
const toggleUserMenu = (e) => {
  e.stopPropagation()
  userMenuOpen.value = !userMenuOpen.value
}
const closeUserMenu = () => (userMenuOpen.value = false)
const handleClickOutside = (e) => {
  const menu = document.querySelector('.user-menu')
  if (menu && !menu.contains(e.target)) userMenuOpen.value = false
}
const handleLogout = async () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  isLoggedIn.value = false
  user.value = null
  userMenuOpen.value = false
  router.push('/')
}
</script>

<style scoped>
/* NAVBAR PUTIH POLOS - TANPA SHADOW/BORDER APAPUN */
.navbar {
  background: #ffffff;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: none;
  border: none;
  border-bottom: none;
  border-top: none;
}

.navbar::before,
.navbar::after {
  display: none !important;
  content: none !important;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
  border: none;
}

/* Logo dan Brand */
.nav-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-img {
  width: 45px;
  height: 45px;
  object-fit: contain;
}

.nav-brand h2 {
  color: #131313;
  font-weight: 700;
  font-size: 1rem;
  margin: 0;
}

/* --- Link utama --- */
.nav-links {
  display: flex;
  gap: 1rem;
  transition: all 0.3s ease;
  border: none;
  box-shadow: none;
}

.nav-link {
  position: relative;
  text-decoration: none;
  color: #444;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 0;
  transition: color 0.3s ease;
}

/* Garis bawah animasi */
.nav-link::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0%;
  height: 2px;
  background-color: #667eea;
  transition: width 0.3s ease, opacity 0.3s ease;
  opacity: 0;
}

/* Saat hover */
.nav-link:hover {
  color: #667eea;
}

.nav-link:hover::after {
  width: 100%;
  opacity: 1;
}

/* Saat router-link aktif */
.nav-link.router-link-exact-active {
  color: #667eea;
}

.nav-link.router-link-exact-active::after {
  width: 100%;
  opacity: 1;
}

/* --- User chip --- */
.user-chip-link {
  text-decoration: none;
}

.user-chip {
  background: #f3f4f6;
  border-radius: 20px;
  padding: 6px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #374151;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.user-chip:hover {
  background: #e5e7eb;
  transform: translateY(-2px);
}

.btn-login {
  background: #2C64E3;
  border-radius: 20px;
  padding: 8px 32px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fafafa;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-login span {
  font-weight: 600;
}

.btn-login:hover {
  background: #1e40af;
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.4);
  scale: 1.02;
}

.user-chip.logged-in {
  color: #131313;
}

.user-chip .avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid white;
  object-fit: cover;
}

.dropdown-icon {
  transition: transform 0.3s ease;
}

.dropdown-icon.open {
  transform: rotate(180deg);
}

/* --- User Menu Dropdown --- */
.user-menu {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  width: 5000px;
  padding: 8px;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: #374151;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.2s ease;
  font-weight: 500;
  cursor: pointer;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
}

.dropdown-item:hover {
  background: #f3f4f6;
  color: #667eea;
}

.dropdown-item.logout {
  color: #ef4444;
}

.dropdown-item.logout:hover {
  background: #fee2e2;
  color: #dc2626;
}

.dropdown-divider {
  height: 1px;
  background: #e5e7eb;
  margin: 8px 0;
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
  order: -1; /* Pindah ke paling kiri */
}

.menu-btn .bar {
  height: 3px;
  width: 100%;
  background: #374151;
  border-radius: 10px;
  transition: all 0.3s ease;
}

/* --- Responsif --- */
@media (max-width: 768px) {
  .menu-btn {
    display: flex;
  }
  
  /* Container mobile: hamburger - logo - profile */
  .nav-container {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 1rem;
  }
  
  /* Hamburger di kiri */
  .menu-btn {
    order: 1;
  }
  
  /* Logo di tengah */
  .nav-brand {
    order: 2;
    justify-self: center;
  }
  
  /* Profile di kanan */
  .nav-right {
    order: 3;
    justify-self: end;
  }
  
  .nav-links {
    position: absolute;
    top: 70px;
    left: 0;
    width: 100%;
    flex-direction: column;
    background: #ffffff;
    border: none;
    border-top: none;
    box-shadow: none;
    max-height: 0;
    overflow: hidden;
    opacity: 0;
    order: 4;
    grid-column: 1 / -1;
  }
  
  .nav-links.active {
    max-height: 400px;
    opacity: 1;
    padding: 1rem 0;
  }
  
  .nav-link {
    display: block;
    padding: 1rem;
    text-align: center;
    width: 100%;
  }
}

@media (max-width: 480px) {
  .user-chip span {
    display: none;
  }
  
  .user-chip {
    padding: 6px;
  }
  
  .dropdown-icon {
    display: none;
  }
  
  .dropdown-menu {
    width: 280px;
  }
  
  .logo-img {
    width: 40px;
    height: 40px;
  }
  
  .nav-brand h2 {
    font-size: 1.25rem;
  }
}
</style>