<template>
    <div class="p-5 max-w-[1400px] mx-auto">
    <!-- Alert Notification -->
    <transition name="slide-down">
      <div v-if="showNotification" 
        :class="[
          'fixed top-5 right-5 z-50 min-w-[320px] max-w-[500px] p-4 px-5 rounded-xl shadow-lg flex items-center justify-between',
          'animate-slideIn',
          notificationType === 'success' ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' :
          'bg-gradient-to-r from-red-500 to-red-600 text-white'
        ]"
      >
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-lg font-bold">
            {{ notificationType === 'success' ? '✓' : '✕' }}
          </div>
          <div class="text-white">{{ notificationMessage }}</div>
        </div>
        <button 
          @click="closeNotification"
          class="bg-transparent border-0 text-white text-2xl cursor-pointer opacity-80 hover:opacity-100 transition-opacity w-6 h-6 flex items-center justify-center"
        >
          ×
        </button>
      </div>
    </transition>

    <!-- Header -->
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-2xl text-gray-800">Kelola Anggota</h1>
          <button 
          @click="openAddModal()"
          class="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg cursor-pointer text-sm flex items-center gap-2 font-medium shadow-green-200 shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300"
        >
          <span class="text-lg font-bold">+</span>
          Tambah Anggota
        </button>
    </div>

    <!-- Search & Filter -->
    <div class="bg-white rounded-xl p-5 mb-5 shadow-sm">
      <div class="relative mb-5">
        <input 
          type="text"
          v-model="searchQuery"
          placeholder="Cari anggota..."
          class="w-full py-3 px-4 border-2 border-gray-200 rounded-lg text-sm transition-all focus:outline-none focus:border-green-500 focus:ring-3 focus:ring-green-100"
        >
        <span class="absolute right-4 top-1/2 -translate-y-1/2 text-lg">🔍</span>
      </div>

      <div class="flex flex-wrap gap-4 items-end">
        <div class="flex flex-col gap-1">
          <label class="text-sm text-gray-600 font-medium">Status</label>
          <select 
            v-model="filterStatus"
            class="py-2.5 px-4 border-2 border-gray-200 rounded-lg text-sm bg-white cursor-pointer min-w-[180px] transition-all focus:outline-none focus:border-green-500 focus:ring-3 focus:ring-green-100"
          >
            <option value="">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="expired">Kadaluarsa</option>
          </select>
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-sm text-gray-600 font-medium">Role</label>
          <select 
            v-model="filterRole"
            class="py-2.5 px-4 border-2 border-gray-200 rounded-lg text-sm bg-white cursor-pointer min-w-[180px] transition-all focus:outline-none focus:border-green-500 focus:ring-3 focus:ring-green-100"
          >
            <option value="">Semua Role</option>
            <option value="superadmin">Super Admin</option>
            <option value="pustakawan">Pustakawan</option>
            <option value="siswa">Siswa</option>
          </select>
        </div>

        <button 
          @click="resetFilters"
          class="py-2.5 px-5 bg-gray-100 text-gray-600 border-2 border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
        >
          Reset Filter
        </button>
      </div>
    </div>

    <!-- Results Info -->
    <div class="text-sm text-gray-600 mb-4">
      Menampilkan {{ filteredUsers.length }} anggota
    </div>

    <!-- Members Table -->
    <div class="bg-white rounded-xl shadow-sm overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gradient-to-r from-gray-50 to-gray-100">
          <tr>
            <th class="py-4 px-4 text-left font-semibold text-gray-600 text-sm">ID</th>
            <th class="py-4 px-4 text-left font-semibold text-gray-600 text-sm">Nama/NIS-NIP</th>
            <th class="py-4 px-4 text-left font-semibold text-gray-600 text-sm">Username/Institusi</th>
            <th class="py-4 px-4 text-left font-semibold text-gray-600 text-sm">Role</th>
            <th class="py-4 px-4 text-left font-semibold text-gray-600 text-sm min-w-[140px]">Status Keanggotaan</th>
            <th class="py-4 px-4 text-left font-semibold text-gray-600 text-sm">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id" class="border-b border-gray-200 hover:bg-gray-50 transition-colors">
            <td class="py-4 px-4 text-sm text-gray-600">{{ user.id }}</td>
            <td class="py-4 px-4">
              <div class="text-sm text-gray-900 font-medium">{{ user.nama }}</div>
              <div class="text-xs text-gray-500">{{ user.nis_nip }}</div>
            </td>
            <td class="py-4 px-4">
              <div class="text-sm text-gray-600">{{ user.username }}</div>
              <div class="text-xs text-gray-500 mt-1">{{ user.major ? `${user.major}, ${user.institute}` : user.institute }}</div>
            </td>
            <td class="py-4 px-4">
              <span 
                :class="[
                  'px-3 py-1 rounded-full text-xs font-medium inline-flex items-center justify-center',
                  user.role === 'superadmin' ? 'bg-red-100 text-red-700' :
                  user.role === 'pustakawan' ? 'bg-blue-100 text-blue-700' :
                  'bg-green-100 text-green-700'
                ]"
              >
                {{ user.role }}
              </span>
            </td>
            <td class="py-4 px-4">
              <span 
                :class="[
                  'text-sm font-medium flex items-center gap-1.5',
                  isExpired(user.member_expired) ? 'text-red-600' : 'text-green-600'
                ]"
              >
                <span class="w-2 h-2 rounded-full" 
                  :class="isExpired(user.member_expired) ? 'bg-red-500' : 'bg-green-500'"
                ></span>
                {{ isExpired(user.member_expired) ? 'Kadaluarsa' : 'Aktif' }}
              </span>
              <div class="text-xs text-gray-500 mt-1">
                {{ formatDate(user.member_expired) }}
              </div>
            </td>
            <td class="py-4 px-4">
              <div class="flex gap-2">
                <button 
                  @click="openEditModal(user)"
                  class="w-9 h-9 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-blue-200 shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300"
                >
                  ✎
                </button>
                <button 
                  @click="deleteUser(user.id)"
                  class="w-9 h-9 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white shadow-red-200 shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300"
                >
                  ×
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black/60 flex justify-center items-center z-50 backdrop-blur-sm">
      <div class="bg-white rounded-2xl w-[90%] max-w-[800px] max-h-[90vh] overflow-y-auto shadow-2xl">
        <div class="flex justify-between items-center p-6 border-b-2 border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 rounded-t-2xl">
          <h2 class="text-xl text-gray-800 font-semibold">
            {{ isEditMode ? 'Edit Anggota' : 'Tambah Anggota Baru' }}
          </h2>
          <button 
            @click="closeModal"
            class="bg-transparent border-0 text-2xl cursor-pointer text-gray-500 w-9 h-9 flex items-center justify-center rounded-full hover:bg-red-50 hover:text-red-500 transition-colors"
          >
            ×
          </button>
        </div>

        <div class="p-6">
          <div class="mb-8">
            <h3 class="text-lg text-gray-800 mb-5 pb-2.5 border-b-3 border-green-500 font-semibold">
              Informasi Dasar
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div v-if="!isEditMode" class="flex flex-col gap-2">
                <label class="text-sm text-gray-600 font-semibold">Password</label>
                <input 
                  type="password"
                  v-model="formData.password"
                  class="w-full py-3 px-4 border-2 border-gray-200 rounded-lg text-sm transition-all focus:outline-none focus:border-green-500 focus:ring-3 focus:ring-green-100"
                  :required="!isEditMode"
                >
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-sm text-gray-600 font-semibold">Nama Lengkap</label>
                <input 
                  type="text"
                  v-model="formData.nama"
                  class="w-full py-3 px-4 border-2 border-gray-200 rounded-lg text-sm transition-all focus:outline-none focus:border-green-500 focus:ring-3 focus:ring-green-100"
                >
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-sm text-gray-600 font-semibold">Username</label>
                <input 
                  type="text"
                  v-model="formData.username"
                  class="w-full py-3 px-4 border-2 border-gray-200 rounded-lg text-sm transition-all focus:outline-none focus:border-green-500 focus:ring-3 focus:ring-green-100"
                >
              </div>
            </div>
          </div>

          <div class="mb-8">
            <h3 class="text-lg text-gray-800 mb-5 pb-2.5 border-b-3 border-green-500 font-semibold">
              Informasi Institusi
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div class="flex flex-col gap-2">
                <label class="text-sm text-gray-600 font-semibold">Institusi</label>
                <input 
                  type="text"
                  v-model="formData.institute"
                  class="w-full py-3 px-4 border-2 border-gray-200 rounded-lg text-sm transition-all focus:outline-none focus:border-green-500 focus:ring-3 focus:ring-green-100"
                >
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-sm text-gray-600 font-semibold">Jurusan</label>
                <input 
                  type="text"
                  v-model="formData.major"
                  class="w-full py-3 px-4 border-2 border-gray-200 rounded-lg text-sm transition-all focus:outline-none focus:border-green-500 focus:ring-3 focus:ring-green-100"
                >
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-sm text-gray-600 font-semibold">Angkatan</label>
                <input 
                  type="text"
                  v-model="formData.angkatan"
                  class="w-full py-3 px-4 border-2 border-gray-200 rounded-lg text-sm transition-all focus:outline-none focus:border-green-500 focus:ring-3 focus:ring-green-100"
                >
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-sm text-gray-600 font-semibold">No. Telepon</label>
                <input 
                  type="text"
                  v-model="formData.no_telp"
                  class="w-full py-3 px-4 border-2 border-gray-200 rounded-lg text-sm transition-all focus:outline-none focus:border-green-500 focus:ring-3 focus:ring-green-100"
                >
              </div>
            </div>
          </div>

          <div class="mb-8">
            <h3 class="text-lg text-gray-800 mb-5 pb-2.5 border-b-3 border-green-500 font-semibold">
              Akses & Keamanan
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div class="flex flex-col gap-2">
                <label class="text-sm text-gray-600 font-semibold">Role</label>
                <select 
                  v-model="formData.role"
                  class="w-full py-3 px-4 border-2 border-gray-200 rounded-lg text-sm transition-all focus:outline-none focus:border-green-500 focus:ring-3 focus:ring-green-100"
                >
                  <option value="siswa">Siswa</option>
                  <option value="pustakawan">Pustakawan</option>
                  <option value="superadmin">Super Admin</option>
                </select>
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-sm text-gray-600 font-semibold">NIS/NIP</label>
                <input 
                  type="text"
                  v-model="formData.nis_nip"
                  class="w-full py-3 px-4 border-2 border-gray-200 rounded-lg text-sm transition-all focus:outline-none focus:border-green-500 focus:ring-3 focus:ring-green-100"
                >
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-sm text-gray-600 font-semibold">Tanggal Expired</label>
                <input 
                  type="date"
                  v-model="formData.member_expired"
                  class="w-full py-3 px-4 border-2 border-gray-200 rounded-lg text-sm transition-all focus:outline-none focus:border-green-500 focus:ring-3 focus:ring-green-100"
                >
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-3 p-5 border-t-2 border-gray-200 bg-gray-50 rounded-b-2xl">
          <button 
            @click="closeModal"
            class="px-6 py-3 bg-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-300 transition-colors"
          >
            Batal
          </button>
          <button 
            @click="submitForm"
            class="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg text-sm font-medium shadow-green-200 shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300"
          >
            {{ isEditMode ? 'Simpan Perubahan' : 'Tambah Anggota' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Confirm Delete Modal -->
    <div v-if="showConfirmDelete" class="fixed inset-0 bg-black/60 flex justify-center items-center z-50 backdrop-blur-sm">
      <div class="bg-white rounded-2xl p-8 w-[90%] max-w-[440px] text-center shadow-2xl animate-scaleIn">
        <div class="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-amber-100 to-amber-200 rounded-full flex items-center justify-center text-4xl">
          ⚠️
        </div>
        <h3 class="text-2xl font-semibold text-gray-800 mb-2">Konfirmasi Hapus</h3>
        <p class="text-gray-600 mb-6">
          Apakah Anda yakin ingin menghapus anggota ini? Tindakan ini tidak dapat dibatalkan.
        </p>
        <p class="text-red-500 text-sm font-medium mb-6">
          Semua data yang terkait dengan anggota ini juga akan dihapus.
        </p>
        <div class="flex gap-3 justify-center">
          <button 
            @click="cancelDelete"
            class="px-6 py-3 border-2 border-gray-200 rounded-lg text-gray-600 text-sm font-medium hover:bg-gray-100 transition-colors"
          >
            Batal
          </button>
          <button 
            @click="confirmDelete"
            class="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg text-sm font-medium shadow-red-200 shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300"
          >
            Ya, Hapus
          </button>
        </div>
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
      showNotification: false,
      notificationMessage: '',
      notificationType: 'success',
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

      // Filter berdasarkan pencarian
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(user => {
          const searchableFields = [
            user.username,
            user.nama,
            user.nis_nip,
            user.institute,
            user.major
          ];
          return searchableFields.some(field => 
            field && field.toString().toLowerCase().includes(query)
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

      // Filter berdasarkan status keanggotaan
      if (this.filterStatus) {
        filtered = filtered.filter(user => {
          if (this.filterStatus === 'active') {
            return user.member_expired && !this.isExpired(user.member_expired);
          } else if (this.filterStatus === 'expired') {
            return !user.member_expired || this.isExpired(user.member_expired);
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
          this.showErrorNotification('Gagal mengambil data users');
        }
      } catch (error) {
        console.error('❌ Error fetching users:', error);
        this.showErrorNotification('Gagal mengambil data users');
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
          this.showSuccessNotification(result.message);
          this.closeModal();
          this.fetchUsers();
          console.log('✅ User saved successfully');
        } else {
          this.handleUnauthorized(response);
          this.showErrorNotification(result.message || 'Terjadi kesalahan');
        }
      } catch (error) {
        console.error('❌ Error submitting form:', error);
        this.showErrorNotification('Gagal menyimpan data');
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
          this.showSuccessNotification(result.message);
          this.fetchUsers();
          console.log('✅ User deleted successfully');
        } else {
          this.handleUnauthorized(response);
          this.showErrorNotification(result.message || 'Gagal menghapus data');
        }
      } catch (error) {
        console.error('❌ Error deleting user:', error);
        this.showErrorNotification('Gagal menghapus data');
      } finally {
        this.showConfirmDelete = false;
        this.userToDelete = null;
      }
    },

    cancelDelete() {
      this.showConfirmDelete = false;
      this.userToDelete = null;
    },

    showSuccessNotification(message) {
      this.notificationMessage = message;
      this.notificationType = 'success';
      this.showNotification = true;
      setTimeout(() => {
        this.showNotification = false;
      }, 3000);
    },

    showErrorNotification(message) {
      this.notificationMessage = message;
      this.notificationType = 'error';
      this.showNotification = true;
      setTimeout(() => {
        this.showNotification = false;
      }, 3000);
    },

    closeNotification() {
      this.showNotification = false;
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

<style>
/* Custom animations and transitions */
@keyframes slideIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-slideIn {
  animation: slideIn 0.3s ease;
}

.animate-scaleIn {
  animation: scaleIn 0.3s ease;
}

/* Transition classes */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-100px);
  opacity: 0;
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