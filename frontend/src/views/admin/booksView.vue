<template>
  <div class="books-admin">
    <div class="admin-header">
      <h2 class="admin-title">Manajemen Buku</h2>
      <p class="admin-subtitle">Kelola koleksi buku perpustakaan Anda</p>
    </div>

    <!-- Form Tambah / Edit Buku -->
    <div class="form-card">
      <div class="form-header">
        <h5 class="form-title">
          <span class="icon">📚</span>
          {{ editMode ? 'Edit Buku' : 'Tambah Buku Baru' }}
        </h5>
      </div>
      <form @submit.prevent="submitForm" class="book-form">
        <div class="form-section">
          <h6 class="section-title">Informasi Dasar</h6>
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Kode Buku <span class="required">*</span></label>
              <input v-model="form.kode_buku" type="text" class="form-input" placeholder="Masukkan kode buku" required />
            </div>
            <div class="form-group">
              <label class="form-label">Judul <span class="required">*</span></label>
              <input v-model="form.judul" type="text" class="form-input" placeholder="Masukkan judul buku" required />
            </div>
            <div class="form-group">
              <label class="form-label">Pembuat <span class="required">*</span></label>
              <input v-model="form.pembuat" type="text" class="form-input" placeholder="Nama penulis" required />
            </div>
          </div>
        </div>

        <div class="form-section">
          <h6 class="section-title">Detail Publikasi</h6>
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Penerbit</label>
              <input v-model="form.penerbit" type="text" class="form-input" placeholder="Nama penerbit" />
            </div>
            <div class="form-group">
              <label class="form-label">Bahasa</label>
              <input v-model="form.bahasa_buku" type="text" class="form-input" placeholder="Bahasa buku" />
            </div>
            <div class="form-group">
              <label class="form-label">Tahun Rilis</label>
              <input v-model="form.tahun_rilis" type="number" class="form-input" placeholder="YYYY" />
            </div>
          </div>
        </div>

        <div class="form-section">
          <h6 class="section-title">Klasifikasi</h6>
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">ISBN / ISSN</label>
              <input v-model="form.isbn_issn" type="text" class="form-input" placeholder="Nomor ISBN/ISSN" />
            </div>
            <div class="form-group">
              <label class="form-label">Kategori</label>
              <input v-model="form.kategori" type="text" class="form-input" placeholder="Kategori buku" />
            </div>
          </div>
        </div>

        <div class="form-section">
          <div class="form-group">
            <label class="form-label">Sinopsis</label>
            <textarea v-model="form.sinopsis" class="form-textarea" rows="4" placeholder="Deskripsi singkat tentang buku ini..."></textarea>
          </div>
        </div>

        <div class="form-section">
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">Stok</label>
              <input v-model="form.stok" type="number" class="form-input" placeholder="Jumlah stok" min="0" />
            </div>
            <div class="form-group">
              <label class="form-label">Cover Buku</label>
              <input type="file" @change="handleFileUpload" class="form-input-file" accept="image/*" />
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" v-if="editMode" @click="cancelEdit" class="btn btn-secondary">
            <span class="btn-icon">✕</span>
            Batal
          </button>
          <button type="submit" class="btn btn-primary">
            <span class="btn-icon">{{ editMode ? '✓' : '+' }}</span>
            {{ editMode ? 'Update Buku' : 'Tambah Buku' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Tabel Buku -->
    <div class="table-card">
      <div class="table-header">
        <h5 class="table-title">
          <span class="icon">📖</span>
          Daftar Buku
        </h5>
        <div class="table-info">
          <span class="badge">{{ books.length }} Buku</span>
        </div>
      </div>
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Kode Buku</th>
              <th>Judul</th>
              <th>Pembuat</th>
              <th>Penerbit</th>
              <th>Stok</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="book in books" :key="book.id" class="table-row">
              <td><span class="id-badge">{{ book.id }}</span></td>
              <td><strong>{{ book.kode_buku }}</strong></td>
              <td class="book-title">{{ book.judul }}</td>
              <td>{{ book.pembuat }}</td>
              <td>{{ book.penerbit }}</td>
              <td>
                <span class="stock-badge" :class="book.stok > 0 ? 'in-stock' : 'out-stock'">
                  {{ book.stok }}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <button class="btn-action btn-edit" @click="editBook(book)" title="Edit">
                    <span>✎</span>
                  </button>
                  <button class="btn-action btn-delete" @click="deleteBook(book.id)" title="Hapus">
                    <span>🗑</span>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="books.length === 0">
              <td colspan="7" class="empty-state">
                <div class="empty-content">
                  <span class="empty-icon">📚</span>
                  <p>Belum ada data buku</p>
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

const books = ref([]);
const editMode = ref(false);
const currentId = ref(null);
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

// 🔴 Ambil API Base dari environment variable
const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

// 🔴 Function untuk mendapatkan config dengan Authorization header
const getAuthConfig = (additionalHeaders = {}) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      ...additionalHeaders
    }
  };
};

// Fetch data buku dari backend
const fetchBooks = async () => {
  try {
    const res = await axios.get(`${apiBase}/api/admin/books`, getAuthConfig());
    books.value = res.data;
  } catch (err) {
    console.error('❌ Error fetching books:', err);
    // Jika unauthorized, redirect ke login atau hapus token
    if (err.response?.status === 401 || err.response?.status === 403) {
      localStorage.removeItem('token');
      // Optional: redirect ke halaman login
      // window.location.href = '/login';
    }
  }
};

onMounted(fetchBooks);

// Upload file
const handleFileUpload = (event) => {
  form.value.cover = event.target.files[0];
};

// Submit form
const submitForm = async () => {
  try {
    const formData = new FormData();
    Object.keys(form.value).forEach((key) => {
      formData.append(key, form.value[key]);
    });

    // 🔴 Config untuk multipart/form-data dengan Authorization
    const config = getAuthConfig({ "Content-Type": "multipart/form-data" });

    if (editMode.value) {
      await axios.put(
        `${apiBase}/api/admin/books/${currentId.value}`,
        formData,
        config
      );
    } else {
      await axios.post(`${apiBase}/api/admin/books`, formData, config);
    }

    await fetchBooks();
    cancelEdit();
  } catch (err) {
    console.error('❌ Error submitting form:', err);
    if (err.response?.status === 401 || err.response?.status === 403) {
      localStorage.removeItem('token');
    }
  }
};

// Edit
const editBook = (book) => {
  editMode.value = true;
  currentId.value = book.id;
  Object.assign(form.value, book);
};

// Cancel edit
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

// Delete
const deleteBook = async (id) => {
  if (confirm("Apakah yakin ingin menghapus buku ini?")) {
    try {
      await axios.delete(`${apiBase}/api/admin/books/${id}`, getAuthConfig());
      fetchBooks();
    } catch (err) {
      console.error('❌ Error deleting book:', err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        localStorage.removeItem('token');
      }
    }
  }
};
</script>

<style scoped>
/* Container Utama */
.books-admin {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  background: #ffffff;
  min-height: 100vh;
}

/* Header */
.admin-header {
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 3px solid #2C64E3;
}

.admin-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 0.5rem 0;
}

.admin-subtitle {
  color: #666;
  margin: 0;
  font-size: 1rem;
}

/* Card Styles */
.form-card,
.table-card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
  overflow: hidden;
  border: 1px solid #e5e7eb;
}

.form-header,
.table-header {
  background: linear-gradient(135deg, #2C64E3 0%, #1e4bb8 100%);
  padding: 1.5rem;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-title,
.table-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
}

.icon {
  font-size: 1.5rem;
}

/* Form Styles */
.book-form {
  padding: 2rem;
}

.form-section {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.form-section:last-of-type {
  border-bottom: none;
  margin-bottom: 0;
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
}

.section-title::before {
  content: '';
  width: 4px;
  height: 1rem;
  background: #2C64E3;
  margin-right: 0.5rem;
  border-radius: 2px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.form-grid-2 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.required {
  color: #ef4444;
}

.form-input,
.form-textarea,
.form-input-file {
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  background: #ffffff;
  color: #1a1a1a;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #2C64E3;
  box-shadow: 0 0 0 3px rgba(44, 100, 227, 0.1);
}

.form-input::placeholder,
.form-textarea::placeholder {
  color: #9ca3af;
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.form-input-file {
  padding: 0.5rem;
  cursor: pointer;
}

.form-input-file::-webkit-file-upload-button {
  padding: 0.5rem 1rem;
  background: #f3f4f6;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  color: #374151;
  transition: background 0.3s ease;
}

.form-input-file::-webkit-file-upload-button:hover {
  background: #e5e7eb;
}

/* Buttons */
.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 2px solid #e5e7eb;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn-icon {
  font-size: 1.1rem;
}

.btn-primary {
  background: #2C64E3;
  color: white;
}

.btn-primary:hover {
  background: #1e4bb8;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(44, 100, 227, 0.3);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn-secondary {
  background: #6b7280;
  color: white;
}

.btn-secondary:hover {
  background: #4b5563;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(107, 114, 128, 0.3);
}

/* Table Styles */
.table-info {
  display: flex;
  gap: 0.5rem;
}

.badge {
  background: rgba(255, 255, 255, 0.2);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
}

.table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

.data-table thead {
  background: #f9fafb;
  border-bottom: 2px solid #e5e7eb;
}

.data-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.data-table td {
  padding: 1rem;
  color: #1f2937;
  font-size: 0.95rem;
}

.table-row {
  border-bottom: 1px solid #e5e7eb;
  transition: background 0.2s ease;
}

.table-row:hover {
  background: #f9fafb;
}

.id-badge {
  background: #e5e7eb;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-weight: 600;
  color: #4b5563;
  font-size: 0.875rem;
}

.book-title {
  font-weight: 500;
  color: #1f2937;
}

.stock-badge {
  display: inline-block;
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.875rem;
}

.stock-badge.in-stock {
  background: #d1fae5;
  color: #065f46;
}

.stock-badge.out-stock {
  background: #fee2e2;
  color: #991b1b;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn-action {
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-edit {
  background: #2C64E3;
  color: white;
}

.btn-edit:hover {
  background: #1e4bb8;
  transform: scale(1.1);
}

.btn-delete {
  background: #ef4444;
  color: white;
}

.btn-delete:hover {
  background: #dc2626;
  transform: scale(1.1);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
}

.empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: #9ca3af;
}

.empty-icon {
  font-size: 3rem;
  opacity: 0.5;
}

.empty-content p {
  margin: 0;
  font-size: 1rem;
  font-weight: 500;
}

/* Responsive */
@media (max-width: 768px) {
  .books-admin {
    padding: 1rem;
  }

  .admin-title {
    font-size: 1.5rem;
  }

  .form-grid,
  .form-grid-2 {
    grid-template-columns: 1fr;
  }

  .book-form {
    padding: 1rem;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }

  .table-container {
    overflow-x: scroll;
  }

  .data-table {
    min-width: 800px;
  }
}
</style>