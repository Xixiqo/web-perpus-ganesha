<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" @click.self="$emit('close')">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-[#2C64F9] to-[#1e4fd6] rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/>
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-gray-900">Kirim Broadcast</h2>
          </div>
          <button 
            @click="$emit('close')"
            class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
        <!-- Icon Selector -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-3">
            Pilih Icon Notifikasi
          </label>
          <div class="grid grid-cols-5 sm:grid-cols-8 gap-2">
            <button
              v-for="emoji in emojiList"
              :key="emoji"
              type="button"
              @click="form.icon = emoji"
              class="w-12 h-12 text-2xl rounded-lg border-2 transition-all duration-200 hover:scale-110"
              :class="form.icon === emoji 
                ? 'border-[#2C64F9] bg-blue-50 shadow-md' 
                : 'border-gray-200 hover:border-gray-300 bg-white'"
            >
              {{ emoji }}
            </button>
          </div>
        </div>

        <!-- Tipe -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            Tipe Notifikasi
          </label>
          <input
            v-model="form.tipe"
            type="text"
            placeholder="broadcast"
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C64F9] focus:border-transparent transition-all bg-gray-50"
            readonly
          />
        </div>

        <!-- Judul -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            Judul Notifikasi <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.judul"
            type="text"
            placeholder="Contoh: Pengumuman Penting"
            maxlength="255"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C64F9] focus:border-transparent transition-all"
            :class="errors.judul ? 'border-red-500' : ''"
          />
          <div class="flex justify-between items-center mt-1">
            <span v-if="errors.judul" class="text-xs text-red-500">{{ errors.judul }}</span>
            <span class="text-xs text-gray-500 ml-auto">{{ form.judul.length }}/255</span>
          </div>
        </div>

        <!-- Pesan -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            Isi Pesan <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="form.pesan"
            rows="6"
            placeholder="Tulis pesan broadcast Anda di sini..."
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C64F9] focus:border-transparent transition-all resize-none"
            :class="errors.pesan ? 'border-red-500' : ''"
          ></textarea>
          <div class="flex justify-between items-center mt-1">
            <span v-if="errors.pesan" class="text-xs text-red-500">{{ errors.pesan }}</span>
            <span class="text-xs text-gray-500 ml-auto">{{ form.pesan.length }} karakter</span>
          </div>
        </div>

        <!-- Preview -->
        <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200">
          <div class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
            </svg>
            <span>Preview Notifikasi</span>
          </div>
          <div class="bg-white rounded-lg p-4 shadow-sm">
            <div class="flex items-start gap-3">
              <div class="w-10 h-10 bg-gradient-to-br from-[#2C64F9] to-[#1e4fd6] rounded-lg flex items-center justify-center text-xl flex-shrink-0">
                {{ form.icon }}
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="font-semibold text-gray-900 mb-1">
                  {{ form.judul || 'Judul Notifikasi' }}
                </h4>
                <p class="text-sm text-gray-600 leading-relaxed">
                  {{ form.pesan || 'Isi pesan akan muncul di sini...' }}
                </p>
                <div class="mt-2 text-xs text-gray-500">Baru saja</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Info -->
        <div class="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div class="flex gap-3">
            <svg class="w-6 h-6 text-yellow-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            <div class="text-sm text-yellow-800">
              <p class="font-semibold mb-1">Perhatian:</p>
              <p>Notifikasi akan dikirim ke <strong>semua anggota aktif</strong> yang terdaftar di sistem. Pastikan pesan sudah benar sebelum mengirim.</p>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            @click="$emit('close')"
            :disabled="loading"
            class="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Batal
          </button>
          <button
            type="submit"
            :disabled="loading || !isFormValid"
            class="flex-1 px-6 py-3 bg-[#2C64F9] text-white rounded-xl font-semibold hover:bg-[#1e4fd6] transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span v-if="loading" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            <span>{{ loading ? 'Mengirim...' : 'Kirim Broadcast' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'submit']);

// Emoji list
const emojiList = [
  '📢', '📣', '📌', '⚡', '🎉', '🎊', '⭐', '✨',
  '📚', '📖', '📝', '✅', '❗', '⚠️', '🔔', '🎯',
  '💡', '🔥', '💫', '🎓', '📅', '⏰', '🏆', '🎁'
];

// Form state
const form = ref({
  tipe: 'broadcast',
  judul: '',
  pesan: '',
  icon: '📢'
});

const errors = ref({
  judul: '',
  pesan: ''
});

// Computed
const isFormValid = computed(() => {
  return form.value.judul.trim().length > 0 && 
         form.value.pesan.trim().length > 0;
});

// Methods
const validateForm = () => {
  errors.value = {
    judul: '',
    pesan: ''
  };

  let isValid = true;

  if (form.value.judul.trim().length === 0) {
    errors.value.judul = 'Judul tidak boleh kosong';
    isValid = false;
  } else if (form.value.judul.trim().length < 5) {
    errors.value.judul = 'Judul minimal 5 karakter';
    isValid = false;
  }

  if (form.value.pesan.trim().length === 0) {
    errors.value.pesan = 'Pesan tidak boleh kosong';
    isValid = false;
  } else if (form.value.pesan.trim().length < 10) {
    errors.value.pesan = 'Pesan minimal 10 karakter';
    isValid = false;
  }

  return isValid;
};

const handleSubmit = () => {
  if (!validateForm()) {
    return;
  }

  emit('submit', {
    tipe: form.value.tipe,
    judul: form.value.judul.trim(),
    pesan: form.value.pesan.trim(),
    icon: form.value.icon
  });
};
</script>