<template>
  <div class="min-h-screen flex bg-gray-50">
    <!-- Sidebar -->
    <aside class="w-64 bg-white border-r border-gray-200 flex flex-col">
      <!-- Profile Section -->
      <div class="p-6 border-b border-gray-200">
        <button @click="goBack" class="flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          Settings
        </button>
        
        <div class="flex flex-col items-center">
          <div class="relative">
            <div class="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold">
              {{ getInitials(profile.nama) }}
            </div>
            <div class="absolute bottom-0 right-0 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <h2 class="text-base font-semibold text-gray-900 mt-3">{{ profile.nama || 'Nama Pengguna' }}</h2>
          <p class="text-sm text-gray-500">{{ profile.angkatan || '-' }}</p>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 p-4">
        <ul class="space-y-1">
          <li>
            <button 
              @click="activeSection = 'personal'" 
              :class="['w-full text-left px-4 py-2.5 rounded-lg flex items-center transition-colors', 
                       activeSection === 'personal' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50']"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              Informasi Personal
            </button>
          </li>
          <li>
            <button 
              @click="activeSection = 'notifications'" 
              :class="['w-full text-left px-4 py-2.5 rounded-lg flex items-center transition-colors', 
                       activeSection === 'notifications' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50']"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
              </svg>
              Notifikasi
            </button>
          </li>
          <li>
            <button 
              @click="activeSection = 'security'" 
              :class="['w-full text-left px-4 py-2.5 rounded-lg flex items-center transition-colors', 
                       activeSection === 'security' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50']"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
              Privasi dan Keamanan
            </button>
          </li>
          <li>
            <button 
              @click="activeSection = 'integrations'" 
              :class="['w-full text-left px-4 py-2.5 rounded-lg flex items-center transition-colors', 
                       activeSection === 'integrations' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50']"
            >
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
              Integrasi
            </button>
          </li>
        </ul>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 overflow-auto">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex items-center justify-center h-full">
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p class="mt-4 text-gray-600">Memuat profil...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="flex items-center justify-center h-full p-8">
        <div class="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div class="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <h2 class="text-xl font-bold text-gray-900 mb-2">Terjadi Kesalahan</h2>
          <p class="text-gray-600 mb-6">{{ error }}</p>
          <button @click="goBack" class="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors">
            Kembali
          </button>
        </div>
      </div>

      <!-- Content Sections -->
      <div v-else class="p-8">
        <!-- Informasi Personal -->
        <div v-if="activeSection === 'personal'" class="max-w-3xl">
          <h1 class="text-2xl font-bold text-gray-900 mb-6">Informasi Personal</h1>
          
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <form @submit.prevent="updateProfile">
              <div class="space-y-6">
                <!-- ID Pustakawan / NIS NIP -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">ID Pustakawan / NIS/NIP</label>
                  <input 
                    v-model="editableProfile.nis_nip"
                    type="text"
                    :disabled="!isEditing"
                    :class="['w-full px-4 py-2.5 rounded-lg border', isEditing ? 'border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent' : 'border-gray-200 bg-gray-50 text-gray-700']"
                  >
                  <p class="text-xs text-gray-500 mt-1">Nomor identitas unik yang digunakan untuk login dan sistem perpustakaan.</p>
                </div>

                <!-- Nama Lengkap -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                  <input 
                    v-model="editableProfile.nama"
                    type="text"
                    :disabled="!isEditing"
                    :class="['w-full px-4 py-2.5 rounded-lg border', isEditing ? 'border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent' : 'border-gray-200 bg-gray-50 text-gray-700']"
                  >
                  <p class="text-xs text-gray-500 mt-1">Nama yang akan ditampilkan pada profil dan dari data perpustakaan.</p>
                </div>

                <!-- Username -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Username</label>
                  <div class="text-gray-900 bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-200">{{ profile.username || '-' }}</div>
                  <p class="text-xs text-gray-500 mt-1">Username untuk login ke sistem perpustakaan.</p>
                </div>

                <!-- Institusi -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Institusi</label>
                  <input 
                    v-model="editableProfile.institute"
                    type="text"
                    :disabled="!isEditing"
                    :class="['w-full px-4 py-2.5 rounded-lg border', isEditing ? 'border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent' : 'border-gray-200 bg-gray-50 text-gray-700']"
                  >
                  <p class="text-xs text-gray-500 mt-1">Nama sekolah atau institusi pendidikan.</p>
                </div>

                <!-- Jurusan -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Jurusan</label>
                  <input 
                    v-model="editableProfile.major"
                    type="text"
                    :disabled="!isEditing"
                    :class="['w-full px-4 py-2.5 rounded-lg border', isEditing ? 'border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent' : 'border-gray-200 bg-gray-50 text-gray-700']"
                  >
                  <p class="text-xs text-gray-500 mt-1">Jurusan atau program studi.</p>
                </div>

                <!-- Kelas/Angkatan -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Kelas / Angkatan</label>
                  <input 
                    v-model="editableProfile.angkatan"
                    type="text"
                    :disabled="!isEditing"
                    :class="['w-full px-4 py-2.5 rounded-lg border', isEditing ? 'border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent' : 'border-gray-200 bg-gray-50 text-gray-700']"
                  >
                  <p class="text-xs text-gray-500 mt-1">Informasi kelas atau angkatan untuk keperluan administrasi perpustakaan.</p>
                </div>

                <!-- Nomor Telepon -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Nomor Telepon</label>
                  <input 
                    v-model="editableProfile.no_telp"
                    type="tel"
                    :disabled="!isEditing"
                    :class="['w-full px-4 py-2.5 rounded-lg border', isEditing ? 'border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent' : 'border-gray-200 bg-gray-50 text-gray-700']"
                  >
                  <p class="text-xs text-gray-500 mt-1">Nomor telepon yang akan digunakan untuk verifikasi dan menerima pengingat peminjaman/pengembalian.</p>
                </div>

                <!-- Tanggal Lahir -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Tanggal Lahir</label>
                  <input 
                    v-model="editableProfile.tanggal_lahir"
                    type="date"
                    :disabled="!isEditing"
                    :class="['w-full px-4 py-2.5 rounded-lg border', isEditing ? 'border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent' : 'border-gray-200 bg-gray-50 text-gray-700']"
                  >
                  <p class="text-xs text-gray-500 mt-1">Tanggal lahir Anda. Umur: {{ calculateAge(editableProfile.tanggal_lahir) }} tahun</p>
                </div>

                <!-- Jenis Kelamin -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Jenis Kelamin</label>
                  <div class="flex gap-4">
                    <button 
                      type="button"
                      @click="isEditing && (editableProfile.jenis_kelamin = 'Laki-laki')"
                      :disabled="!isEditing"
                      :class="['flex-1 px-4 py-3 rounded-lg border-2 transition-colors flex items-center justify-center', 
                               editableProfile.jenis_kelamin === 'Laki-laki' ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-200 bg-white text-gray-700',
                               !isEditing && 'cursor-not-allowed opacity-60']"
                    >
                      <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path>
                      </svg>
                      Laki-laki
                    </button>
                    <button 
                      type="button"
                      @click="isEditing && (editableProfile.jenis_kelamin = 'Perempuan')"
                      :disabled="!isEditing"
                      :class="['flex-1 px-4 py-3 rounded-lg border-2 transition-colors flex items-center justify-center', 
                               editableProfile.jenis_kelamin === 'Perempuan' ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-200 bg-white text-gray-700',
                               !isEditing && 'cursor-not-allowed opacity-60']"
                    >
                      <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path>
                      </svg>
                      Perempuan
                    </button>
                  </div>
                  <p class="text-xs text-gray-500 mt-1">Informasi gender untuk melengkapi data profil Anda.</p>
                </div>
              </div>

              <div class="mt-6 flex gap-3">
                <button 
                  v-if="!isEditing"
                  type="button"
                  @click="startEditing"
                  class="flex-1 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Edit Profil
                </button>
                <template v-else>
                  <button 
                    type="button"
                    @click="cancelEditing"
                    class="flex-1 bg-gray-200 text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit"
                    :disabled="isSaving"
                    class="flex-1 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
                  >
                    {{ isSaving ? 'Menyimpan...' : 'Simpan Perubahan' }}
                  </button>
                </template>
              </div>

              <div v-if="updateMessage" :class="['mt-4 p-3 rounded-lg', updateSuccess ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800']">
                {{ updateMessage }}
              </div>
            </form>
          </div>

          <!-- Member Info -->
          <div class="bg-blue-50 rounded-lg border border-blue-200 p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Informasi Keanggotaan</h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-600">Jenis Keanggotaan</p>
                <p class="text-base font-semibold text-gray-900 capitalize">{{ profile.tipe_keanggotaan || '-' }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Status</p>
                <p :class="['text-base font-semibold', isMembershipActive(profile.member_expired) ? 'text-green-600' : 'text-red-600']">
                  {{ isMembershipActive(profile.member_expired) ? 'Aktif' : 'Nonaktif' }}
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Tanggal Bergabung</p>
                <p class="text-base font-semibold text-gray-900">{{ formatDate(profile.created_at) }}</p>
              </div>
              <div>
                <p class="text-sm text-gray-600">Berlaku Hingga</p>
                <p class="text-base font-semibold text-gray-900">{{ formatDate(profile.member_expired) }}</p>
              </div>
            </div>
          </div>
        </div>
        <!-- Notifikasi -->
        <div v-if="activeSection === 'notifications'" class="max-w-3xl">
          <h1 class="text-2xl font-bold text-gray-900 mb-6">Notifikasi dan Pemberitahuan</h1>
          
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h3 class="text-base font-medium text-gray-900">Notifikasi Peminjaman</h3>
                <p class="text-sm text-gray-600 mt-1">Aktifkan pengingat saat buku berhasil dipinjam.</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  v-model="notifications.borrowing"
                  @change="saveNotifications"
                  class="sr-only peer"
                >
                <div class="toggle-switch"></div>
              </label>
            </div>

            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h3 class="text-base font-medium text-gray-900">Notifikasi Pengembalian</h3>
                <p class="text-sm text-gray-600 mt-1">Terima pengingat sebelum batas waktu pengembalian.</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  v-model="notifications.returning"
                  @change="saveNotifications"
                  class="sr-only peer"
                >
                <div class="toggle-switch"></div>
              </label>
            </div>

            <div class="flex items-start justify-between">
              <div class="flex-1">
                <h3 class="text-base font-medium text-gray-900">Notifikasi Acara Perpustakaan</h3>
                <p class="text-sm text-gray-600 mt-1">Dapatkan info terbaru tentang acara & kegiatan perpustakaan.</p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  v-model="notifications.events"
                  @change="saveNotifications"
                  class="sr-only peer"
                >
                <div class="toggle-switch"></div>
              </label>
            </div>

            <div v-if="notificationsMessage" class="p-3 rounded-lg bg-green-50 text-green-800">
              {{ notificationsMessage }}
            </div>
          </div>
        </div>

        <!-- Privasi dan Keamanan -->
        <div v-if="activeSection === 'security'" class="max-w-3xl">
          <h1 class="text-2xl font-bold text-gray-900 mb-6">Privasi dan Keamanan</h1>
          
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <form @submit.prevent="changePassword" class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Kata Sandi Lama</label>
                <div class="relative">
                  <input 
                    v-model="passwordForm.oldPassword"
                    :type="showOldPassword ? 'text' : 'password'"
                    placeholder="••••••••" 
                    class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                  >
                  <button 
                    type="button"
                    @click="showOldPassword = !showOldPassword"
                    class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    <svg v-if="!showOldPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                    </svg>
                  </button>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Kata Sandi Baru</label>
                <div class="relative">
                  <input 
                    v-model="passwordForm.newPassword"
                    :type="showNewPassword ? 'text' : 'password'"
                    placeholder="••••••••" 
                    class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                  >
                  <button 
                    type="button"
                    @click="showNewPassword = !showNewPassword"
                    class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    <svg v-if="!showNewPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                    </svg>
                  </button>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Konfirmasi Kata Sandi Baru</label>
                <div class="relative">
                  <input 
                    v-model="passwordForm.confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    placeholder="••••••••" 
                    class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                  >
                  <button 
                    type="button"
                    @click="showConfirmPassword = !showConfirmPassword"
                    class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    <svg v-if="!showConfirmPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                    </svg>
                  </button>
                </div>
              </div>

              <button 
                type="submit"
                :disabled="isChangingPassword"
                class="w-full bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
              >
                {{ isChangingPassword ? 'Mengubah Password...' : 'Ubah Password' }}
              </button>

              <div v-if="passwordMessage" :class="['p-3 rounded-lg', passwordSuccess ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800']">
                {{ passwordMessage }}
              </div>
            </form>

            <div class="pt-6 border-t border-gray-200 mt-6">
              <h3 class="text-base font-medium text-gray-900 mb-2">Verifikasi Dua Langkah</h3>
              <p class="text-sm text-gray-600 mb-4">Tambahkan lapisan keamanan ekstra dengan mengaktifkan verifikasi dua langkah</p>
              <button class="text-blue-600 hover:text-blue-700 font-medium text-sm">Aktifkan 2FA (Segera Hadir)</button>
            </div>

            <div class="pt-6 border-t border-gray-200 mt-6">
              <h3 class="text-base font-medium text-gray-900 mb-3">Aktivitas Login Terakhir</h3>
              <div class="space-y-3 text-sm">
                <div class="flex items-start">
                  <svg class="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <div>
                    <p class="text-gray-600 text-xs">Lokasi</p>
                    <p class="text-gray-900 font-medium">Yogyakarta, Indonesia</p>
                  </div>
                </div>
                <div class="flex items-start">
                  <svg class="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  <div>
                    <p class="text-gray-600 text-xs">Perangkat</p>
                    <p class="text-gray-900 font-medium">{{ getBrowser() }}</p>
                  </div>
                </div>
                <div class="flex items-start">
                  <svg class="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div>
                    <p class="text-gray-600 text-xs">Waktu Login</p>
                    <p class="text-gray-900 font-medium">{{ getCurrentDateTime() }}</p>
                  </div>
                </div>
                <div class="flex items-start">
                  <svg class="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div>
                    <p class="text-gray-600 text-xs">Status</p>
                    <p class="text-green-600 font-medium">Berhasil</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Integrasi -->
        <div v-if="activeSection === 'integrations'" class="max-w-3xl">
          <h1 class="text-2xl font-bold text-gray-900 mb-6">Integrasi</h1>
          
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <p class="text-gray-600 mb-6">Fitur integrasi akan segera hadir. Anda akan dapat menghubungkan akun perpustakaan dengan layanan eksternal.</p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="border border-gray-200 rounded-lg p-4 opacity-50">
                <div class="flex items-center mb-2">
                  <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900">GitHub</h3>
                    <p class="text-xs text-gray-500">Segera hadir</p>
                  </div>
                </div>
              </div>

              <div class="border border-gray-200 rounded-lg p-4 opacity-50">
                <div class="flex items-center mb-2">
                  <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                    <svg class="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 class="font-semibold text-gray-900">Google</h3>
                    <p class="text-xs text-gray-500">Segera hadir</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'ProfilePage',
  data() {
    return {
      apiBaseUrl: import.meta.env.VITE_API_BASE || 'http://localhost:5000',
      profile: {},
      editableProfile: {},
      isLoading: true,
      error: null,
      activeSection: 'personal',
      isEditing: false,
      isSaving: false,
      updateMessage: '',
      updateSuccess: false,
      showDyslexiaConfirm: false,
      
      // Preferences
      preferences: {
        language: 'id',
        dyslexiaMode: false, // Mode disleksia default tidak aktif
        dyslexiaFontSize: 16, // Ukuran font default
        dyslexiaLineSpacing: 1.5, // Jarak baris default
        dyslexiaFontFamily: 'Arial', // Font default
        showLeaderboard: true
      },
      // Pengaturan optimal disleksia yang akan diterapkan saat mode diaktifkan
      optimalDyslexiaSettings: {
        fontSize: 18,
        lineSpacing: 1.8,
        fontFamily: 'OpenDyslexic'
      },
      preferencesMessage: '',
      
      // Notifications
      notifications: {
        borrowing: true,
        returning: true,
        events: true
      },
      notificationsMessage: '',
      
      // Password
      passwordForm: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      showOldPassword: false,
      showNewPassword: false,
      showConfirmPassword: false,
      isChangingPassword: false,
      passwordMessage: '',
      passwordSuccess: false,
    };
  },
  methods: {
    async fetchProfile() {
      this.isLoading = true;
      this.error = null;
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          this.error = 'Token tidak ditemukan. Silakan login kembali.';
          return;
        }

        const res = await fetch(`${this.apiBaseUrl}/api/profile`, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });
        
        const data = await res.json();
        console.log('Profile data received:', data);
        
        if (res.ok) {
          this.profile = data;
          // Clone untuk editing
          this.editableProfile = JSON.parse(JSON.stringify(data));
          this.loadPreferences();
          this.loadNotifications();
        } else {
          this.error = data.message || 'Gagal memuat profil.';
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        this.error = 'Terjadi kesalahan koneksi. Pastikan server berjalan.';
      } finally {
        this.isLoading = false;
      }
    },
    
    startEditing() {
      this.isEditing = true;
      // Deep clone untuk menghindari reference
      this.editableProfile = JSON.parse(JSON.stringify(this.profile));
      this.updateMessage = '';
    },
    
    cancelEditing() {
      this.isEditing = false;
      this.editableProfile = JSON.parse(JSON.stringify(this.profile));
      this.updateMessage = '';
    },
    
    async updateProfile() {
      this.isSaving = true;
      this.updateMessage = '';
      
      try {
        const token = localStorage.getItem('token');
        
        // Prepare data - pastikan field sesuai dengan backend
        const dataToSend = {
          nis_nip: this.editableProfile.nis_nip,
          nama: this.editableProfile.nama,
          jenis_kelamin: this.editableProfile.jenis_kelamin,
          tanggal_lahir: this.editableProfile.tanggal_lahir,
          institute: this.editableProfile.institute,
          major: this.editableProfile.major,
          angkatan: this.editableProfile.angkatan,
          no_telp: this.editableProfile.no_telp
        };
        
        console.log('Sending update data:', dataToSend);
        
        const res = await fetch(`${this.apiBaseUrl}/api/profile`, {
          method: 'PUT',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(dataToSend)
        });
        
        const data = await res.json();
        console.log('Update response:', data);
        
        if (res.ok && data.success) {
          // Update profile dengan data yang dikembalikan dari server
          if (data.data) {
            this.profile = JSON.parse(JSON.stringify(data.data));
            this.editableProfile = JSON.parse(JSON.stringify(data.data));
          }
          
          this.isEditing = false;
          this.updateSuccess = true;
          this.updateMessage = data.message || 'Profil berhasil diperbarui!';
          
          setTimeout(() => {
            this.updateMessage = '';
          }, 3000);
        } else {
          this.updateSuccess = false;
          this.updateMessage = data.message || 'Gagal memperbarui profil.';
        }
      } catch (err) {
        console.error('Error updating profile:', err);
        this.updateSuccess = false;
        this.updateMessage = 'Terjadi kesalahan saat memperbarui profil: ' + err.message;
      } finally {
        this.isSaving = false;
      }
    },
    
    async changePassword() {
      // Reset messages
      this.passwordMessage = '';
      this.passwordSuccess = false;
      
      // Validasi input
      if (!this.passwordForm.oldPassword || !this.passwordForm.newPassword || !this.passwordForm.confirmPassword) {
        this.passwordSuccess = false;
        this.passwordMessage = 'Semua field harus diisi!';
        return;
      }
      
      if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
        this.passwordSuccess = false;
        this.passwordMessage = 'Konfirmasi password tidak cocok!';
        return;
      }
      
      if (this.passwordForm.newPassword.length < 6) {
        this.passwordSuccess = false;
        this.passwordMessage = 'Password baru minimal 6 karakter!';
        return;
      }
      
      this.isChangingPassword = true;
      
      try {
        const token = localStorage.getItem('token');
        
        const res = await fetch(`${this.apiBaseUrl}/api/profile/change-password`, {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            oldPassword: this.passwordForm.oldPassword,
            newPassword: this.passwordForm.newPassword
          })
        });
        
        const data = await res.json();
        console.log('Change password response:', data);
        
        if (res.ok && data.success) {
          this.passwordSuccess = true;
          this.passwordMessage = data.message || 'Password berhasil diubah!';
          
          // Reset form
          this.passwordForm = {
            oldPassword: '',
            newPassword: '',
            confirmPassword: ''
          };
          
          // Hide password fields
          this.showOldPassword = false;
          this.showNewPassword = false;
          this.showConfirmPassword = false;
          
          setTimeout(() => {
            this.passwordMessage = '';
            this.passwordSuccess = false;
          }, 5000);
        } else {
          this.passwordSuccess = false;
          this.passwordMessage = data.message || 'Gagal mengubah password.';
        }
      } catch (err) {
        console.error('Error changing password:', err);
        this.passwordSuccess = false;
        this.passwordMessage = 'Terjadi kesalahan saat mengubah password: ' + err.message;
      } finally {
        this.isChangingPassword = false;
      }
    },
    
    loadPreferences() {
      const saved = localStorage.getItem('preferences');
      if (saved) {
        try {
          const savedPrefs = JSON.parse(saved);
          // Merge saved preferences with defaults
          this.preferences = {
            ...this.preferences,
            ...savedPrefs
          };
          
          // Jika mode disleksia aktif, terapkan pengaturan
          if (this.preferences.dyslexiaMode) {
            this.applyDyslexiaSettings();
          }
        } catch (e) {
          console.error('Error loading preferences:', e);
        }
      }
    },
    
    toggleDyslexiaMode() {
      if (this.preferences.dyslexiaMode) {
        // Jika diaktifkan, terapkan pengaturan optimal
        this.preferences.dyslexiaFontSize = this.optimalDyslexiaSettings.fontSize;
        this.preferences.dyslexiaLineSpacing = this.optimalDyslexiaSettings.lineSpacing;
        this.preferences.dyslexiaFontFamily = this.optimalDyslexiaSettings.fontFamily;
        this.applyDyslexiaSettings();
        this.showDyslexiaConfirm = true;
        setTimeout(() => {
          this.showDyslexiaConfirm = false;
        }, 5000);
      } else {
        // Jika dinonaktifkan, kembalikan ke pengaturan default
        this.removeDyslexiaSettings();
      }
      this.savePreferences();
    },
    
    applyDyslexiaSettings() {
      // Terapkan pengaturan disleksia ke seluruh dokumen
      document.documentElement.style.setProperty('--dyslexia-font-family', this.preferences.dyslexiaFontFamily);
      document.documentElement.style.setProperty('--dyslexia-font-size', this.preferences.dyslexiaFontSize + 'px');
      document.documentElement.style.setProperty('--dyslexia-line-spacing', this.preferences.dyslexiaLineSpacing);
      document.body.classList.add('dyslexia-friendly');
      
      // Terapkan pengaturan warna latar dan kontras yang optimal
      document.documentElement.style.setProperty('--background-color', '#FFFFF0'); // Cream color
      document.documentElement.style.setProperty('--text-color', '#333333');
      
      // Tambahkan class untuk styling global
      document.body.classList.add('high-contrast');
    },
    
    removeDyslexiaSettings() {
      // Hapus semua pengaturan disleksia
      document.documentElement.style.removeProperty('--dyslexia-font-family');
      document.documentElement.style.removeProperty('--dyslexia-font-size');
      document.documentElement.style.removeProperty('--dyslexia-line-spacing');
      document.documentElement.style.removeProperty('--background-color');
      document.documentElement.style.removeProperty('--text-color');
      
      // Hapus class styling
      document.body.classList.remove('dyslexia-friendly');
      document.body.classList.remove('high-contrast');
    },
    
    async savePreferences() {
      try {
        // Simpan ke localStorage
        localStorage.setItem('preferences', JSON.stringify(this.preferences));
        
        // Pastikan mode disleksia selalu aktif
        this.preferences.dyslexiaMode = true;
        
        // Terapkan pengaturan disleksia
        this.applyDyslexiaSettings();
        
        // Kirim ke server untuk sinkronisasi (jika ada)
        const token = localStorage.getItem('token');
        if (token) {
          await fetch(`${this.apiBaseUrl}/api/profile/preferences`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.preferences)
          });
        }
        
        this.preferencesMessage = 'Preferensi berhasil disimpan!';
        
        // Terapkan notifikasi jika diaktifkan
        if (this.notifications.borrowing || this.notifications.returning || this.notifications.events) {
          this.requestNotificationPermission();
        }
      } catch (error) {
        console.error('Error saving preferences:', error);
        this.preferencesMessage = 'Terjadi kesalahan saat menyimpan preferensi';
      }
      
      setTimeout(() => {
        this.preferencesMessage = '';
      }, 2000);
    },
    
    requestNotificationPermission() {
      if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            // Aktifkan service worker untuk notifikasi background
            this.registerServiceWorker();
          }
        });
      }
    },
    
    async registerServiceWorker() {
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/service-worker.js');
          console.log('ServiceWorker registration successful');
          
          // Kirim pengaturan notifikasi ke service worker
          registration.active?.postMessage({
            type: 'UPDATE_NOTIFICATIONS',
            notifications: this.notifications
          });
        } catch (error) {
          console.error('ServiceWorker registration failed:', error);
        }
      }
    },
    
    loadNotifications() {
      const saved = localStorage.getItem('notifications');
      if (saved) {
        try {
          this.notifications = JSON.parse(saved);
        } catch (e) {
          console.error('Error loading notifications:', e);
        }
      }
    },
    
    saveNotifications() {
      localStorage.setItem('notifications', JSON.stringify(this.notifications));
      this.notificationsMessage = 'Pengaturan notifikasi berhasil disimpan!';
      setTimeout(() => {
        this.notificationsMessage = '';
      }, 2000);
    },
    
    goBack() {
      this.$router.push('/');
    },
    
    getInitials(name) {
      if (!name) return '?';
      const parts = name.split(' ');
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
    },
    
    formatDate(dateStr) {
      if (!dateStr) return '-';
      try {
        const d = new Date(dateStr);
        return d.toLocaleDateString('id-ID', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        });
      } catch (e) {
        return '-';
      }
    },
    
    calculateAge(dateStr) {
      if (!dateStr) return '-';
      try {
        const dob = new Date(dateStr);
        const diff = Date.now() - dob.getTime();
        const age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
        return age > 0 ? age : '-';
      } catch (e) {
        return '-';
      }
    },
    
    isMembershipActive(expiredDate) {
      if (!expiredDate) return false;
      try {
        return new Date(expiredDate) > new Date();
      } catch (e) {
        return false;
      }
    },
    
    getBrowser() {
      const ua = navigator.userAgent;
      if (ua.includes('Chrome')) return 'Chrome - ' + this.getOS();
      if (ua.includes('Firefox')) return 'Firefox - ' + this.getOS();
      if (ua.includes('Safari')) return 'Safari - ' + this.getOS();
      if (ua.includes('Edge')) return 'Edge - ' + this.getOS();
      return 'Browser - ' + this.getOS();
    },
    
    getOS() {
      const ua = navigator.userAgent;
      if (ua.includes('Win')) return 'Windows';
      if (ua.includes('Mac')) return 'MacOS';
      if (ua.includes('Linux')) return 'Linux';
      if (ua.includes('Android')) return 'Android';
      if (ua.includes('iOS')) return 'iOS';
      return 'Unknown OS';
    },
    
    getCurrentDateTime() {
      const now = new Date();
      const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
      
      const day = days[now.getDay()];
      const date = now.getDate();
      const month = months[now.getMonth()];
      const year = now.getFullYear();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      
      return `${day}, ${date} ${month} ${year} - ${hours}:${minutes}`;
    },
  },
  
  mounted() {
    this.fetchProfile();
    
    // Apply saved dyslexia settings on mount
    if (this.preferences.dyslexiaMode) {
      document.documentElement.style.setProperty('--dyslexia-font-family', this.preferences.dyslexiaFontFamily);
      document.documentElement.style.setProperty('--dyslexia-font-size', this.preferences.dyslexiaFontSize + 'px');
      document.documentElement.style.setProperty('--dyslexia-line-spacing', this.preferences.dyslexiaLineSpacing);
      document.body.classList.add('dyslexia-friendly');
    }
  },
  
  beforeUnmount() {
    // Clean up dyslexia settings when component is destroyed
    document.documentElement.style.removeProperty('--dyslexia-font-family');
    document.documentElement.style.removeProperty('--dyslexia-font-size');
    document.documentElement.style.removeProperty('--dyslexia-line-spacing');
    document.body.classList.remove('dyslexia-friendly');
  },
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.min-h-screen { 
  min-height: 100vh; 
}

.animate-spin { 
  animation: spin 1s linear infinite; 
}

@keyframes spin { 
  100% { 
    transform: rotate(360deg); 
  } 
}

/* Toggle Switch */
.toggle-switch {
  width: 2.75rem;
  height: 1.5rem;
  background-color: #e5e7eb;
  border-radius: 9999px;
  position: relative;
  transition: background-color 0.2s;
}

.toggle-switch::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 1.25rem;
  height: 1.25rem;
  background-color: white;
  border-radius: 9999px;
  border: 1px solid #d1d5db;
  transition: transform 0.2s;
}

input:checked ~ .toggle-switch {
  background-color: #2563eb;
}

input:checked ~ .toggle-switch::after {
  transform: translateX(1.25rem);
  border-color: white;
}

input:focus ~ .toggle-switch {
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3);
}

/* Utility Classes */
.flex { display: flex; }
.flex-1 { flex: 1; }
.flex-col { flex-direction: column; }
.flex-shrink-0 { flex-shrink: 0; }
.items-center { align-items: center; }
.items-start { align-items: flex-start; }
.justify-center { justify-content: center; }
.justify-between { justify-content: space-between; }

.w-4 { width: 1rem; }
.h-4 { height: 1rem; }
.w-5 { width: 1.25rem; }
.h-5 { height: 1.25rem; }
.w-6 { width: 1.5rem; }
.h-6 { height: 1.5rem; }
.w-8 { width: 2rem; }
.h-8 { height: 2rem; }
.w-10 { width: 2.5rem; }
.h-10 { height: 2.5rem; }
.w-12 { width: 3rem; }
.h-12 { height: 3rem; }
.w-16 { width: 4rem; }
.h-16 { height: 4rem; }
.w-20 { width: 5rem; }
.h-20 { height: 5rem; }
.w-64 { width: 16rem; }
.w-full { width: 100%; }
.max-w-md { max-width: 28rem; }
.max-w-3xl { max-width: 48rem; }
.h-full { height: 100%; }

.p-3 { padding: 0.75rem; }
.p-4 { padding: 1rem; }
.p-6 { padding: 1.5rem; }
.p-8 { padding: 2rem; }
.px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
.px-4 { padding-left: 1rem; padding-right: 1rem; }
.px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
.py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
.py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
.py-2\.5 { padding-top: 0.625rem; padding-bottom: 0.625rem; }
.py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
.pr-10 { padding-right: 2.5rem; }

.m-auto { margin: auto; }
.mx-auto { margin-left: auto; margin-right: auto; }
.mr-1 { margin-right: 0.25rem; }
.mr-2 { margin-right: 0.5rem; }
.mr-3 { margin-right: 0.75rem; }
.mt-0\.5 { margin-top: 0.125rem; }
.mt-1 { margin-top: 0.25rem; }
.mt-2 { margin-top: 0.5rem; }
.mt-3 { margin-top: 0.75rem; }
.mt-4 { margin-top: 1rem; }
.mt-6 { margin-top: 1.5rem; }
.mb-1 { margin-bottom: 0.25rem; }
.mb-2 { margin-bottom: 0.5rem; }
.mb-3 { margin-bottom: 0.75rem; }
.mb-4 { margin-bottom: 1rem; }
.mb-6 { margin-bottom: 1.5rem; }

.space-y-1 > * + * { margin-top: 0.25rem; }
.space-y-3 > * + * { margin-top: 0.75rem; }
.space-y-6 > * + * { margin-top: 1.5rem; }
.gap-3 { gap: 0.75rem; }
.gap-4 { gap: 1rem; }

.grid { display: grid; }
.grid-cols-1 { grid-template-columns: repeat(1, 1fr); }
.grid-cols-2 { grid-template-columns: repeat(2, 1fr); }

@media (min-width: 768px) {
  .md\:grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
}

.text-xs { font-size: 0.75rem; line-height: 1rem; }
.text-sm { font-size: 0.875rem; line-height: 1.25rem; }
.text-base { font-size: 1rem; line-height: 1.5rem; }
.text-lg { font-size: 1.125rem; line-height: 1.75rem; }
.text-xl { font-size: 1.25rem; line-height: 1.75rem; }
.text-2xl { font-size: 1.5rem; line-height: 2rem; }

.font-medium { font-weight: 500; }
.font-semibold { font-weight: 600; }
.font-bold { font-weight: 700; }

.text-left { text-align: left; }
.text-center { text-align: center; }
.capitalize { text-transform: capitalize; }

.text-white { color: #ffffff; }
.text-gray-400 { color: #9ca3af; }
.text-gray-500 { color: #6b7280; }
.text-gray-600 { color: #4b5563; }
.text-gray-700 { color: #374151; }
.text-gray-900 { color: #111827; }
.text-blue-600 { color: #2563eb; }
.text-green-500 { color: #22c55e; }
.text-green-600 { color: #16a34a; }
.text-green-800 { color: #166534; }
.text-red-600 { color: #dc2626; }
.text-red-800 { color: #991b1b; }

.bg-white { background-color: #ffffff; }
.bg-gray-50 { background-color: #f9fafb; }
.bg-gray-200 { background-color: #e5e7eb; }
.bg-gray-300 { background-color: #d1d5db; }
.bg-blue-50 { background-color: #eff6ff; }
.bg-blue-100 { background-color: #dbeafe; }
.bg-blue-400 { background-color: #60a5fa; }
.bg-blue-500 { background-color: #3b82f6; }
.bg-blue-600 { background-color: #2563eb; }
.bg-blue-700 { background-color: #1d4ed8; }
.bg-green-50 { background-color: #f0fdf4; }
.bg-green-500 { background-color: #22c55e; }
.bg-red-50 { background-color: #fef2f2; }
.bg-red-100 { background-color: #fee2e2; }

.bg-gradient-to-br {
  background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
}

.from-blue-400 { --tw-gradient-from: #60a5fa; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(96, 165, 250, 0)); }
.to-blue-600 { --tw-gradient-to: #2563eb; }

.hover\:bg-gray-50:hover { background-color: #f9fafb; }
.hover\:bg-gray-300:hover { background-color: #d1d5db; }
.hover\:bg-blue-700:hover { background-color: #1d4ed8; }
.hover\:text-gray-700:hover { color: #374151; }
.hover\:text-gray-900:hover { color: #111827; }
.hover\:text-blue-700:hover { color: #1d4ed8; }

.border { border-width: 1px; }
.border-2 { border-width: 2px; }
.border-t { border-top-width: 1px; }
.border-r { border-right-width: 1px; }
.border-b { border-bottom-width: 1px; }

.border-white { border-color: #ffffff; }
.border-gray-200 { border-color: #e5e7eb; }
.border-gray-300 { border-color: #d1d5db; }
.border-blue-200 { border-color: #bfdbfe; }
.border-blue-500 { border-color: #3b82f6; }

.focus\:ring-2:focus { box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5); }
.focus\:ring-blue-500:focus { box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.5); }
.focus\:border-transparent:focus { border-color: transparent; }

.rounded-lg { border-radius: 0.5rem; }
.rounded-xl { border-radius: 0.75rem; }
.rounded-full { border-radius: 9999px; }

.shadow-sm { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
.shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }

.overflow-auto { overflow: auto; }

.relative { position: relative; }
.absolute { position: absolute; }
.inline-block { display: inline-block; }
.block { display: block; }
.bottom-0 { bottom: 0; }
.right-0 { right: 0; }
.right-3 { right: 0.75rem; }
.top-1\/2 { top: 50%; }
.transform { transform: translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)); }
.-translate-y-1\/2 { --tw-translate-y: -50%; }

.transition-colors { 
  transition-property: color, background-color, border-color; 
  transition-duration: 150ms; 
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.cursor-pointer { cursor: pointer; }
.cursor-not-allowed { cursor: not-allowed; }

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.opacity-50 { opacity: 0.5; }
.opacity-60 { opacity: 0.6; }

.disabled\:opacity-50:disabled { opacity: 0.5; }

input:focus,
select:focus,
button:focus {
  outline: none;
}

button {
  cursor: pointer;
  transition: all 0.2s;
}

button:disabled {
  cursor: not-allowed;
}

input[type="text"],
input[type="tel"],
input[type="date"],
input[type="password"],
select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}

input[type="date"]::-webkit-calendar-picker-indicator {
  cursor: pointer;
}

input[type="range"] {
  -webkit-appearance: none;
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  outline: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  background: #2563eb;
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.2s;
}

input[type="range"]::-webkit-slider-thumb:hover {
  background: #1d4ed8;
}

@font-face {
  font-family: 'OpenDyslexic';
  src: url('/fonts/OpenDyslexic-Regular.otf') format('opentype');
  font-weight: normal;
  font-style: normal;
}

.dyslexia-friendly {
  font-family: var(--dyslexia-font-family, 'OpenDyslexic');
  font-size: var(--dyslexia-font-size, 18px);
  line-height: var(--dyslexia-line-spacing, 1.8);
  letter-spacing: 0.5px;
  word-spacing: 1px;
  background-color: var(--background-color, #FFFFF0);
  color: var(--text-color, #333333);
}

/* Pengaturan global untuk mode disleksia */
.dyslexia-friendly * {
  font-family: inherit;
  line-height: inherit;
}

/* Pengaturan khusus untuk heading dalam mode disleksia */
.dyslexia-friendly h1,
.dyslexia-friendly h2,
.dyslexia-friendly h3 {
  margin-bottom: 1.2em;
  font-weight: 600;
}

/* Pengaturan paragraf untuk kemudahan membaca */
.dyslexia-friendly p {
  margin-bottom: 1.5em;
  max-width: 80ch;
}

/* Pengaturan kontras tinggi */
.high-contrast {
  --link-color: #0000EE;
  --visited-link-color: #551A8B;
}

.high-contrast a {
  color: var(--link-color);
  text-decoration: underline;
}

.high-contrast a:visited {
  color: var(--visited-link-color);
}

/* Animasi yang lebih lembut untuk mengurangi distraksi */
.dyslexia-friendly * {
  transition: all 0.3s ease-out;
}

/* Pengaturan untuk input dan tombol */
.dyslexia-friendly input,
.dyslexia-friendly button {
  font-size: inherit;
  padding: 0.8em 1.2em;
}
</style>