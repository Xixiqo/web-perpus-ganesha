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
          src="@/../public/logo.png" 
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
          <DyslexiaToggle />
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
            <button class="dropdown-item logout" @click="openLogoutModal">
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

  <!-- Logout Confirmation Modal -->
  <Teleport to="body">
    <div v-if="showLogoutModal" class="modal-overlay" @click="closeLogoutModal">
      <div class="modal-content" @click.stop>
        <h2 class="modal-title">Logout Confirmation</h2>
        <p class="modal-message">Apakah Anda yakin ingin keluar?</p>
        
        <div class="modal-buttons">
          <button 
            class="btn-confirm" 
            @click="confirmLogout"
            :disabled="isLoggingOut"
          >
            {{ isLoggingOut ? 'Loading...' : 'Logout' }}
          </button>
          <button 
            class="btn-cancel" 
            @click="closeLogoutModal"
            :disabled="isLoggingOut"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import DyslexiaToggle from '@/components/DyslexiaToggle.vue'

const router = useRouter()
const menuOpen = ref(false)
const userMenuOpen = ref(false)
const isLoggedIn = ref(false)
const user = ref(null)
const showLogoutModal = ref(false)
const isLoggingOut = ref(false)

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

const openLogoutModal = () => {
  showLogoutModal.value = true
  closeUserMenu()
}

const closeLogoutModal = () => {
  showLogoutModal.value = false
}

const confirmLogout = async () => {
  isLoggingOut.value = true
  
  try {
    // Simulasi delay untuk logout process (bisa diganti dengan API call)
    await new Promise(resolve => setTimeout(resolve, 500))
    
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    isLoggedIn.value = false
    user.value = null
    userMenuOpen.value = false
    showLogoutModal.value = false
    
    router.push('/')
  } catch (error) {
    console.error('Error during logout:', error)
  } finally {
    isLoggingOut.value = false
  }
}
</script>

<style scoped>
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
  margin: 0 32px;
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
  background-color: var(--primary);
  transition: width 0.3s ease, opacity 0.3s ease;
  opacity: 0;
}

/* Saat hover */
.nav-link:hover {
  color: var(--primary);
}

.nav-link:hover::after {
  width: 100%;
  opacity: 1;
}

/* Saat router-link aktif */
.nav-link.router-link-exact-active {
  color: var(--primary);
}

.nav-link.router-link-exact-active::after {
  width: 100%;
  opacity: 1;
}


.nav-right {
  display: flex;
  align-items: center;
  gap: 16px; /* kasih jarak antar elemen */
}

/* Tombol toggle disleksia */
.nav-right .toggle-btn {
  background-color: #2C64E3;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 13px;
  cursor: pointer;
  transition: 0.3s;
  align-self: center;
}

.nav-right .toggle-btn:hover {
  background-color: #1e40af;
}

/* biar tombol sejajar dengan user chip/login button */
.user-menu,
.btn-login {
  display: flex;
  align-items: center;
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
  width: 250px;
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
  color: var(--primary);
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
  order: -1;
}

.menu-btn .bar {
  height: 3px;
  width: 100%;
  background: #374151;
  border-radius: 10px;
  transition: all 0.3s ease;
}

/* --- Modal Logout --- */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 32px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.15);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #131313;
  margin: 0 0 8px 0;
}

.modal-message {
  color: #6b7280;
  font-size: 0.95rem;
  margin: 0 0 24px 0;
}

.modal-buttons {
  display: flex;
  gap: 12px;
}

.btn-confirm,
.btn-cancel {
  flex: 1;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  border: 2px solid;
  transition: all 0.3s ease;
}

.btn-confirm {
  background: #ef4444;
  color: white;
  border-color: #ef4444;
}

.btn-confirm:hover:not(:disabled) {
  background: #dc2626;
  border-color: #dc2626;
  box-shadow: 0 6px 16px rgba(235, 37, 37, 0.4);
}

.btn-confirm:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-cancel {
  background: white;
  color: #2C64E3;
  border-color: #2C64E3;
}

.btn-cancel:hover:not(:disabled) {
  background: #eff6ff;
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.4);
}

.btn-cancel:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* --- Responsif --- */
@media (max-width: 768px) {
  .menu-btn {
    display: flex;
  }
  
  .nav-container {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 1rem;
  }
  
  .menu-btn {
    order: 1;
  }
  
  .nav-brand {
    order: 2;
    justify-self: center;
  }
  
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

  .modal-content {
    padding: 24px;
  }

  .modal-title {
    font-size: 1rem;
  }

  .modal-message {
    font-size: 0.875rem;
  }
}
</style>