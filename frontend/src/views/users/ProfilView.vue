<template>
  <!-- Loading State -->
  <div v-if="isLoading" class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
    <div class="text-center">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      <p class="mt-4 text-gray-600">Memuat profil...</p>
    </div>
  </div>

  <!-- Error State -->
  <div v-else-if="error" class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
    <div class="bg-white rounded-xl shadow-xl p-8 max-w-md w-full text-center">
      <div class="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </div>
      <h2 class="text-xl font-bold text-gray-900 mb-2">Terjadi Kesalahan</h2>
      <p class="text-gray-600 mb-6">{{ error }}</p>
      <button @click="logout" class="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
        Kembali ke Login
      </button>
    </div>
  </div>

  <!-- Profile Content -->
  <div v-else class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
    <div class="max-w-4xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
      <div class="flex flex-col md:flex-row">
        <!-- Sidebar Profile -->
        <div class="md:w-1/3 bg-indigo-600 text-white p-6 flex flex-col items-center">
          <img :src="profile.avatar || '/default-avatar.png'" alt="Foto Profil" class="w-32 h-32 rounded-full border-4 border-white mb-4">
          <h2 class="text-xl font-bold mb-1">{{ profile.nama }}</h2>
          <p class="text-sm mb-4">{{ profile.username }}</p>
          <p class="bg-indigo-700 px-3 py-1 rounded-full text-sm">{{ profile.membership }}</p>
        </div>

        <!-- Main Profile Info -->
        <div class="md:w-2/3 p-6">
          <h3 class="text-2xl font-semibold mb-4">Informasi Anggota</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p class="font-semibold text-gray-700">ID Anggota:</p>
              <p class="text-gray-900">{{ profile.id }}</p>
            </div>
            <div>
              <p class="font-semibold text-gray-700">Tanggal Lahir:</p>
              <p class="text-gray-900">{{ formatDate(profile.tanggal_lahir) }}</p>
            </div>
            <div>
              <p class="font-semibold text-gray-700">Umur:</p>
              <p class="text-gray-900">{{ calculateAge(profile.tanggal_lahir) }} tahun</p>
            </div>
            <div>
              <p class="font-semibold text-gray-700">Email:</p>
              <p class="text-gray-900">{{ profile.email }}</p>
            </div>
            <div>
              <p class="font-semibold text-gray-700">No. Telepon:</p>
              <p class="text-gray-900">{{ profile.telepon }}</p>
            </div>
            <div>
              <p class="font-semibold text-gray-700">Alamat:</p>
              <p class="text-gray-900">{{ profile.alamat }}</p>
            </div>
          </div>

          <h3 class="text-2xl font-semibold mb-4">Detail Membership</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p class="font-semibold text-gray-700">Jenis Membership:</p>
              <p class="text-gray-900">{{ profile.membership }}</p>
            </div>
            <div>
              <p class="font-semibold text-gray-700">Tanggal Bergabung:</p>
              <p class="text-gray-900">{{ formatDate(profile.tanggal_bergabung) }}</p>
            </div>
            <div>
              <p class="font-semibold text-gray-700">Status Membership:</p>
              <p class="text-gray-900">{{ profile.status_membership }}</p>
            </div>
          </div>

          <div class="flex gap-4 mt-6">
            <button @click="editProfile" class="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
              Edit Profil
            </button>
            <button @click="logout" class="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors">
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProfilePage',
  data() {
    return {
      profile: {},
      isLoading: true,
      error: null
    }
  },
  methods: {
    async fetchProfile() {
      this.isLoading = true;
      this.error = null;
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
          this.profile = data;
        } else {
          this.error = data.message || 'Gagal memuat profil.';
        }
      } catch (err) {
        console.error(err);
        this.error = 'Terjadi kesalahan koneksi.';
      } finally {
        this.isLoading = false;
      }
    },
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      this.$router.push('/login');
    },
    editProfile() {
      this.$router.push('/profile/edit');
    },
    formatDate(dateStr) {
      if (!dateStr) return '-';
      const d = new Date(dateStr);
      return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    },
    calculateAge(dateStr) {
      if (!dateStr) return '-';
      const dob = new Date(dateStr);
      const diff = Date.now() - dob.getTime();
      const age = new Date(diff).getUTCFullYear() - 1970;
      return age;
    }
  },
  mounted() {
    this.fetchProfile();
  }
}
</script>

<style scoped>
.min-h-screen { min-height: 100vh; }
.bg-gradient-to-br { background: linear-gradient(to bottom right, #eff6ff, #e0e7ff); }

.animate-spin { animation: spin 1s linear infinite; }
@keyframes spin { 100% { transform: rotate(360deg); } }

.shadow-xl { box-shadow: 0 10px 15px rgba(0,0,0,0.1); }
.rounded-xl { border-radius: 1rem; }
.rounded-full { border-radius: 9999px; }

.text-center { text-align: center; }
.font-semibold { font-weight: 600; }
.font-bold { font-weight: 700; }

.bg-indigo-600 { background-color: #4f46e5; }
.bg-indigo-700 { background-color: #4338ca; }
.bg-red-600 { background-color: #dc2626; }
.bg-red-700 { background-color: #b91c1c; }

.text-white { color: white; }
.text-gray-600 { color: #4b5563; }
.text-gray-700 { color: #374151; }
.text-gray-900 { color: #111827; }

.p-6 { padding: 1.5rem; }
.px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
.py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
.mb-4 { margin-bottom: 1rem; }
.mb-6 { margin-bottom: 1.5rem; }
.mt-4 { margin-top: 1rem; }
.gap-4 { gap: 1rem; }

.hover\:bg-indigo-700:hover { background-color: #4338ca; }
.hover\:bg-red-700:hover { background-color: #b91c1c; }

.grid { display: grid; }
.grid-cols-1 { grid-template-columns: repeat(1, 1fr); }
.md\:grid-cols-2 { grid-template-columns: repeat(2, 1fr); }

.flex { display: flex; }
.flex-col { flex-direction: column; }
.md\:flex-row { flex-direction: row; }
.items-center { align-items: center; }
.justify-center { justify-content: center; }
</style>
