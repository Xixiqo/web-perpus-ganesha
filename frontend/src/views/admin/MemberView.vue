<template>
  <div class="manage-members">
    <!-- Alert Notification -->
    <transition name="slide-down">
      <div v-if="showAlert" :class="['alert-notification', alertType]">
        <div class="alert-content">
          <div class="alert-icon">
            <span v-if="alertType === 'success'">✓</span>
            <span v-else>⚠</span>
          </div>
          <p>{{ alertMessage }}</p>
        </div>
        <button @click="showAlert = false" class="alert-close">&times;</button>
      </div>
    </transition>

    <div class="header">
      <h1>Kelola Anggota & Pengguna</h1>
      <button @click="openAddModal" class="btn-primary">
        <span class="icon-plus">+</span> Tambah User & Anggota
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
        <span class="icon-search">🔍</span>
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
              <div class="action-buttons">
                <button @click="openEditModal(user)" class="btn-action btn-edit" title="Edit">
                  <span class="icon-edit">✏️</span>
                </button>
                <button @click="deleteUser(user.id)" class="btn-action btn-delete" title="Hapus">
                  <span class="icon-trash">🗑️</span>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="filteredUsers.length === 0" class="empty-state">
        <p>{{ users.length === 0 ? 'Belum ada data user' : 'Tidak ada data yang sesuai dengan pencarian' }}</p>
      </div>
    </div>

    <!-- Modal Add/Edit -->
    <transition name="fade">
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
    </transition>

    <!-- Confirm Delete Modal -->
    <transition name="fade">
      <div v-if="showConfirmDelete" class="modal-overlay" @click.self="cancelDelete">
        <div class="confirm-modal">
          <div class="confirm-icon">
            <span class="icon-warning">⚠️</span>
          </div>
          <h3>Konfirmasi Hapus</h3>
          <p>Apakah Anda yakin ingin menghapus user ini?</p>
          <p class="warning-text">Tindakan ini tidak dapat dibatalkan!</p>
          <div class="confirm-actions">
            <button @click="cancelDelete" class="btn-cancel">Batal</button>
            <button @click="confirmDelete" class="btn-confirm-delete">Ya, Hapus</button>
          </div>
        </div>
      </div>
    </transition>
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
      showAlert: false,
      alertMessage: '',
      alertType: 'success',
      showConfirmDelete: false,
      userToDelete: null,
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
      apiBase: import.meta.env.VITE_API_BASE || 'http://localhost:5000'
    };
  },
  computed: {
    filteredUsers() {
      let filtered = this.users;

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

      if (this.filterRole) {
        filtered = filtered.filter(user => user.role === this.filterRole);
      }

      if (this.filterTipeKeanggotaan) {
        filtered = filtered.filter(user => user.tipe_keanggotaan === this.filterTipeKeanggotaan);
      }

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
    getAuthConfig() {
      const token = localStorage.getItem('token');
      return {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
    },

    handleUnauthorized(response) {
      if (response.status === 401 || response.status === 403) {
        console.error('⚠️ Unauthorized - Token invalid atau expired');
        localStorage.removeItem('token');
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
          this.showErrorAlert('Gagal mengambil data users');
        }
      } catch (error) {
        console.error('❌ Error fetching users:', error);
        this.showErrorAlert('Gagal mengambil data users');
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
          this.showSuccessAlert(result.message);
          this.closeModal();
          this.fetchUsers();
          console.log('✅ User saved successfully');
        } else {
          this.handleUnauthorized(response);
          this.showErrorAlert(result.message || 'Terjadi kesalahan');
        }
      } catch (error) {
        console.error('❌ Error submitting form:', error);
        this.showErrorAlert('Gagal menyimpan data');
      }
    },

    deleteUser(id) {
      this.userToDelete = id;
      this.showConfirmDelete = true;
    },

    async confirmDelete() {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${this.apiBase}/api/admin/users/${this.userToDelete}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const result = await response.json();

        if (response.ok) {
          this.showSuccessAlert(result.message);
          this.fetchUsers();
          console.log('✅ User deleted successfully');
        } else {
          this.handleUnauthorized(response);
          this.showErrorAlert(result.message || 'Gagal menghapus data');
        }
      } catch (error) {
        console.error('❌ Error deleting user:', error);
        this.showErrorAlert('Gagal menghapus data');
      } finally {
        this.showConfirmDelete = false;
        this.userToDelete = null;
      }
    },

    cancelDelete() {
      this.showConfirmDelete = false;
      this.userToDelete = null;
    },

    showSuccessAlert(message) {
      this.alertMessage = message;
      this.alertType = 'success';
      this.showAlert = true;
      setTimeout(() => {
        this.showAlert = false;
      }, 3000);
    },

    showErrorAlert(message) {
      this.alertMessage = message;
      this.alertType = 'error';
      this.showAlert = true;
      setTimeout(() => {
        this.showAlert = false;
      }, 3000);
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
:root {
  --primary: #4CAF50;
  --secondary: #45a049;
  --danger: #f44336;
  --danger-hover: #d32f2f;
  --info: #2196F3;
  --info-hover: #1976D2;
  --warning: #ff9800;
  --success: #4CAF50;
}

.manage-members {
  padding: 20px;
}

/* Alert Notification */
.alert-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 2000;
  min-width: 320px;
  max-width: 500px;
  padding: 16px 20px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: space-between;
  animation: slideIn 0.3s ease;
}

.alert-notification.success {
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  color: white;
}

.alert-notification.error {
  background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
  color: white;
}

.alert-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.alert-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
}

.alert-close {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.2s;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.alert-close:hover {
  opacity: 1;
}

@keyframes slideIn {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  transform: translateY(-100px);
  opacity: 0;
}

.slide-down-leave-to {
  transform: translateY(-100px);
  opacity: 0;
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
  background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
}

.icon-plus {
  font-size: 18px;
  font-weight: bold;
}

/* Search & Filter Styles */
.search-filter-container {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.search-box {
  position: relative;
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  padding: 12px 40px 12px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

.icon-search {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
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
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  cursor: pointer;
  min-width: 180px;
  transition: all 0.3s;
}

.filter-select:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

.btn-reset {
  padding: 10px 20px;
  background: #f5f5f5;
  color: #666;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s;
}

.btn-reset:hover {
  background: #e0e0e0;
  border-color: #d0d0d0;
}

.result-info {
  margin-bottom: 15px;
  color: #666;
  font-size: 14px;
}

.table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

th, td {
  padding: 14px;
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

tbody tr {
  transition: background 0.2s;
}

tbody tr:hover {
  background: #f8f9fa;
}

.badge {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  display: inline-block;
}

.badge-superadmin {
  background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
  color: white;
}

.badge-pustakawan {
  background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
  color: white;
}

.badge-siswa {
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  color: white;
}

.expired {
  color: var(--danger);
  font-weight: 600;
}

.active {
  color: var(--success);
  font-weight: 600;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 8px;
}

.btn-action {
  padding: 8px 12px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-edit {
  background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(33, 150, 243, 0.3);
}

.btn-edit:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.4);
}

.btn-delete {
  background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(244, 67, 54, 0.3);
}

.btn-delete:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(244, 67, 54, 0.4);
}

.empty-state {
  text-align: center;
  padding: 60px 40px;
  color: #999;
  font-size: 16px;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 2px solid #e0e0e0;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 16px 16px 0 0;
}

.modal-header h2 {
  font-size: 22px;
  color: #333;
  font-weight: 600;
}

.btn-close {
  background: none;
  border: none;
  font-size: 32px;
  cursor: pointer;
  color: #999;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s;
}

.btn-close:hover {
  background: rgba(244, 67, 54, 0.1);
  color: var(--danger);
}

.modal-body {
  padding: 24px;
}

.section {
  margin-bottom: 30px;
}

.section h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 3px solid var(--primary);
  font-weight: 600;
}

.form-group {
  margin-bottom: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-size: 14px;
  font-weight: 600;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 12px 15px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 2px solid #e0e0e0;
  background: #f8f9fa;
  border-radius: 0 0 16px 16px;
}

.btn-secondary {
  background: #e0e0e0;
  color: #666;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s;
}

.btn-secondary:hover {
  background: #d0d0d0;
  transform: translateY(-1px);
}

/* Confirm Delete Modal */
.confirm-modal {
  background: white;
  border-radius: 16px;
  padding: 32px;
  width: 90%;
  max-width: 440px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: scaleIn 0.3s ease;
}

@keyframes scaleIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.confirm-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
}

.confirm-modal h3 {
  font-size: 24px;
  color: #333;
  margin-bottom: 12px;
  font-weight: 600;
}

.confirm-modal p {
  color: #666;
  font-size: 16px;
  margin-bottom: 8px;
  line-height: 1.5;
}

.warning-text {
  color: var(--danger);
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 24px;
}

.confirm-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.btn-cancel {
  flex: 1;
  padding: 12px 24px;
  background: #e0e0e0;
  color: #666;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-cancel:hover {
  background: #d0d0d0;
  transform: translateY(-1px);
}

.btn-confirm-delete {
  flex: 1;
  padding: 12px 24px;
  background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(244, 67, 54, 0.3);
  transition: all 0.3s;
}

.btn-confirm-delete:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(244, 67, 54, 0.4);
}

/* Fade Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive */
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

  .action-buttons {
    flex-wrap: wrap;
  }

  .confirm-actions {
    flex-direction: column;
  }

  .btn-cancel,
  .btn-confirm-delete {
    width: 100%;
  }

  .modal {
    width: 95%;
    max-height: 95vh;
  }

  .modal-header h2 {
    font-size: 18px;
  }

  .confirm-modal {
    width: 95%;
    padding: 24px;
  }

  .confirm-icon {
    width: 64px;
    height: 64px;
    font-size: 32px;
  }

  .confirm-modal h3 {
    font-size: 20px;
  }
}

/* Scrollbar Styling */
.modal::-webkit-scrollbar {
  width: 8px;
}

.modal::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.modal::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

.modal::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.table-container::-webkit-scrollbar {
  height: 8px;
}

.table-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.table-container::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

.table-container::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>