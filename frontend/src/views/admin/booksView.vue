<template>
  <div class="max-w-[1400px] mx-auto p-5">
    <!-- Alert Component -->
    <BaseAlert
      v-model="alert.show"
      :type="alert.type"
      :message="alert.message"
    />
    
    <!-- Modal Component -->
    <BaseModal
      v-model="modal.show"
      :title="modal.title"
      :confirm-text="modal.confirmText || 'Konfirmasi'"
      :cancel-text="modal.cancelText || 'Batal'"
      @confirm="modal.onConfirm && modal.onConfirm()"
    >
      <p class="text-gray-700">{{ modal.message }}</p>
    </BaseModal>

    <!-- Header -->
    <div class="bg-gradient-to-r from-[#2C64E3] to-[#1e4bb8] text-white rounded-xl p-6 mb-8">
      <h1 class="text-3xl font-bold mb-2">📚 Manajemen Buku</h1>
      <p class="text-white/80">Kelola koleksi buku perpustakaan Anda</p>
    </div>

    <!-- Form Tambah / Edit Buku -->
    <div class="bg-white rounded-xl shadow-md p-6 mb-8">
      <div class="border-b pb-4 mb-6">
        <h2 class="text-xl font-bold text-gray-800 flex items-center gap-2">
          {{ editMode ? '✏️ Edit Buku' : '📖 Tambah Buku Baru' }}
        </h2>
      </div>
      
      <form @submit.prevent="submitForm" class="space-y-8">
        <!-- Informasi Dasar -->
        <div>
          <h3 class="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-[#2C64E3]">
            Informasi Dasar
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700">
                Kode Buku <span class="text-red-500">*</span>
              </label>
              <input 
                v-model="form.kode_buku" 
                type="text" 
                class="w-full py-2.5 px-4 border-2 border-gray-200 rounded-lg text-sm transition-all focus:outline-none focus:border-[#2C64E3] focus:ring-3 focus:ring-blue-100"
                placeholder="Masukkan kode buku" 
                required 
              />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700">
                Judul <span class="text-red-500">*</span>
              </label>
              <input 
                v-model="form.judul" 
                type="text" 
                class="w-full py-2.5 px-4 border-2 border-gray-200 rounded-lg text-sm transition-all focus:outline-none focus:border-[#2C64E3] focus:ring-3 focus:ring-blue-100"
                placeholder="Masukkan judul buku" 
                required 
              />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700">
                Penulis <span class="text-red-500">*</span>
              </label>
              <input 
                v-model="form.pembuat" 
                type="text" 
                class="w-full py-2.5 px-4 border-2 border-gray-200 rounded-lg text-sm transition-all focus:outline-none focus:border-[#2C64E3] focus:ring-3 focus:ring-blue-100"
                placeholder="Nama penulis" 
                required 
              />
            </div>
          </div>
        </div>

        <!-- Detail Publikasi -->
        <div>
          <h3 class="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-[#2C64E3]">
            Detail Publikasi
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700">Penerbit</label>
              <input 
                v-model="form.penerbit" 
                type="text" 
                class="w-full py-2.5 px-4 border-2 border-gray-200 rounded-lg text-sm transition-all focus:outline-none focus:border-[#2C64E3] focus:ring-3 focus:ring-blue-100"
                placeholder="Nama penerbit" 
              />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700">Bahasa</label>
              <input 
                v-model="form.bahasa_buku" 
                type="text" 
                class="w-full py-2.5 px-4 border-2 border-gray-200 rounded-lg text-sm transition-all focus:outline-none focus:border-[#2C64E3] focus:ring-3 focus:ring-blue-100"
                placeholder="Bahasa buku" 
              />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700">Tahun Rilis</label>
              <input 
                v-model="form.tahun_rilis" 
                type="number" 
                class="w-full py-2.5 px-4 border-2 border-gray-200 rounded-lg text-sm transition-all focus:outline-none focus:border-[#2C64E3] focus:ring-3 focus:ring-blue-100"
                placeholder="YYYY" 
              />
            </div>
          </div>
        </div>

        <!-- Klasifikasi -->
        <div>
          <h3 class="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b-2 border-[#2C64E3]">
            Klasifikasi
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700">ISBN / ISSN</label>
              <input 
                v-model="form.isbn_issn" 
                type="text" 
                class="w-full py-2.5 px-4 border-2 border-gray-200 rounded-lg text-sm transition-all focus:outline-none focus:border-[#2C64E3] focus:ring-3 focus:ring-blue-100"
                placeholder="Nomor ISBN/ISSN" 
              />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700">Kategori</label>
              <input 
                v-model="form.kategori" 
                type="text" 
                class="w-full py-2.5 px-4 border-2 border-gray-200 rounded-lg text-sm transition-all focus:outline-none focus:border-[#2C64E3] focus:ring-3 focus:ring-blue-100"
                placeholder="Kategori buku" 
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
            class="w-full py-2.5 px-4 border-2 border-gray-200 rounded-lg text-sm transition-all focus:outline-none focus:border-[#2C64E3] focus:ring-3 focus:ring-blue-100 resize-y"
            placeholder="Deskripsi singkat tentang buku ini..."
          ></textarea>
        </div>

        <!-- Stok dan Cover -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Stok</label>
            <input 
              v-model="form.stok" 
              type="number" 
              class="w-full py-2.5 px-4 border-2 border-gray-200 rounded-lg text-sm transition-all focus:outline-none focus:border-[#2C64E3] focus:ring-3 focus:ring-blue-100"
              placeholder="Jumlah stok" 
              min="0" 
            />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-gray-700">Cover Buku</label>
            <input 
              type="file" 
              @change="handleFileUpload" 
              accept="image/*"
              class="w-full py-2 px-4 border-2 border-gray-200 rounded-lg text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-[#2C64E3] hover:file:bg-blue-100 transition-all cursor-pointer"
            />
          </div>
        </div>

        <!-- Form Actions -->
        <div class="flex justify-end gap-4 pt-6 border-t border-gray-200">
          <button 
            type="button" 
            v-if="editMode" 
            @click="cancelEdit" 
            class="px-6 py-2.5 border-2 border-gray-300 rounded-lg text-gray-700 text-sm font-medium hover:bg-gray-50 transition-all flex items-center gap-2"
          >
            <span class="text-lg">✕</span>
            Batal
          </button>
          <button 
            type="submit" 
            class="px-6 py-2.5 bg-[#2C64E3] text-white rounded-lg text-sm font-medium hover:bg-[#1e4bb8] shadow-blue-100 shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2"
          >
            <span class="text-lg">{{ editMode ? '✓' : '+' }}</span>
            {{ editMode ? 'Update Buku' : 'Tambah Buku' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Tabel Buku -->
    <div class="bg-white rounded-xl shadow-md overflow-hidden">
      <!-- Table Header -->
      <div class="p-6 border-b border-gray-200 flex justify-between items-center">
        <h2 class="text-xl font-bold text-gray-800 flex items-center gap-2">
          <span class="text-2xl">📖</span>
          Daftar Buku
        </h2>
        <div class="bg-blue-50 text-[#2C64E3] px-4 py-1 rounded-full text-sm font-medium">
          {{ books.length }} Buku
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kode Buku</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Penulis</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Penerbit</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stok</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="book in books" :key="book.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                  {{ book.id }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                {{ book.kode_buku }}
              </td>
              <td class="px-6 py-4">
                <div class="text-gray-900 font-medium">{{ book.judul }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-600">
                {{ book.pembuat }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-600">
                {{ book.penerbit }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  :class="[
                    'px-3 py-1 rounded-full text-sm font-medium',
                    book.stok > 0 
                      ? 'bg-green-50 text-green-600' 
                      : 'bg-red-50 text-red-600'
                  ]"
                >
                  {{ book.stok }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex gap-2">
                  <button 
                    @click="editBook(book)" 
                    class="p-2 bg-[#2C64E3] text-white rounded-lg hover:bg-[#1e4bb8] transition-all"
                    title="Edit"
                  >
                    ✎
                  </button>
                  <button 
                    @click="confirmDelete(book.id)" 
                    class="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                    title="Hapus"
                  >
                    🗑
                  </button>
                </div>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-if="books.length === 0">
              <td colspan="7" class="px-6 py-16 text-center">
                <div class="flex flex-col items-center gap-4">
                  <span class="text-5xl opacity-20">📚</span>
                  <p class="text-gray-500 font-medium">Belum ada data buku</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import BaseModal from '@/components/admin/BaseModal.vue';
import BaseAlert from '@/components/admin/BaseAlert.vue';

const books = ref([]);
const editMode = ref(false);
const currentId = ref(null);
const pendingCallback = ref(null);

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
});

const alert = ref({
  show: false,
  type: 'info',
  message: ''
});

const modal = ref({
  show: false,
  title: '',
  message: '',
  confirmText: 'OK',
  cancelText: 'Batal',
  onConfirm: null
});

const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

const getAuthConfig = (additionalHeaders = {}) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      ...additionalHeaders
    }
  };
};

// Alert Functions
const showAlert = (message, type = 'info') => {
  alert.value = {
    show: true,
    type,
    message
  };
  setTimeout(() => {
    alert.value.show = false;
  }, 3000);
};

const showSuccess = (message) => showAlert(message, 'success');
const showError = (message) => showAlert(message, 'error');
const showWarning = (message) => showAlert(message, 'warning');

// Modal Functions
const showConfirmModal = (title, message, onConfirm) => {
  modal.value = {
    show: true,
    title,
    message,
    confirmText: 'Hapus',
    cancelText: 'Batal',
    onConfirm
  };
};

const getModalIcon = () => {
  const icons = {
    'alert': 'ℹ️',
    'success': '✓',
    'error': '✕',
    'confirm': '❓'
  };
  return icons[modal.value.type] || 'ℹ️';
};

const closeModal = () => {
  modal.value.show = false;
  pendingCallback.value = null;
};

const handleConfirm = () => {
  if (modal.value.type === 'confirm' && pendingCallback.value) {
    pendingCallback.value();
  }
  closeModal();
};

// Fetch data buku
const fetchBooks = async () => {
  try {
    const res = await axios.get(`${apiBase}/api/admin/books`, getAuthConfig());
    books.value = res.data;
  } catch (err) {
    console.error('❌ Error fetching books:', err);
    if (err.response?.status === 401 || err.response?.status === 403) {
      localStorage.removeItem('token');
      showError('Error', 'Session expired. Please login again.');
    }
  }
};

onMounted(fetchBooks);

const handleFileUpload = (event) => {
  form.value.cover = event.target.files[0];
};

const submitForm = async () => {
  try {
    const formData = new FormData();
    Object.keys(form.value).forEach((key) => {
      formData.append(key, form.value[key]);
    });

    const config = getAuthConfig({ "Content-Type": "multipart/form-data" });

    if (editMode.value) {
      await axios.put(
        `${apiBase}/api/admin/books/${currentId.value}`,
        formData,
        config
      );
      showSuccess('Sukses', 'Buku berhasil diperbarui!');
    } else {
      await axios.post(`${apiBase}/api/admin/books`, formData, config);
      showSuccess('Sukses', 'Buku berhasil ditambahkan!');
    }

    await fetchBooks();
    cancelEdit();
  } catch (err) {
    console.error('❌ Error submitting form:', err);
    if (err.response?.status === 401 || err.response?.status === 403) {
      localStorage.removeItem('token');
      showError('Error', 'Unauthorized access');
    } else {
      showError('Error', 'Gagal menyimpan data buku');
    }
  }
};

const editBook = (book) => {
  editMode.value = true;
  currentId.value = book.id;
  Object.assign(form.value, book);
};

const cancelEdit = () => {
  editMode.value = false;
  currentId.value = null;
  form.value = {
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
  };
};

const confirmDelete = (id) => {
  showConfirm('Hapus Buku', 'Apakah Anda yakin ingin menghapus buku ini?', () => {
    deleteBook(id);
  });
};

const deleteBook = async (id) => {
  try {
    await axios.delete(`${apiBase}/api/admin/books/${id}`, getAuthConfig());
    showSuccess('Sukses', 'Buku berhasil dihapus!');
    fetchBooks();
  } catch (err) {
    console.error('❌ Error deleting book:', err);
    if (err.response?.status === 401 || err.response?.status === 403) {
      localStorage.removeItem('token');
      showError('Error', 'Unauthorized access');
    } else {
      showError('Error', 'Gagal menghapus buku');
    }
  }
};
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-20px);
  opacity: 0;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
</style>