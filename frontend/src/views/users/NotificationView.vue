<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div class="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <button
            @click="goBack"
            class="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
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
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 class="text-xl font-bold text-gray-900">Notifikasi</h1>
        </div>
        
        <button
          v-if="unreadCount > 0"
          @click="markAllAsRead"
          class="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Tandai Semua Dibaca
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-3xl mx-auto">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center py-20">
        <div class="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
      </div>

      <!-- Notifications List -->
      <div v-else-if="notifications.length > 0" class="divide-y divide-gray-200">
        <div
          v-for="notif in notifications"
          :key="notif.id_notifikasi"
          class="bg-white hover:bg-gray-50 transition-colors relative"
          :class="{ 'bg-blue-50 hover:bg-blue-100': !notif.is_read }"
        >
          <div class="px-4 py-4 flex gap-4">
            <!-- Icon -->
            <div class="flex-shrink-0">
              <div
                class="w-12 h-12 flex items-center justify-center rounded-full text-2xl"
                :class="getIconBackground(notif.tipe)"
              >
                {{ notif.icon }}
              </div>
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-3 mb-2">
                <h3 class="text-base font-semibold text-gray-900">
                  {{ notif.judul }}
                </h3>
                <span
                  v-if="!notif.is_read"
                  class="flex-shrink-0 w-2.5 h-2.5 bg-blue-500 rounded-full mt-1"
                ></span>
              </div>

              <p class="text-sm text-gray-600 leading-relaxed mb-2">
                {{ notif.pesan }}
              </p>

              <div class="flex items-center justify-between">
                <span class="text-xs text-gray-400">
                  {{ formatRelativeTime(notif.created_at) }}
                </span>

                <!-- Action Buttons -->
                <div class="flex items-center gap-2">
                  <button
                    v-if="!notif.is_read"
                    @click="markAsRead(notif.id_notifikasi)"
                    class="text-xs text-blue-600 hover:text-blue-700 font-medium px-3 py-1 rounded-md hover:bg-blue-100 transition-colors"
                  >
                    Tandai Dibaca
                  </button>
                  
                  <button
                    @click="deleteNotification(notif.id_notifikasi)"
                    class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                    >
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Book Info if available -->
              <div
                v-if="notif.judul_buku"
                class="mt-3 p-3 bg-gray-100 rounded-lg flex items-center gap-3"
                @click="goToBook(notif.id_buku)"
              >
                <div class="w-10 h-10 bg-blue-500 rounded flex items-center justify-center text-white font-bold text-sm">
                  📚
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900 truncate">
                    {{ notif.judul_buku }}
                  </p>
                  <p class="text-xs text-gray-500">Kode: {{ notif.kode_buku || '-' }}</p>
                </div>
                <button
                  v-if="notif.id_buku"
                  class="flex-shrink-0 text-blue-600 hover:text-blue-700 p-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div class="w-24 h-24 mb-6 text-gray-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
        </div>
        <h2 class="text-xl font-bold text-gray-900 mb-2">Tidak Ada Notifikasi</h2>
        <p class="text-gray-500">Semua notifikasi akan muncul di sini</p>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <transition name="modal">
      <div
        v-if="showConfirmModal"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        @click="closeConfirmModal"
      >
        <div
          @click.stop
          class="bg-white rounded-lg shadow-xl max-w-sm w-full p-6 animate-scale-up"
        >
          <div class="text-center mb-4">
            <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                class="text-red-600"
              >
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Hapus Notifikasi?</h3>
            <p class="text-sm text-gray-600">
              Notifikasi yang dihapus tidak dapat dikembalikan
            </p>
          </div>
          <div class="flex gap-3">
            <button
              @click="closeConfirmModal"
              class="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Batal
            </button>
            <button
              @click="confirmDelete"
              class="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              Hapus
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Toast Notification -->
    <transition name="toast">
      <div
        v-if="toast.show"
        class="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
      >
        <div
          class="px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[280px]"
          :class="toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'"
        >
          <span class="text-xl">{{ toast.type === 'success' ? '✓' : '✕' }}</span>
          <span class="font-medium">{{ toast.message }}</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// State
const notifications = ref([])
const unreadCount = ref(0)
const isLoading = ref(false)
const showConfirmModal = ref(false)
const deleteTargetId = ref(null)

const toast = reactive({
  show: false,
  type: 'success',
  message: ''
})

// API Base
const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:5000'

// Fetch notifications
const fetchNotifications = async () => {
  isLoading.value = true
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
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
    } else if (res.status === 401) {
      localStorage.removeItem('token')
      router.push('/login')
    }
  } catch (error) {
    console.error('Error fetching notifications:', error)
    showToast('error', 'Gagal memuat notifikasi')
  } finally {
    isLoading.value = false
  }
}

// Mark as read
const markAsRead = async (id) => {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`${apiBase}/api/notification/${id}/read`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (res.ok) {
      const notif = notifications.value.find(n => n.id_notifikasi === id)
      if (notif && !notif.is_read) {
        notif.is_read = true
        unreadCount.value = Math.max(0, unreadCount.value - 1)
      }
      showToast('success', 'Notifikasi ditandai telah dibaca')
    }
  } catch (error) {
    console.error('Error marking as read:', error)
    showToast('error', 'Gagal menandai notifikasi')
  }
}

// Mark all as read
const markAllAsRead = async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`${apiBase}/api/notification/read-all`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (res.ok) {
      notifications.value.forEach(n => n.is_read = true)
      unreadCount.value = 0
      showToast('success', 'Semua notifikasi telah ditandai dibaca')
    }
  } catch (error) {
    console.error('Error marking all as read:', error)
    showToast('error', 'Gagal menandai semua notifikasi')
  }
}

// Delete notification
const deleteNotification = (id) => {
  deleteTargetId.value = id
  showConfirmModal.value = true
}

const confirmDelete = async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await fetch(`${apiBase}/api/notification/${deleteTargetId.value}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (res.ok) {
      const notif = notifications.value.find(n => n.id_notifikasi === deleteTargetId.value)
      if (notif && !notif.is_read) {
        unreadCount.value = Math.max(0, unreadCount.value - 1)
      }
      
      notifications.value = notifications.value.filter(
        n => n.id_notifikasi !== deleteTargetId.value
      )
      
      showToast('success', 'Notifikasi berhasil dihapus')
    }
  } catch (error) {
    console.error('Error deleting notification:', error)
    showToast('error', 'Gagal menghapus notifikasi')
  } finally {
    closeConfirmModal()
  }
}

const closeConfirmModal = () => {
  showConfirmModal.value = false
  deleteTargetId.value = null
}

// Helper functions
const getIconBackground = (tipe) => {
  const colors = {
    peminjaman_pending: 'bg-blue-100',
    peminjaman_approved: 'bg-green-100',
    peminjaman_rejected: 'bg-red-100',
    peminjaman_dipinjam: 'bg-purple-100',
    peminjaman_terlambat: 'bg-orange-100',
    broadcast: 'bg-yellow-100'
  }
  return colors[tipe] || 'bg-gray-100'
}

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

const showToast = (type, message) => {
  toast.show = true
  toast.type = type
  toast.message = message
  
  setTimeout(() => {
    toast.show = false
  }, 3000)
}

const goBack = () => {
  router.back()
}

const goToBook = (bookId) => {
  router.push(`/riwayat`)
}

onMounted(() => {
  fetchNotifications()
})
</script>

<style scoped>
@keyframes scale-up {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-scale-up {
  animation: scale-up 0.2s ease;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, 20px);
}
</style>