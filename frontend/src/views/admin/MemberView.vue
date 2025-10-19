<template>
  <div class="manage-members">
    <div class="header">
      <h1>Kelola Anggota & Pengguna</h1>
      <button @click="openAddModal" class="btn-primary">
        <i class="icon-plus"></i> Tambah User & Anggota
      </button>
    </div>

    <!-- Search & Filter Section -->
    <div class="search-filter-container">
      <div class="search-box">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Cari berdasarkan username, nama, NIS/NIP..."
          class="search-input"
        />
        <i class="icon-search">🔍</i>
      </div>

      <div class="filters">
        <div class="filter-group">
          <label>Role:</label>
          <select v-model="filterRole" class="filter-select">
            <option value="">Semua Role</option>
            <option value="siswa">Siswa</option>
            <option value="pustakawan">Pustakawan</option>
            <option value="superadmin">Super Admin</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Tipe Keanggotaan:</label>
          <select v-model="filterTipeKeanggotaan" class="filter-select">
            <option value="">Semua Tipe</option>
            <option value="siswa">Siswa</option>
            <option value="guru">Guru</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Status Member:</label>
          <select v-model="filterStatus" class="filter-select">
            <option value="">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="expired">Expired</option>
          </select>
        </div>

        <button @click="resetFilters" class="btn-reset">
          Reset Filter
        </button>
      </div>
    </div>

    <!-- Result Info -->
    <div class="result-info">
      <p>Menampilkan {{ filteredUsers.length }} dari {{ users.length }} data</p>
    </div>

    <!-- Tabel Users & Anggota -->
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Role</th>
            <th>NIS/NIP</th>
            <th>Nama Lengkap</th>
            <th>Jenis Kelamin</th>
            <th>Tipe Keanggotaan</th>
            <th>Institute</th>
            <th>Expired</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.username }}</td>
            <td>
              <span :class="'badge badge-' + user.role">
                {{ user.role }}
              </span>
            </td>
            <td>{{ user.nis_nip || '-' }}</td>
            <td>{{ user.nama || '-' }}</td>
            <td>{{ user.jenis_kelamin || '-' }}</td>
            <td>{{ user.tipe_keanggotaan || '-' }}</td>
            <td>{{ user.institute || '-' }}</td>
            <td>
              <span v-if="user.member_expired" :class="isExpired(user.member_expired) ? 'expired' : 'active'">
                {{ formatDate(user.member_expired) }}
              </span>
              <span v-else>-</span>
            </td>
            <td>
              <button @click="openEditModal(user)" class="btn-edit">Edit</button>
              <button @click="deleteUser(user.id)" class="btn-delete">Hapus</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="filteredUsers.length === 0" class="empty-state">
        <p>{{ users.length === 0 ? 'Belum ada data user' : 'Tidak ada data yang sesuai dengan pencarian' }}</p>
      </div>
    </div>

    <!-- Modal Add/Edit -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <div class="modal-header">
          <h2>{{ isEditMode ? 'Edit User & Anggota' : 'Tambah User & Anggota' }}</h2>
          <button @click="closeModal" class="btn-close">&times;</button>
        </div>

        <form @submit.prevent="submitForm" class="modal-body">
          <!-- Data User -->
          <div class="section">
            <h3>Data Login</h3>
            <div class="form-group">
              <label>Username *</label>
              <input v-model="formData.username" type="text" required />
            </div>

            <div class="form-group">
              <label>Password {{ isEditMode ? '(kosongkan jika tidak diubah)' : '*' }}</label>
              <input v-model="formData.password" type="password" :required="!isEditMode" />
            </div>

            <div class="form-group">
              <label>Role *</label>
              <select v-model="formData.role" required>
                <option value="siswa">Siswa</option>
                <option value="pustakawan">Pustakawan</option>
                <option value="superadmin">Super Admin</option>
              </select>
            </div>
          </div>

          <!-- Data Anggota -->
          <div class="section">
            <h3>Data Anggota</h3>
            <div class="form-row">
              <div class="form-group">
                <label>NIS/NIP</label>
                <input v-model="formData.nis_nip" type="text" />
              </div>

              <div class="form-group">
                <label>Nama Lengkap</label>
                <input v-model="formData.nama" type="text" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Jenis Kelamin</label>
                <select v-model="formData.jenis_kelamin">
                  <option value="">Pilih</option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>

              <div class="form-group">
                <label>Tanggal Lahir</label>
                <input v-model="formData.tanggal_lahir" type="date" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Tipe Keanggotaan</label>
                <select v-model="formData.tipe_keanggotaan">
                  <option value="">Pilih</option>
                  <option value="siswa">Siswa</option>
                  <option value="guru">Guru</option>
                </select>
              </div>

              <div class="form-group">
                <label>Member Expired</label>
                <input v-model="formData.member_expired" type="date" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Institute</label>
                <input v-model="formData.institute" type="text" placeholder="Nama Sekolah/Instansi" />
              </div>

              <div class="form-group">
                <label>Jurusan/Major</label>
                <input v-model="formData.major" type="text" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Angkatan</label>
                <input v-model="formData.angkatan" type="text" />
              </div>

              <div class="form-group">
                <label>No. Telepon</label>
                <input v-model="formData.no_telp" type="text" />
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" @click="closeModal" class="btn-secondary">Batal</button>
            <button type="submit" class="btn-primary">
              {{ isEditMode ? 'Update' : 'Simpan' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      users: [],
      showModal: false,
      isEditMode: false,
      searchQuery: '',
      filterRole: '',
      filterTipeKeanggotaan: '',
      filterStatus: '',
      formData: {
        id: null,
        username: '',
        password: '',
        role: 'siswa',
        nis_nip: '',
        nama: '',
        jenis_kelamin: '',
        tanggal_lahir: '',
        member_expired: '',
        institute: '',
        major: '',
        angkatan: '',
        tipe_keanggotaan: '',
        no_telp: ''
      },
      // 🔴 API Base dari environment variable
      apiBase: import.meta.env.VITE_API_BASE || 'http://localhost:5000'
    };
  },
  computed: {
    filteredUsers() {
      let filtered = this.users;

      // Filter berdasarkan search query
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(user => {
          return (
            (user.username && user.username.toLowerCase().includes(query)) ||
            (user.nama && user.nama.toLowerCase().includes(query)) ||
            (user.nis_nip && user.nis_nip.toLowerCase().includes(query)) ||
            (user.institute && user.institute.toLowerCase().includes(query))
          );
        });
      }

      // Filter berdasarkan role
      if (this.filterRole) {
        filtered = filtered.filter(user => user.role === this.filterRole);
      }

      // Filter berdasarkan tipe keanggotaan
      if (this.filterTipeKeanggotaan) {
        filtered = filtered.filter(user => user.tipe_keanggotaan === this.filterTipeKeanggotaan);
      }

      // Filter berdasarkan status member
      if (this.filterStatus) {
        filtered = filtered.filter(user => {
          if (this.filterStatus === 'active') {
            return user.member_expired && !this.isExpired(user.member_expired);
          } else if (this.filterStatus === 'expired') {
            return user.member_expired && this.isExpired(user.member_expired);
          }
          return true;
        });
      }

      return filtered;
    }
  },
  mounted() {
    this.fetchUsers();
  },
  methods: {
    // 🔴 Method untuk mendapatkan config dengan Authorization header
    getAuthConfig() {
      const token = localStorage.getItem('token');
      return {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
    },

    // 🔴 Error handler untuk unauthorized
    handleUnauthorized(response) {
      if (response.status === 401 || response.status === 403) {
        console.error('⚠️ Unauthorized - Token invalid atau expired');
        localStorage.removeItem('token');
        // Optional: redirect ke login
        // window.location.href = '/login';
      }
    },

    async fetchUsers() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${this.apiBase}/api/admin/users`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          this.users = await response.json();
          console.log('✅ Users fetched successfully');
        } else {
          this.handleUnauthorized(response);
          console.error('❌ Failed to fetch users');
          alert('Gagal mengambil data users');
        }
      } catch (error) {
        console.error('❌ Error fetching users:', error);
        alert('Gagal mengambil data users');
      }
    },

    resetFilters() {
      this.searchQuery = '';
      this.filterRole = '';
      this.filterTipeKeanggotaan = '';
      this.filterStatus = '';
    },

    openAddModal() {
      this.isEditMode = false;
      this.resetForm();
      this.showModal = true;
    },

    openEditModal(user) {
      this.isEditMode = true;
      this.formData = {
        id: user.id,
        username: user.username,
        password: '',
        role: user.role,
        nis_nip: user.nis_nip || '',
        nama: user.nama || '',
        jenis_kelamin: user.jenis_kelamin || '',
        tanggal_lahir: user.tanggal_lahir || '',
        member_expired: user.member_expired || '',
        institute: user.institute || '',
        major: user.major || '',
        angkatan: user.angkatan || '',
        tipe_keanggotaan: user.tipe_keanggotaan || '',
        no_telp: user.no_telp || ''
      };
      this.showModal = true;
    },

    closeModal() {
      this.showModal = false;
      this.resetForm();
    },

    resetForm() {
      this.formData = {
        id: null,
        username: '',
        password: '',
        role: 'siswa',
        nis_nip: '',
        nama: '',
        jenis_kelamin: '',
        tanggal_lahir: '',
        member_expired: '',
        institute: '',
        major: '',
        angkatan: '',
        tipe_keanggotaan: '',
        no_telp: ''
      };
    },

    async submitForm() {
      try {
        const url = this.isEditMode 
          ? `${this.apiBase}/api/admin/users/${this.formData.id}` 
          : `${this.apiBase}/api/admin/users`;
        
        const method = this.isEditMode ? 'PUT' : 'POST';
        const token = localStorage.getItem('token');

        const response = await fetch(url, {
          method,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.formData)
        });

        const result = await response.json();

        if (response.ok) {
          alert(result.message);
          this.closeModal();
          this.fetchUsers();
          console.log('✅ User saved successfully');
        } else {
          this.handleUnauthorized(response);
          alert(result.message || 'Terjadi kesalahan');
        }
      } catch (error) {
        console.error('❌ Error submitting form:', error);
        alert('Gagal menyimpan data');
      }
    },

    async deleteUser(id) {
      if (!confirm('Apakah Anda yakin ingin menghapus user ini?')) return;

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${this.apiBase}/api/admin/users/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const result = await response.json();

        if (response.ok) {
          alert(result.message);
          this.fetchUsers();
          console.log('✅ User deleted successfully');
        } else {
          this.handleUnauthorized(response);
          alert(result.message || 'Gagal menghapus data');
        }
      } catch (error) {
        console.error('❌ Error deleting user:', error);
        alert('Gagal menghapus data');
      }
    },

    formatDate(date) {
      if (!date) return '-';
      return new Date(date).toLocaleDateString('id-ID');
    },

    isExpired(date) {
      if (!date) return false;
      return new Date(date) < new Date();
    }
  }
};
</script>

<style scoped>
.manage-members {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.header h1 {
  font-size: 28px;
  color: #333;
}

.btn-primary {
  background: var(--primary);
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-primary:hover {
  background: var(--secondary);
  transform: translateY(-2px);
  transition: 0.3s ease;
}

/* Search & Filter Styles */
.search-filter-container {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.search-box {
  position: relative;
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  padding: 12px 40px 12px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #4CAF50;
}

.icon-search {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  font-size: 18px;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  align-items: flex-end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.filter-group label {
  font-size: 13px;
  color: #555;
  font-weight: 500;
}

.filter-select {
  padding: 10px 15px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  cursor: pointer;
  min-width: 180px;
}

.filter-select:focus {
  outline: none;
  border-color: #4CAF50;
}

.btn-reset {
  padding: 10px 20px;
  background: #f5f5f5;
  color: #666;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

.btn-reset:hover {
  background: #e0e0e0;
}

.result-info {
  margin-bottom: 15px;
  color: #666;
  font-size: 14px;
}

.result-info p {
  margin: 0;
}

.table-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #f5f5f5;
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

th {
  font-weight: 600;
  color: #555;
  font-size: 14px;
}

td {
  color: #666;
  font-size: 14px;
}

.badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.badge-superadmin {
  background: #f44336;
  color: white;
}

.badge-pustakawan {
  background: #2196F3;
  color: white;
}

.badge-siswa {
  background: #4CAF50;
  color: white;
}

.expired {
  color: #f44336;
  font-weight: 600;
}

.active {
  color: #4CAF50;
  font-weight: 600;
}

.btn-edit, .btn-delete {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  margin-right: 8px;
}

.btn-edit {
  background: #2196F3;
  color: white;
}

.btn-edit:hover {
  background: #1976D2;
}

.btn-delete {
  background: #f44336;
  color: white;
}

.btn-delete:hover {
  background: #d32f2f;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #999;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h2 {
  font-size: 20px;
  color: #333;
}

.btn-close {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #999;
}

.modal-body {
  padding: 20px;
}

.section {
  margin-bottom: 30px;
}

.section h3 {
  font-size: 16px;
  color: #555;
  margin-bottom: 15px;
  border-bottom: 2px solid #4CAF50;
  padding-bottom: 8px;
}

.form-group {
  margin-bottom: 15px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #555;
  font-size: 14px;
  font-weight: 500;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #4CAF50;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 20px;
  border-top: 1px solid #e0e0e0;
}

.btn-secondary {
  background: #e0e0e0;
  color: #666;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-secondary:hover {
  background: #d0d0d0;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .filters {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-select {
    min-width: 100%;
  }

  .btn-reset {
    width: 100%;
  }
}
</style>