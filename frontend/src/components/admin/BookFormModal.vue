<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 animate-fade-in z-[100]">
    <div class="bg-white rounded-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-scale-in transition-all duration-300 max-w-4xl">
      
      <!-- Header -->
      <div class="px-6 py-4 border-b flex items-center justify-between bg-gradient-to-r from-[#2C64F9] to-[#1e4fd6]">
        <h2 class="text-xl md:text-2xl font-bold text-white">
          {{ isEdit ? '✏️ Edit Buku' : '📖 Tambah Buku Baru' }}
        </h2>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        <!-- Informasi Dasar -->
        <div>
          <h3 class="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-[#2C64F9]">
            Informasi Dasar
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700">
                Kode Buku <span class="text-red-500">*</span>
              </label>
              <input 
                v-model="form.kode_buku" 
                type="text" 
                class="w-full py-2.5 px-4 border-2 border-gray-200 rounded-lg text-sm transition-all focus:outline-none focus:border-[#2C64F9] focus:ring-3 focus:ring-blue-100"
                placeholder="Masukkan kode buku" 
                required
                @input="hasChanges = true"
              />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700">
                Judul <span class="text-red-500">*</span>
              </label>
              <input 
                v-model="form.judul" 
                type="text" 
                class="w-full py-2.5 px-4 border-2 border-gray-200 rounded-lg text-sm transition-all focus:outline-none focus:border-[#2C64F9] focus:ring-3 focus:ring-blue-100"
                placeholder="Masukkan judul buku" 
                required
                @input="hasChanges = true; generateSlug()"
              />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700">
                Penulis <span class="text-red-500">*</span>
              </label>
              <input 
                v-model="form.pembuat" 
                type="text" 
                class="w-full py-2.5 px-4 border-2 border-gray-200 rounded-lg text-sm transition-all focus:outline-none focus:border-[#2C64F9] focus:ring-3 focus:ring-blue-100"
                placeholder="Nama penulis" 
                required
                @input="hasChanges = true"
              />
            </div>
          </div>
        </div>

        <!-- Slug (Auto-generated) -->
        <div>
          <label class="text-sm font-medium text-gray-700">
            Slug (Auto-generated)
          </label>
          <input 
            v-model="form.slug" 
            type="text" 
            class="w-full py-2.5 px-4 border-2 border-gray-200 rounded-lg text-sm bg-gray-50 transition-all focus:outline-none focus:border-[#2C64F9] focus:ring-3 focus:ring-blue-100"
            placeholder="slug-otomatis-dari-judul" 
            readonly
          />
          <p class="text-xs text-gray-500 mt-1">Slug akan otomatis dibuat dari judul buku</p>
        </div>

        <!-- Detail Publikasi -->
        <div>
          <h3 class="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-[#2C64F9]">
            Detail Publikasi
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700">Penerbit</label>
              <input 
                v-model="form.penerbit" 
                type="text" 
                class="w-full py-2.5 px-4 border-2 border-gray-200 rounded-lg text-sm transition-all focus:outline-none focus:border-[#2C64F9] focus:ring-3 focus:ring-blue-100"
                placeholder="Nama penerbit"
                @input="hasChanges = true"
              />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700">Bahasa</label>
              <select
                v-model="form.bahasa_buku"
                class="w-full py-2.5 px-4 border-2 border-gray-200 rounded-lg text-sm transition-all focus:outline-none focus:border-[#2C64F9] focus:ring-3 focus:ring-blue-100"
                @change="hasChanges = true"
              >
                <option value="">Pilih Bahasa</option>
                <option value="Indonesia">Indonesia</option>
                <option value="English">English</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700">Tahun Rilis</label>
              <input 
                v-model="form.tahun_rilis" 
                type="number" 
                class="w-full py-2.5 px-4 border-2 border-gray-200 rounded-lg text-sm transition-all focus:outline-none focus:border-[#2C64F9] focus:ring-3 focus:ring-blue-100"
                placeholder="YYYY"
                @input="hasChanges = true"
              />
            </div>
          </div>
        </div>

        <!-- Klasifikasi -->
        <div>
          <h3 class="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-[#2C64F9]">
            Klasifikasi
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700">ISBN / ISSN</label>
              <input 
                v-model="form.isbn_issn" 
                type="text" 
                class="w-full py-2.5 px-4 border-2 border-gray-200 rounded-lg text-sm transition-all focus:outline-none focus:border-[#2C64F9] focus:ring-3 focus:ring-blue-100"
                placeholder="Nomor ISBN/ISSN"
                @input="hasChanges = true"
              />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700">Kategori</label>
              <input 
                v-model="form.kategori" 
                type="text" 
                class="w-full py-2.5 px-4 border-2 border-gray-200 rounded-lg text-sm transition-all focus:outline-none focus:border-[#2C64F9] focus:ring-3 focus:ring-blue-100"
                placeholder="Kategori buku"
                @input="hasChanges = true"
              />
            </div>
          </div>
        </div>

        <!-- Sinopsis -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">Sinopsis</label>
          <textarea 
            v-model="form.sinopsis" 
            rows="4" 
            class="w-full py-2.5 px-4 border-2 border-gray-200 rounded-lg text-sm transition-all focus:outline-none focus:border-[#2C64F9] focus:ring-3 focus:ring-blue-100 resize-y"
            placeholder="Deskripsi singkat tentang buku ini..."
            @input="hasChanges = true"
          ></textarea>
        </div>

        <!-- Stok dan Cover -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Stok</label>
            <input 
              v-model="form.stok" 
              type="number" 
              class="w-full py-2.5 px-4 border-2 border-gray-200 rounded-lg text-sm transition-all focus:outline-none focus:border-[#2C64F9] focus:ring-3 focus:ring-blue-100"
              placeholder="Jumlah stok" 
              min="0"
              @input="hasChanges = true"
            />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Cover Buku</label>
            <div v-if="coverPreview" class="relative mb-2">
              <img :src="coverPreview" class="w-full h-32 object-cover rounded-lg border-2 border-gray-200" alt="Cover preview" />
              <button
                type="button"
                @click="removeCover"
                class="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full hover:bg-red-600 transition shadow-lg flex items-center justify-center"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <input 
              type="file" 
              ref="coverInput"
              @change="handleFileUpload" 
              accept="image/*"
              class="w-full py-2 px-4 border-2 border-gray-200 rounded-lg text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-[#2C64F9] hover:file:bg-blue-100 transition-all cursor-pointer"
            />
          </div>
        </div>
      </form>

      <!-- Footer -->
      <div class="px-4 md:px-6 py-4 border-t bg-gray-50 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
        <button
          type="button"
          @click="handleClose"
          class="px-6 py-2.5 border-2 border-gray-300 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50 transition-all"
        >
          Batal
        </button>
        <button
          @click="handleSubmit"
          :disabled="saving"
          class="px-6 py-2.5 bg-[#2C64F9] text-white rounded-lg text-sm font-medium hover:bg-[#1e4fd6] shadow-blue-100 shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div v-if="saving" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>{{ saving ? 'Menyimpan...' : (isEdit ? '✓ Update Buku' : '+ Tambah Buku') }}</span>
        </button>
      </div>
    </div>

    <!-- Unsaved Changes Modal -->
    <transition name="modal">
      <div v-if="showUnsavedModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[150] p-4">
        <div class="bg-white rounded-xl max-w-md w-full shadow-2xl animate-scale-in">
          <div class="p-6">
            <div class="flex items-center space-x-3 mb-4">
              <div class="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 class="text-lg font-bold text-gray-900">Perubahan Belum Disimpan</h3>
            </div>
            <p class="text-gray-600 mb-6">Anda memiliki perubahan yang belum disimpan. Apakah Anda yakin ingin menutup? Semua perubahan akan hilang.</p>
            <div class="flex space-x-3">
              <button
                @click="showUnsavedModal = false"
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition font-medium"
              >
                Lanjut Edit
              </button>
              <button
                @click="forceClose"
                class="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium"
              >
                Buang Perubahan
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';

const props = defineProps({
  bookData: {
    type: Object,
    default: null
  },
  isEdit: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'submit']);

const form = ref({
  kode_buku: "",
  judul: "",
  pembuat: "",
  penerbit: "",
  bahasa_buku: "",
  tahun_rilis: "",
  isbn_issn: "",
  kategori: "",
  sinopsis: "",
  stok: 0,
  cover: null,
  slug: ""
});

const hasChanges = ref(false);
const showUnsavedModal = ref(false);
const saving = ref(false);
const coverPreview = ref(null);
const coverInput = ref(null);

// Generate slug from title
const generateSlug = () => {
  if (form.value.judul) {
    form.value.slug = form.value.judul
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .trim();
  }
};

// Handle file upload
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    form.value.cover = file;
    hasChanges.value = true;
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      coverPreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

// Remove cover
const removeCover = () => {
  form.value.cover = null;
  coverPreview.value = null;
  hasChanges.value = true;
  if (coverInput.value) {
    coverInput.value.value = '';
  }
};

// Handle close with unsaved changes check
const handleClose = () => {
  if (hasChanges.value) {
    showUnsavedModal.value = true;
  } else {
    emit('close');
  }
};

// Force close without saving
const forceClose = () => {
  showUnsavedModal.value = false;
  emit('close');
};

// Handle submit
const handleSubmit = async () => {
  saving.value = true;
  try {
    await emit('submit', form.value);
    hasChanges.value = false;
  } finally {
    saving.value = false;
  }
};

// Initialize form with book data if editing
onMounted(() => {
  if (props.isEdit && props.bookData) {
    Object.assign(form.value, props.bookData);
    
    // Generate slug if not exists
    if (!form.value.slug) {
      generateSlug();
    }
    
    // Set cover preview if exists
    if (props.bookData.cover) {
      const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:5000';
      coverPreview.value = `${apiBase}/uploads/${props.bookData.cover}`;
    }
  }
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

.animate-scale-in {
  animation: scaleIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>