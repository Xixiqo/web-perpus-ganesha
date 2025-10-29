<template>
  <nav class="bg-white sticky top-0 z-[1000] shadow-md">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-24 lg:h-[70px]">
        <!-- Mobile Menu Button -->
        <button 
          @click="toggleMenu"
          class="lg:hidden flex flex-col justify-between w-6 h-[18px] p-0 border-0 bg-transparent cursor-pointer"
          aria-label="Toggle menu"
        >
          <span class="h-0.5 w-full bg-gray-700 rounded-full transition-all duration-300" />
          <span class="h-0.5 w-full bg-gray-700 rounded-full transition-all duration-300" />
          <span class="h-0.5 w-full bg-gray-700 rounded-full transition-all duration-300" />
        </button>
        
        <!-- Brand Logo -->
        <RouterLink to="/" class="flex items-center gap-2 sm:gap-3">
          <img 
            src="@/../public/logo.png" 
            alt="Logo Ganesha" 
            class="w-9 h-9 sm:w-10 sm:h-10 lg:w-[45px] lg:h-[45px] object-contain"
          />
          <h2 class="text-gray-900 font-bold text-sm sm:text-base lg:text-lg m-0 whitespace-nowrap">
            Ganesha Stembayo
          </h2>
        </RouterLink>
        
        <!-- Desktop Navigation Links -->
        <div class="hidden lg:flex items-center gap-4">
          <RouterLink 
            to="/" 
            class="relative text-gray-600 font-medium px-4 py-2 transition-colors duration-300 hover:text-blue-600 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-600 after:transition-all after:duration-300 after:opacity-0 hover:after:w-full hover:after:opacity-100 router-link-exact-active:text-blue-600 router-link-exact-active:after:w-full router-link-exact-active:after:opacity-100"
            @click="closeMenu"
          >
            Beranda
          </RouterLink>
          <RouterLink 
            to="/informasi" 
            class="relative text-gray-600 font-medium px-4 py-2 transition-colors duration-300 hover:text-blue-600 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-600 after:transition-all after:duration-300 after:opacity-0 hover:after:w-full hover:after:opacity-100 router-link-exact-active:text-blue-600 router-link-exact-active:after:w-full router-link-exact-active:after:opacity-100"
            @click="closeMenu"
          >
            Informasi
          </RouterLink>
          <RouterLink 
            to="/cari" 
            class="relative text-gray-600 font-medium px-4 py-2 transition-colors duration-300 hover:text-blue-600 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-600 after:transition-all after:duration-300 after:opacity-0 hover:after:w-full hover:after:opacity-100 router-link-exact-active:text-blue-600 router-link-exact-active:after:w-full router-link-exact-active:after:opacity-100"
            @click="closeMenu"
          >
            Pencarian
          </RouterLink>
          <RouterLink 
            to="/article" 
            class="relative text-gray-600 font-medium px-4 py-2 transition-colors duration-300 hover:text-blue-600 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-600 after:transition-all after:duration-300 after:opacity-0 hover:after:w-full hover:after:opacity-100 router-link-exact-active:text-blue-600 router-link-exact-active:after:w-full router-link-exact-active:after:opacity-100"
            @click="closeMenu"
          >
            Artikel
          </RouterLink>
        </div>
        
        <!-- Right Section: Dyslexia Toggle & User Menu -->
        <div class="flex items-center gap-2 sm:gap-3">
          <!-- Dyslexia Toggle - Hidden on small mobile, visible on sm+ -->
          <div class="hidden sm:block">
            <DyslexiaToggle />
          </div>
          
          <!-- Login Button (Not Logged In) -->
          <RouterLink 
            v-if="!isLoggedIn" 
            to="/login" 
            class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 sm:px-6 py-2 rounded-full transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 text-sm"
          >
            Login
          </RouterLink>
          
          <!-- User Menu (Logged In) -->
          <div v-else class="relative">
            <button
              @click="toggleUserMenu"
              class="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 rounded-full px-2 sm:px-3 py-1.5 transition-all duration-300 hover:-translate-y-0.5"
            >
              <img
                :src="getAvatarUrl()"
                :alt="getUserName()"
                @error="handleAvatarError"
                class="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 border-white object-cover"
              />
              <span class="hidden sm:inline text-gray-900 font-semibold text-sm max-w-[100px] lg:max-w-[150px] truncate">
                {{ getUserName() }}
              </span>
              <svg 
                class="hidden sm:block w-4 h-4 transition-transform duration-300 flex-shrink-0"
                :class="{ 'rotate-180': userMenuOpen }"
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                stroke-width="2" 
                stroke-linecap="round" 
                stroke-linejoin="round"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            
            <!-- Dropdown Menu -->
            <Transition
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="opacity-0 -translate-y-2"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition duration-150 ease-in"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 -translate-y-2"
            >
              <div 
                v-if="userMenuOpen" 
                class="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl p-2 z-50"
              >
                <RouterLink 
                  to="/profil" 
                  class="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-blue-600 rounded-lg transition-all duration-200 font-medium"
                  @click="closeUserMenu"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  Profil Saya
                </RouterLink>
                
                <!-- Role-based Menu Item -->
                <RouterLink
                  v-if="getUserRole() === 'siswa'"
                  to="/riwayat"
                  class="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-blue-600 rounded-lg transition-all duration-200 font-medium"
                  @click="closeUserMenu"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 3h18v18H3zM21 9H3M21 15H3M12 3v18"></path>
                  </svg>
                  Riwayat Peminjaman
                </RouterLink>

                <RouterLink
                  v-else-if="getUserRole() === 'pustakawan'"
                  to="/admin"
                  class="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-blue-600 rounded-lg transition-all duration-200 font-medium"
                  @click="closeUserMenu"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 12h18M3 6h18M3 18h18"></path>
                  </svg>
                  Admin Panel
                </RouterLink>
                
                <!-- Dyslexia Toggle in Dropdown - Only on small mobile -->
                <div class="sm:hidden px-4 py-3">
                  <DyslexiaToggle />
                </div>
                
                <div class="h-px bg-gray-200 my-2"></div>
                
                <button 
                  @click="openLogoutModal"
                  class="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 font-medium w-full text-left"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  Keluar
                </button>
              </div>
            </Transition>
          </div>
        </div>
      </div>
      
      <!-- Mobile Navigation Links -->
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="max-h-0 opacity-0"
        enter-to-class="max-h-96 opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="max-h-96 opacity-100"
        leave-to-class="max-h-0 opacity-0"
      >
        <div 
          v-if="menuOpen" 
          class="lg:hidden overflow-hidden bg-white border-t border-gray-200"
        >
          <div class="py-4 space-y-1">
            <RouterLink 
              to="/" 
              class="block px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-blue-600 font-medium transition-colors duration-200"
              @click="closeMenu"
            >
              Beranda
            </RouterLink>
            <RouterLink 
              to="/informasi" 
              class="block px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-blue-600 font-medium transition-colors duration-200"
              @click="closeMenu"
            >
              Informasi
            </RouterLink>
            <RouterLink 
              to="/cari" 
              class="block px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-blue-600 font-medium transition-colors duration-200"
              @click="closeMenu"
            >
              Pencarian
            </RouterLink>
            <RouterLink 
              to="/article" 
              class="block px-4 py-3 text-gray-700 hover:bg-gray-100 hover:text-blue-600 font-medium transition-colors duration-200"
              @click="closeMenu"
            >
              Artikel
            </RouterLink>
            
            <!-- Dyslexia Toggle in Mobile Menu - Only on small mobile -->
            <div class="sm:hidden px-4 py-3">
              <DyslexiaToggle />
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </nav>

  <!-- Logout Confirmation Modal -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="showLogoutModal" 
        @click="closeLogoutModal"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-[2000] px-4"
      >
        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 translate-y-4"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 translate-y-4"
        >
          <div 
            v-if="showLogoutModal"
            @click.stop
            class="bg-white rounded-xl p-6 sm:p-8 max-w-md w-full shadow-2xl"
          >
            <h2 class="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
              Logout Confirmation
            </h2>
            <p class="text-gray-600 text-sm sm:text-base mb-6">
              Apakah Anda yakin ingin keluar?
            </p>
            
            <div class="flex flex-col sm:flex-row gap-3">
              <button 
                @click="confirmLogout"
                :disabled="isLoggingOut"
                class="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 hover:shadow-lg"
              >
                {{ isLoggingOut ? 'Loading...' : 'Logout' }}
              </button>
              <button 
                @click="closeLogoutModal"
                :disabled="isLoggingOut"
                class="flex-1 bg-white hover:bg-blue-50 disabled:opacity-60 disabled:cursor-not-allowed text-blue-600 font-semibold py-2.5 px-4 rounded-lg border-2 border-blue-600 transition-all duration-300 hover:shadow-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import DyslexiaToggle from '@/components/DyslexiaToggle.vue'
import axios from 'axios'

const router = useRouter()
const menuOpen = ref(false)
const userMenuOpen = ref(false)
const isLoggedIn = ref(false)
const user = ref(null)
const showLogoutModal = ref(false)
const isLoggingOut = ref(false)
const avatarError = ref(false)

onMounted(() => {
  checkLoginStatus()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const checkLoginStatus = async () => {
  const token = localStorage.getItem('token')
  
  if (token) {
    try {
      const response = await axios.get('/api/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      
      if (response.data.success) {
        isLoggedIn.value = true
        user.value = response.data.data
        localStorage.setItem('user', JSON.stringify(response.data.data))
        console.log('User data loaded:', user.value)
      } else {
        throw new Error('Failed to fetch profile')
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      const userData = localStorage.getItem('user')
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData)
          isLoggedIn.value = true
          user.value = parsedUser
          console.log('User data from cache:', user.value)
        } catch (e) {
          console.error('Error parsing user data:', e)
          isLoggedIn.value = false
          user.value = null
        }
      } else {
        isLoggedIn.value = false
        user.value = null
      }
    }
  } else {
    isLoggedIn.value = false
    user.value = null
  }
}

const getUserName = () => {
  if (!user.value) return 'Pengguna'
  
  return user.value.name || 
         user.value.nama || 
         user.value.username || 
         user.value.fullName || 
         user.value.full_name || 
         'Pengguna'
}

const getUserRole = () => {
  if (!user.value) return 'siswa'
  
  return user.value.role || 
         user.value.user_role || 
         user.value.userRole || 
         'siswa'
}

const getAvatarUrl = () => {
  if (avatarError.value) {
    return 'https://i.pinimg.com/736x/05/11/45/051145a8e366876f859378154aa7df8b.jpg'
  }
  
  if (!user.value || !user.value.avatar) {
    return 'https://i.pinimg.com/736x/05/11/45/051145a8e366876f859378154aa7df8b.jpg'
  }
  
  const avatar = user.value.avatar
  
  if (avatar.startsWith('http://') || avatar.startsWith('https://')) {
    return avatar
  }
  
  const baseURL = import.meta.env.VITE_API_BASE || 'http://localhost:5000'
  return `${baseURL}/uploads/${avatar}`
}

const handleAvatarError = (e) => {
  console.error('Error loading avatar, using default')
  avatarError.value = true
  e.target.src = 'https://i.pinimg.com/736x/05/11/45/051145a8e366876f859378154aa7df8b.jpg'
}

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
  if (menuOpen.value) {
    userMenuOpen.value = false
  }
}

const closeMenu = () => {
  menuOpen.value = false
}

const toggleUserMenu = (e) => {
  e.stopPropagation()
  userMenuOpen.value = !userMenuOpen.value
  if (userMenuOpen.value) {
    menuOpen.value = false
  }
}

const closeUserMenu = () => {
  userMenuOpen.value = false
}

const handleClickOutside = (e) => {
  const menu = document.querySelector('.relative')
  if (menu && !menu.contains(e.target)) {
    userMenuOpen.value = false
  }
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