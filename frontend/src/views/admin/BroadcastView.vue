<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 class="text-3xl md:text-4xl font-bold text-gray-900">Broadcast Notifikasi</h1>
          <p class="text-gray-600 mt-1">Kirim notifikasi ke semua anggota aktif</p>
        </div>
        <button 
          @click="openBroadcastModal" 
          class="flex items-center justify-center gap-2 px-6 py-3 bg-[#2C64F9] text-white rounded-xl font-semibold hover:bg-[#1e4fd6] transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/>
          </svg>
          <span>Kirim Broadcast</span>
        </button>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
        <div class="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 bg-gradient-to-br from-[#2C64F9] to-[#1e4fd6] rounded-xl flex items-center justify-center shadow-md">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </div>
            <div>
              <div class="text-gray-600 text-sm">Total Broadcast</div>
              <div class="text-3xl font-bold text-gray-900">{{ stats.totalBroadcasts }}</div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 bg-gradient-to-br from-[#2C64F9] to-[#1e4fd6] rounded-xl flex items-center justify-center shadow-md">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
            </div>
            <div>
              <div class="text-gray-600 text-sm">Total Penerima</div>
              <div class="text-3xl font-bold text-gray-900">{{ stats.totalRecipients }}</div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 bg-gradient-to-br from-[#2C64F9] to-[#1e4fd6] rounded-xl flex items-center justify-center shadow-md">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <div class="text-gray-600 text-sm">Tingkat Baca</div>
              <div class="text-3xl font-bold text-gray-900">{{ stats.readRate }}%</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Broadcast History -->
      <div class="bg-white rounded-2xl shadow-sm p-6 md:p-8">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 class="text-2xl font-bold text-gray-900">Riwayat Broadcast</h2>
          <button 
            @click="loadHistory" 
            :disabled="loading"
            class="flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-50 text-[#2C64F9] border-2 border-[#2C64F9] rounded-xl font-semibold hover:bg-[#2C64F9] hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg class="w-5 h-5" :class="{ 'animate-spin': loading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            <span>Refresh</span>
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-16">
          <div class="w-12 h-12 border-4 border-gray-200 border-t-[#2C64F9] rounded-full animate-spin mx-auto mb-4"></div>
          <p class="text-gray-600">Memuat data...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="broadcasts.length === 0" class="text-center py-16">
          <svg class="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
          </svg>
          <h3 class="text-xl font-semibold text-gray-900 mb-2">Belum Ada Broadcast</h3>
          <p class="text-gray-600">Mulai kirim broadcast pertama Anda</p>
        </div>

        <!-- Broadcast List -->
        <div v-else class="space-y-4">
          <div 
            v-for="broadcast in broadcasts" 
            :key="broadcast.id_notifikasi"
            class="bg-gray-50 border border-gray-200 rounded-xl p-5 md:p-6 hover:border-[#2C64F9] hover:shadow-md transition-all duration-300"
          >
            <!-- Header -->
            <div class="flex items-start gap-4 mb-4">
              <div class="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                <span class="text-2xl">{{ broadcast.icon }}</span>
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ broadcast.judul }}</h3>
                <p class="text-sm text-gray-600">{{ formatDate(broadcast.created_at) }}</p>
              </div>
            </div>

            <!-- Message -->
            <p class="text-gray-700 leading-relaxed mb-5">{{ broadcast.pesan }}</p>

            <!-- Stats -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white rounded-lg p-4 mb-4">
              <div>
                <div class="text-xs text-gray-600 mb-1">Penerima:</div>
                <div class="text-base font-semibold text-[#2C64F9]">{{ broadcast.recipient_count }} orang</div>
              </div>
              <div>
                <div class="text-xs text-gray-600 mb-1">Telah Dibaca:</div>
                <div class="text-base font-semibold text-[#2C64F9]">{{ broadcast.read_count }} orang</div>
              </div>
              <div>
                <div class="text-xs text-gray-600 mb-1">Tingkat Baca:</div>
                <div class="text-base font-semibold text-[#2C64F9]">
                  {{ calculateReadRate(broadcast.read_count, broadcast.recipient_count) }}%
                </div>
              </div>
            </div>

            <!-- Progress Bar -->
            <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                class="h-full bg-gradient-to-r from-[#2C64F9] to-[#5b8af9] rounded-full transition-all duration-500"
                :style="{ width: calculateReadRate(broadcast.read_count, broadcast.recipient_count) + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Broadcast Modal -->
    <BroadcastModal
      v-if="showModal"
      @close="showModal = false"
      @submit="handleBroadcast"
      :loading="sending"
    />

    <!-- Toast -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="translate-x-full opacity-0"
      enter-to-class="translate-x-0 opacity-100"
      leave-active-class="transition duration-300 ease-in"
      leave-from-class="translate-x-0 opacity-100"
      leave-to-class="translate-y-full opacity-0"
    >
      <div 
        v-if="toast.show" 
        class="fixed bottom-8 right-8 flex items-center gap-3 min-w-80 bg-white rounded-xl shadow-2xl p-4 z-50 border-l-4"
        :class="toast.type === 'success' ? 'border-green-500' : 'border-red-500'"
      >
        <svg v-if="toast.type === 'success'" class="w-6 h-6 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <svg v-else class="w-6 h-6 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <span class="text-gray-900 font-medium">{{ toast.message }}</span>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import BroadcastModal from '@/components/admin/BroadcastModal.vue';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// State
const broadcasts = ref([]);
const loading = ref(false);
const sending = ref(false);
const showModal = ref(false);
const toast = ref({
  show: false,
  type: 'success',
  message: ''
});

// Computed Stats
const stats = computed(() => {
  const totalBroadcasts = broadcasts.value.length;
  const totalRecipients = broadcasts.value.reduce((sum, b) => sum + Number(b.recipient_count || 0), 0);
  const totalRead = broadcasts.value.reduce((sum, b) => sum + Number(b.read_count || 0), 0);
  const readRate = totalRecipients > 0 ? Math.min(100, Math.round((totalRead / totalRecipients) * 100)) : 0;

  return {
    totalBroadcasts,
    totalRecipients,
    readRate
  };
});

// Methods
const loadHistory = async () => {
  loading.value = true;
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/notification/admin/broadcast/history`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    broadcasts.value = response.data.broadcasts;
  } catch (error) {
    console.error('Error loading broadcast history:', error);
    showToast('error', error.response?.data?.message || 'Gagal memuat riwayat broadcast');
  } finally {
    loading.value = false;
  }
};

const openBroadcastModal = () => {
  showModal.value = true;
};

const handleBroadcast = async (data) => {
  sending.value = true;
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${API_URL}/notification/admin/broadcast`,
      data,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    showToast('success', `Broadcast berhasil dikirim ke ${response.data.recipientCount} anggota`);
    showModal.value = false;
    
    // Reload history
    await loadHistory();
  } catch (error) {
    console.error('Error sending broadcast:', error);
    const message = error.response?.data?.message || 'Gagal mengirim broadcast';
    showToast('error', message);
  } finally {
    sending.value = false;
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString.replace(' ', 'T') + '+07:00');
  const now = new Date();
  const diff = now - date;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 7) {
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } else if (days > 0) {
    return `${days} hari yang lalu`;
  } else if (hours > 0) {
    return `${hours} jam yang lalu`;
  } else if (minutes > 0) {
    return `${minutes} menit yang lalu`;
  } else {
    return 'Baru saja';
  }
};

const calculateReadRate = (read, total) => {
  if (total === 0) return 0;
  return Math.round((read / total) * 100);
};

const showToast = (type, message) => {
  toast.value = { show: true, type, message };
  setTimeout(() => {
    toast.value.show = false;
  }, 3000);
};

// Lifecycle
onMounted(() => {
  loadHistory();
});
</script>