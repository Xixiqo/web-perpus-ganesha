<template>
  <div class="books-admin container p-4">
    <h2 class="mb-4">Manajemen Buku</h2>

    <!-- Form Tambah / Edit Buku -->
    <div class="card mb-4 p-4">
      <h5>{{ editMode ? 'Edit Buku' : 'Tambah Buku Baru' }}</h5>
      <form @submit.prevent="submitForm">
        <div class="row">
          <div class="col-md-4 mb-2">
            <label>Kode Buku</label>
            <input v-model="form.kode_buku" type="text" class="form-control" required />
          </div>
          <div class="col-md-4 mb-2">
            <label>Judul</label>
            <input v-model="form.judul" type="text" class="form-control" required />
          </div>
          <div class="col-md-4 mb-2">
            <label>Pembuat</label>
            <input v-model="form.pembuat" type="text" class="form-control" required />
          </div>
        </div>

        <div class="row">
          <div class="col-md-4 mb-2">
            <label>Penerbit</label>
            <input v-model="form.penerbit" type="text" class="form-control" />
          </div>
          <div class="col-md-4 mb-2">
            <label>Bahasa</label>
            <input v-model="form.bahasa_buku" type="text" class="form-control" />
          </div>
          <div class="col-md-4 mb-2">
            <label>Tahun Rilis</label>
            <input v-model="form.tahun_rilis" type="number" class="form-control" />
          </div>
        </div>

        <div class="row">
          <div class="col-md-6 mb-2">
            <label>ISBN / ISSN</label>
            <input v-model="form.isbn_issn" type="text" class="form-control" />
          </div>
          <div class="col-md-6 mb-2">
            <label>Kategori</label>
            <input v-model="form.kategori" type="text" class="form-control" />
          </div>
        </div>

        <div class="mb-2">
          <label>Sinopsis</label>
          <textarea v-model="form.sinopsis" class="form-control" rows="3"></textarea>
        </div>

        <div class="mb-2">
          <label>Stok</label>
          <input v-model="form.stok" type="number" class="form-control" />
        </div>

        <div class="mb-2">
          <label>Cover</label>
          <input type="file" @change="handleFileUpload" class="form-control" />
        </div>

        <button type="submit" class="btn btn-primary">{{ editMode ? 'Update' : 'Tambah Buku' }}</button>
        <button type="button" v-if="editMode" @click="cancelEdit" class="btn btn-secondary ms-2">Batal</button>
      </form>
    </div>

    <!-- Tabel Buku -->
    <div class="card p-4">
      <h5>Daftar Buku</h5>
      <table class="table table-striped mt-3">
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
          <tr v-for="book in books" :key="book.id">
            <td>{{ book.id }}</td>
            <td>{{ book.kode_buku }}</td>
            <td>{{ book.judul }}</td>
            <td>{{ book.pembuat }}</td>
            <td>{{ book.penerbit }}</td>
            <td>{{ book.stok }}</td>
            <td>
              <button class="btn btn-sm btn-warning me-2" @click="editBook(book)">Edit</button>
              <button class="btn btn-sm btn-danger" @click="deleteBook(book.id)">Hapus</button>
            </td>
          </tr>
        </tbody>
      </table>
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

// Fetch data buku dari backend
const fetchBooks = async () => {
  const res = await axios.get("http://localhost:5000/api/books");
  books.value = res.data;
};

onMounted(fetchBooks);

// Upload file
const handleFileUpload = (event) => {
  form.value.cover = event.target.files[0];
};

// Submit form
const submitForm = async () => {
  const formData = new FormData();
  Object.keys(form.value).forEach((key) => {
    formData.append(key, form.value[key]);
  });

  if (editMode.value) {
    await axios.put(`http://localhost:5000/api/books/${currentId.value}`, formData);
  } else {
    await axios.post("http://localhost:5000/api/books", formData);
  }

  fetchBooks();
  cancelEdit();
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
    await axios.delete(`http://localhost:5000/api/books/${id}`);
    fetchBooks();
  }
};
</script>

<style scoped>
.books-admin .card {
  margin-bottom: 20px;
}
</style>
