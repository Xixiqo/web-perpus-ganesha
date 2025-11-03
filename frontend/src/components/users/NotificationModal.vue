<template>
  <div class="relative">
    <!-- Notification Bell Button -->
    <button
      @click="toggleDropdown"
      class="relative p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
      :class="{ 'bg-gray-100': showDropdown }"
      type="button"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        class="text-gray-700"
      >
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
      </svg>
      
      <!-- Badge notif belum dibaca -->
      <span
        v-if="unreadCount > 0"
        class="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full min-w-[20px]"
      >
        {{ unreadCount > 99 ? '99+' : unreadCount }}
      </span>
    </button>

    <!-- Dropdown Notification -->
    <transition name="dropdown">
      <div
        v-if="showDropdown"
        ref="dropdownRef"
        class="absolute right-0 mt-2 w-[380px] max-h-[500px] bg-white rounded-lg shadow-lg border border-gray-200 z-50 flex flex-col"
      >
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 class="text-lg font-bold text-gray-900">Notifikasi</h3>
          <button
            v-if="unreadCount > 0"
            @click="markAllAsRead"
            class="text-sm text-blue-600 hover:text-blue-700 font-medium"
            type="button"
          >
            Tandai Semua Dibaca
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex items-center justify-center py-12">
          <div class="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
        </div>

        <!-- Notification List -->
        <div v-else-if="notifications.length > 0" class="overflow-y-auto flex-1">
          <div
            v-for="notif in notifications"
            :key="notif.id_notifikasi"
            @click="handleNotificationClick(notif)"
            class="px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors duration-200"
            :class="{ 'bg-blue-50': !notif.is_read }"
          >
            <div class="flex gap-3">
              <!-- Icon -->
              <div class="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-blue-100 rounded-full text-xl">
                {{ notif.icon }}
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-2">
                  <p class="text-sm font-semibold text-gray-900 line-clamp-1">
                    {{ notif.judul }}
                  </p>
                  <span
                    v-if="!notif.is_read"
                    class="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full"
                  ></span>
                </div>
                <p class="text-sm text-gray-600 mt-1 line-clamp-2">
                  {{ notif.pesan }}
                </p>
                <p class="text-xs text-gray-400 mt-1">
                  {{ formatRelativeTime(notif.created_at) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="flex flex-col items-center justify-center py-12 text-center">
          <div class="w-16 h-16 mb-4 text-gray-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </div>
          <p class="text-gray-500 font-medium">Tidak ada notifikasi</p>
          <p class="text-sm text-gray-400 mt-1">Semua notifikasi akan muncul di sini</p>
        </div>

        <!-- Footer -->
        <div class="p-3 border-t border-gray-200">
          <router-link
            to="/notifikasi"
            @click="closeDropdown"
            class="block text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Lihat Semua Notifikasi
          </router-link>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// State
const showDropdown = ref(false)
const notifications = ref([])
const unreadCount = ref(0)
const isLoading = ref(false)
const dropdownRef = ref(null)
let pollInterval = null

// API Base
const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:5000'

// Toggle dropdown
const toggleDropdown = () => {
  console.log('Toggle clicked, current state:', showDropdown.value) // Debug log
  showDropdown.value = !showDropdown.value
  if (showDropdown.value) {
    fetchNotifications()
  }
}

const closeDropdown = () => {
  showDropdown.value = false
}

// Click outside handler
const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target) && 
      !event.target.closest('button[type="button"]')) {
    closeDropdown()
  }
}

// Fetch notifications
const fetchNotifications = async () => {
  isLoading.value = true
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      console.warn('No token found')
      return
    }

    const res = await fetch(`${apiBase}/api/notification`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (res.ok) {
      const data = await res.json()
      notifications.value = data.notifications || []
      unreadCount.value = data.unreadCount || 0
      console.log('Notifications fetched:', notifications.value.length) // Debug log
    } else {
      console.error('Failed to fetch notifications:', res.status)
    }
  } catch (error) {
    console.error('Error fetching notifications:', error)
  } finally {
    isLoading.value = false
  }
}

// Handle notification click
const handleNotificationClick = async (notif) => {
  // Mark as read
  if (!notif.is_read) {
    await markAsRead(notif.id_notifikasi)
  }

  // Navigate based on type
  if (notif.id_peminjaman) {
    router.push('/notifikasi')
  }
  
  closeDropdown()
}

// Mark as read
const markAsRead = async (id) => {
  try {
    const token = localStorage.getItem('token')
    await fetch(`${apiBase}/api/notification/${id}/read`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    // Update local state
    const notif = notifications.value.find(n => n.id_notifikasi === id)
    if (notif && !notif.is_read) {
      notif.is_read = true
      unreadCount.value = Math.max(0, unreadCount.value - 1)
    }
  } catch (error) {
    console.error('Error marking as read:', error)
  }
}

// Mark all as read
const markAllAsRead = async () => {
  try {
    const token = localStorage.getItem('token')
    await fetch(`${apiBase}/api/notification/read-all`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    // Update local state
    notifications.value.forEach(n => n.is_read = true)
    unreadCount.value = 0
  } catch (error) {
    console.error('Error marking all as read:', error)
  }
}

// Format relative time
const formatRelativeTime = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now - date) / 1000)

  if (diffInSeconds < 60) return 'Baru saja'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit lalu`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam lalu`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} hari lalu`
  
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

// Polling untuk update otomatis
const startPolling = () => {
  fetchNotifications()
  pollInterval = setInterval(fetchNotifications, 30000) // Setiap 30 detik
}

const stopPolling = () => {
  if (pollInterval) {
    clearInterval(pollInterval)
  }
}

onMounted(() => {
  startPolling()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  stopPolling()
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>