<template>
  <aside class="w-64 bg-gradient-to-b from-slate-50 to-white shadow-lg flex flex-col h-screen">
    <!-- Header -->
    <div class="px-6 py-5 border-b border-gray-200">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
          <span class="text-2xl">📚</span>
        </div>
        <div>
          <h1 class="font-bold text-lg text-gray-800">Ganesha Admin</h1>
          <p class="text-xs text-gray-500">Library Management</p>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-3 py-4 overflow-y-auto">
      <ul class="space-y-2">
        <!-- Dashboard -->
        <li>
          <RouterLink 
            to="/" 
            class="group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 hover:bg-blue-50 hover:shadow-sm"
            :class="isActive('/') ? 'bg-blue-500 text-white shadow-md' : 'text-gray-700'"
          >
            <span class="text-xl transition-transform duration-200 group-hover:scale-110">📊</span>
            <span class="font-medium">Statistik</span>
          </RouterLink>
        </li>

        <!-- Manajemen Buku -->
        <li class="mt-4">
          <button 
            @click="toggleMenu('buku')" 
            class="w-full group flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 hover:bg-gray-100 text-gray-700"
            :class="openMenu === 'buku' ? 'bg-gray-100' : ''"
          >
            <div class="flex items-center gap-3">
              <span class="text-xl transition-transform duration-200 group-hover:scale-110">📘</span>
              <span class="font-medium">Manajemen Buku</span>
            </div>
            <svg 
              class="w-4 h-4 transition-transform duration-300"
              :class="openMenu === 'buku' ? 'rotate-180' : ''"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <!-- Submenu with animation -->
          <transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 -translate-y-2 max-h-0"
            enter-to-class="opacity-100 translate-y-0 max-h-96"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="opacity-100 translate-y-0 max-h-96"
            leave-to-class="opacity-0 -translate-y-2 max-h-0"
          >
            <ul v-show="openMenu === 'buku'" class="ml-6 mt-2 space-y-1 border-l-2 border-blue-200 pl-4 overflow-hidden">
              <li>
                <RouterLink 
                  to="/informasi-buku" 
                  class="block px-3 py-2 rounded-md text-sm transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 hover:translate-x-1"
                  :class="isActive('/informasi-buku') ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600'"
                >
                  Informasi Buku
                </RouterLink>
              </li>
              <li>
                <RouterLink 
                  to="/tambah-buku" 
                  class="block px-3 py-2 rounded-md text-sm transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 hover:translate-x-1"
                  :class="isActive('/tambah-buku') ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600'"
                >
                  Tambah Buku
                </RouterLink>
              </li>
              <li>
                <RouterLink 
                  to="/hapus-buku" 
                  class="block px-3 py-2 rounded-md text-sm transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 hover:translate-x-1"
                  :class="isActive('/hapus-buku') ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600'"
                >
                  Hapus Buku
                </RouterLink>
              </li>
            </ul>
          </transition>
        </li>

        <!-- Sirkulasi Buku -->
        <li class="mt-2">
          <button 
            @click="toggleMenu('sirkulasi')" 
            class="w-full group flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 hover:bg-gray-100 text-gray-700"
            :class="openMenu === 'sirkulasi' ? 'bg-gray-100' : ''"
          >
            <div class="flex items-center gap-3">
              <span class="text-xl transition-transform duration-200 group-hover:scale-110">🔄</span>
              <span class="font-medium">Sirkulasi Buku</span>
            </div>
            <svg 
              class="w-4 h-4 transition-transform duration-300"
              :class="openMenu === 'sirkulasi' ? 'rotate-180' : ''"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 -translate-y-2 max-h-0"
            enter-to-class="opacity-100 translate-y-0 max-h-96"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="opacity-100 translate-y-0 max-h-96"
            leave-to-class="opacity-0 -translate-y-2 max-h-0"
          >
            <ul v-show="openMenu === 'sirkulasi'" class="ml-6 mt-2 space-y-1 border-l-2 border-purple-200 pl-4 overflow-hidden">
              <li>
                <RouterLink 
                  to="/transaksi" 
                  class="block px-3 py-2 rounded-md text-sm transition-all duration-200 hover:bg-purple-50 hover:text-purple-600 hover:translate-x-1"
                  :class="isActive('/transaksi') ? 'bg-purple-50 text-purple-600 font-medium' : 'text-gray-600'"
                >
                  Transaksi
                </RouterLink>
              </li>
              <li>
                <RouterLink 
                  to="/sejarah-peminjaman" 
                  class="block px-3 py-2 rounded-md text-sm transition-all duration-200 hover:bg-purple-50 hover:text-purple-600 hover:translate-x-1"
                  :class="isActive('/sejarah-peminjaman') ? 'bg-purple-50 text-purple-600 font-medium' : 'text-gray-600'"
                >
                  Sejarah Peminjaman
                </RouterLink>
              </li>
              <li>
                <RouterLink 
                  to="/daftar-keterlambatan" 
                  class="block px-3 py-2 rounded-md text-sm transition-all duration-200 hover:bg-purple-50 hover:text-purple-600 hover:translate-x-1"
                  :class="isActive('/daftar-keterlambatan') ? 'bg-purple-50 text-purple-600 font-medium' : 'text-gray-600'"
                >
                  Daftar Keterlambatan
                </RouterLink>
              </li>
              <li>
                <RouterLink 
                  to="/reservasi-online" 
                  class="block px-3 py-2 rounded-md text-sm transition-all duration-200 hover:bg-purple-50 hover:text-purple-600 hover:translate-x-1"
                  :class="isActive('/reservasi-online') ? 'bg-purple-50 text-purple-600 font-medium' : 'text-gray-600'"
                >
                  Reservasi Online
                </RouterLink>
              </li>
            </ul>
          </transition>
        </li>
      </ul>
    </nav>

    <!-- Footer -->
    <div class="px-4 py-3 border-t border-gray-200 bg-gray-50">
      <div class="flex items-center gap-3 px-2">
        <div class="w-8 h-8 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow">
          A
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-800 truncate">Admin User</p>
          <p class="text-xs text-gray-500">administrator</p>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const openMenu = ref(null)

const toggleMenu = (menu) => {
  openMenu.value = openMenu.value === menu ? null : menu
}

const isActive = (path) => {
  return route.path === path
}
</script>

<style scoped>
/* Smooth scrollbar */
nav::-webkit-scrollbar {
  width: 6px;
}

nav::-webkit-scrollbar-track {
  background: transparent;
}

nav::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

nav::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>