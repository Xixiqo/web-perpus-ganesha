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

    <!-- Book Form Modal -->
    <BookFormModal
      v-if="showBookForm"
      :book-data="currentBook"
      :is-edit="editMode"
      @close="closeBookForm"
      @submit="submitBookForm"
    />

    <!-- Header -->
    <div class="bg-white rounded-xl p-6 mb-8 shadow-md border border-gray-100">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold mb-2 text-gray-800">📚 Manajemen Buku</h1>
          <p class="text-gray-600">Kelola koleksi buku perpustakaan Anda</p>
        </div>
        <button
          @click="openAddBookForm"
          class="px-6 py-3 bg-[#2C64F9] text-white rounded-lg text-sm font-bold hover:bg-[#1e4fd6] shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2 self-start md:self-auto"
        >
          <span class="text-lg">+</span>
          Tambah Buku Baru
        </button>
      </div>
    </div>

    <!-- Tabel Buku -->
    <div class="bg-white rounded-xl shadow-md overflow-hidden">
      <!-- Table Header with Search -->
      <div class="p-6 border-b border-gray-200">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <h2 class="text-xl font-bold text-gray-800 flex items-center gap-2">
              <span class="text-2xl">📖</span>
              Daftar Buku
            </h2>
            <div class="bg-blue-50 text-[#2C64E3] px-4 py-1 rounded-full text-sm font-medium">
              {{ filteredBooks.length }} Buku
            </div>
          </div>

          <div class="flex items-center gap-3">
            <!-- Items Per Page -->
            <div class="flex items-center gap-2">
              <label class="text-sm text-gray-600">Tampilkan:</label>
              <select 
                v-model="itemsPerPage"
                @change="changeItemsPerPage(itemsPerPage)"
                class="px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#2C64E3] focus:ring-2 focus:ring-blue-100"
              >
                <option :value="10">10</option>
                <option :value="25">25</option>
                <option :value="50">50</option>
                <option :value="100">100</option>
              </select>
            </div>

            <!-- Search Bar -->
            <div class="relative w-full md:w-80">
              <input 
                v-model="searchQuery"
                type="text" 
                placeholder="Cari buku..."
                class="w-full py-2.5 pl-4 pr-12 border-2 border-gray-200 rounded-full text-sm transition-all focus:outline-none focus:border-[#2C64E3] focus:ring-3 focus:ring-blue-100 focus:shadow-md"
              />
              <svg 
                class="absolute right-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-blue-600 pointer-events-none" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                stroke-width="2" 
                stroke-linecap="round" 
                stroke-linejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kode Buku</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cover</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Penulis</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Penerbit</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bahasa</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stok</th>
              <th class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="book in paginatedBooks" :key="book.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{{ book.kode_buku }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="w-12 h-16 flex items-center justify-center">
                  <img 
                    v-if="book.cover"
                    :src="getCoverUrl(book.cover)" 
                    :alt="book.judul"
                    class="w-full h-full object-cover rounded shadow-sm"
                    @error="handleImageError"
                  />
                  <div v-else class="w-full h-full bg-gray-100 rounded flex items-center justify-center">
                    <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                    </svg>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-gray-900 font-medium">{{ book.judul }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-600">{{ book.pembuat }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-600">{{ book.penerbit }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-600">{{ book.kategori || '-' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-gray-600">
                <span class="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs font-medium">
                  {{ book.bahasa_buku || '-' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="[
                  'px-3 py-1 rounded-full text-sm font-medium',
                  book.stok > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                ]">{{ book.stok }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex gap-2">
                  <button
                    @click="editBook(book)"
                    class="p-2 text-[#2C64F9] hover:bg-blue-50 rounded-lg transition"
                    title="Edit"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    @click="confirmDelete(book.id)"
                    class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Hapus"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="paginatedBooks.length === 0">
              <td colspan="9" class="px-6 py-16 text-center">
                <div class="flex flex-col items-center gap-4">
                  <span class="text-5xl opacity-20">📚</span>
                  <p class="text-gray-500 font-medium">
                    {{ searchQuery ? 'Tidak ada buku yang ditemukan' : 'Belum ada data buku' }}
                  </p>
                  <button
                    v-if="!searchQuery"
                    @click="openAddBookForm"
                    class="px-6 py-2 bg-[#2C64F9] text-white rounded-lg text-sm font-medium hover:bg-[#1e4fd6] transition"
                  >
                    + Tambah Buku Pertama
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="filteredBooks.length > 0" class="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
        <p class="text-sm text-gray-600">
          Menampilkan {{ paginationInfo.start }} - {{ paginationInfo.end }} dari {{ paginationInfo.total }} buku
        </p>
        <div class="flex items-center space-x-2">
          <button
            @click="changePage(currentPage - 1)"
            :disabled="currentPage === 1"
            :class="currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'"
            class="px-4 py-2 border rounded-lg transition"
          >
            Previous
          </button>
          
          <!-- Page Numbers -->
          <div class="flex items-center space-x-1">
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="changePage(page)"
              :class="[
                'px-3 py-2 rounded-lg transition',
                page === currentPage 
                  ? 'bg-[#2C64F9] text-white font-medium' 
                  : 'hover:bg-gray-200 text-gray-700'
              ]"
            >
              {{ page }}
            </button>
          </div>

          <button
            @click="changePage(currentPage + 1)"
            :disabled="currentPage >= totalPages"
            :class="currentPage >= totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200'"
            class="px-4 py-2 border rounded-lg transition"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import BaseModal from '@/components/admin/BaseModal.vue';
import BaseAlert from '@/components/admin/BaseAlert.vue';
import BookFormModal from '@/components/admin/BookFormModal.vue';

const books = ref([]);
const searchQuery = ref("");
const editMode = ref(false);
const currentBook = ref(null);
const showBookForm = ref(false);
const currentPage = ref(1);
const itemsPerPage = ref(10);

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

// Helper function untuk mendapatkan URL cover
const getCoverUrl = (filename) => {
  if (!filename) return '/default_cover.png';
  if (/^https?:\/\//i.test(filename)) return filename;
  return `${apiBase}/uploads/${filename}`;
};

// Handle image error
const handleImageError = (e) => {
  e.target.onerror = null;
  e.target.src = '/default_cover.png';
};

// Computed property untuk filter buku berdasarkan search
const filteredBooks = computed(() => {
  if (!searchQuery.value.trim()) {
    return books.value;
  }
  
  const query = searchQuery.value.toLowerCase();
  return books.value.filter(book => {
    return (
      book.kode_buku?.toLowerCase().includes(query) ||
      book.judul?.toLowerCase().includes(query) ||
      book.pembuat?.toLowerCase().includes(query) ||
      book.penerbit?.toLowerCase().includes(query) ||
      book.kategori?.toLowerCase().includes(query) ||
      book.bahasa_buku?.toLowerCase().includes(query) ||
      book.slug?.toLowerCase().includes(query)
    );
  });
});

// Pagination computed properties
const totalPages = computed(() => {
  return Math.ceil(filteredBooks.value.length / itemsPerPage.value);
});

const paginatedBooks = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredBooks.value.slice(start, end);
});

const paginationInfo = computed(() => {
  const start = filteredBooks.value.length === 0 ? 0 : (currentPage.value - 1) * itemsPerPage.value + 1;
  const end = Math.min(currentPage.value * itemsPerPage.value, filteredBooks.value.length);
  const total = filteredBooks.value.length;
  return { start, end, total };
});

const visiblePages = computed(() => {
  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages.value, start + maxVisible - 1);
  
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  
  return pages;
});

// Pagination functions
const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const changeItemsPerPage = (value) => {
  itemsPerPage.value = parseInt(value);
  currentPage.value = 1; // Reset ke halaman pertama
};

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

// Fetch data buku
const fetchBooks = async () => {
  try {
    const res = await axios.get(`${apiBase}/api/admin/books`, getAuthConfig());
    books.value = res.data;
  } catch (err) {
    console.error('❌ Error fetching books:', err);
    if (err.response?.status === 401 || err.response?.status === 403) {
      localStorage.removeItem('token');
      showError('Session expired. Please login again.');
    }
  }
};

onMounted(fetchBooks);

// Open add book form
const openAddBookForm = () => {
  editMode.value = false;
  currentBook.value = null;
  showBookForm.value = true;
};

// Edit book
const editBook = (book) => {
  editMode.value = true;
  currentBook.value = { ...book };
  showBookForm.value = true;
};

// Close book form
const closeBookForm = () => {
  showBookForm.value = false;
  editMode.value = false;
  currentBook.value = null;
};

// Submit book form
const submitBookForm = async (formData) => {
  try {
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null && formData[key] !== undefined) {
        data.append(key, formData[key]);
      }
    });

    const config = getAuthConfig({ "Content-Type": "multipart/form-data" });

    if (editMode.value) {
      await axios.put(
        `${apiBase}/api/admin/books/${currentBook.value.id}`,
        data,
        config
      );
      showSuccess('Buku berhasil diperbarui!');
    } else {
      await axios.post(`${apiBase}/api/admin/books`, data, config);
      showSuccess('Buku berhasil ditambahkan!');
    }

    await fetchBooks();
    closeBookForm();
  } catch (err) {
    console.error('❌ Error submitting form:', err);
    if (err.response?.status === 401 || err.response?.status === 403) {
      localStorage.removeItem('token');
      showError('Unauthorized access');
    } else {
      showError(err.response?.data?.message || 'Gagal menyimpan data buku');
    }
    throw err; // Re-throw to keep modal open
  }
};

// Confirm delete
const confirmDelete = (id) => {
  showConfirmModal('Hapus Buku', 'Apakah Anda yakin ingin menghapus buku ini? Data yang dihapus tidak dapat dikembalikan.', () => {
    deleteBook(id);
  });
};

// Delete book
const deleteBook = async (id) => {
  try {
    await axios.delete(`${apiBase}/api/admin/books/${id}`, getAuthConfig());
    showSuccess('Buku berhasil dihapus!');
    fetchBooks();

    modal.value.show = false;
  } catch (err) {
    console.error('❌ Error deleting book:', err);
    if (err.response?.status === 401 || err.response?.status === 403) {
      localStorage.removeItem('token');
      showError('Unauthorized access');
    } else {
      showError('Gagal menghapus buku');
    }

    modal.value.show = false;
  }
};
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}
</style>