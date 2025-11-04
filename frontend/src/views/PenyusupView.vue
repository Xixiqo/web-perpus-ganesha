<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
    <!-- Decorative Background Elements -->
    <div class="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
    <div class="absolute bottom-0 left-0 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
    <div class="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

    <!-- Efek Kaca Pecah -->
    <div v-if="showShatter" class="absolute inset-0 pointer-events-none z-50">
      <div 
        v-for="i in 15" 
        :key="i" 
        class="absolute top-1/2 left-1/2 w-16 h-16 bg-white/40 backdrop-blur-sm border border-blue-200 animate-shatter shadow-lg"
        :style="getShardStyle(i)"
      ></div>
    </div>

    <!-- Header with Library Branding -->
    <header class="bg-white shadow-sm border-b-4 border-blue-600 relative z-10">
      <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
            </svg>
          </div>
          <div>
            <h1 class="text-xl font-bold text-gray-800">Perpustakaan Digital</h1>
            <p class="text-xs text-gray-500">Sistem Keamanan Aktif</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <span class="text-sm text-red-600 font-semibold">MONITORING</span>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-6xl mx-auto px-4 py-12">
      <div class="text-center mb-12 relative">
        <!-- Warning Icon dengan Glitch Effect -->
        <div class="inline-flex mb-6" :class="{ 'animate-shake': showGlitch }">
          <div class="relative">
            <div class="w-32 h-32 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-2xl">
              <svg class="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
            </div>
            <div class="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center border-4 border-white">
              <svg class="w-5 h-5 text-yellow-900" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"/>
              </svg>
            </div>
          </div>
        </div>

        <h1 class="text-5xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
          Akses Ditolak
        </h1>
        <p class="text-xl text-gray-600 font-medium tracking-wide mb-8">
          Unauthorized Access Detected - Aktivitas Mencurigakan Terdeteksi
        </p>

        <!-- Quote Nyelekit -->
        <div class="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8 border-l-8 border-blue-600 mb-8">
          <svg class="w-12 h-12 text-blue-600 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
          </svg>
          <p class="text-2xl md:text-3xl font-bold text-gray-800 italic mb-2">
            "Pencuri tidak membaca,<br>dan pembaca tidak mencuri"
          </p>
          <p class="text-base text-gray-500 mt-4">
            Perpustakaan adalah tempat untuk belajar dengan integritas,<br>bukan untuk aksi yang melanggar aturan.
          </p>
        </div>
      </div>

      <!-- Information Cards -->
      <div class="grid md:grid-cols-2 gap-6 mb-8">
        <!-- Informasi Aktivitas -->
        <div class="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-600">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-800">Informasi Aktivitas</h3>
          </div>
          <div class="space-y-3">
            <div class="flex justify-between items-center py-2 border-b border-gray-100">
              <span class="text-sm text-gray-600 font-medium">Alamat IP</span>
              <span class="text-sm font-mono font-bold text-gray-800">{{ ipAddress }}</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-gray-100">
              <span class="text-sm text-gray-600 font-medium">Waktu Akses</span>
              <span class="text-sm font-mono text-gray-800">{{ timestamp }}</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-gray-100">
              <span class="text-sm text-gray-600 font-medium">Lokasi</span>
              <span class="text-sm font-mono text-gray-800">{{ location }}</span>
            </div>
            <div class="flex justify-between items-center py-2">
              <span class="text-sm text-gray-600 font-medium">Session ID</span>
              <span class="text-xs font-mono text-gray-800 break-all">{{ sessionId }}</span>
            </div>
          </div>
        </div>

        <!-- Status Sistem -->
        <div class="bg-white rounded-xl shadow-lg p-6 border-t-4 border-red-600">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-800">Status Keamanan</h3>
          </div>
          <div class="space-y-3">
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span class="text-sm text-gray-700">Log aktivitas tersimpan</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span class="text-sm text-gray-700">Notifikasi admin terkirim</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              <span class="text-sm text-gray-700">Analisis keamanan berjalan</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span class="text-sm text-gray-700">Akses ditolak - Level tinggi</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Legal Warning -->
      <div class="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl shadow-lg p-8 mb-8 border-l-8 border-amber-500">
        <div class="flex items-start gap-4 mb-6">
          <div class="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"/>
            </svg>
          </div>
          <div>
            <h3 class="text-2xl font-bold text-gray-800 mb-2">Peringatan Hukum</h3>
            <p class="text-gray-700 leading-relaxed">
              Akses tidak sah ke sistem ini melanggar hukum yang berlaku di Indonesia. Setiap upaya untuk mengakses, memodifikasi, atau merusak sistem akan diproses secara hukum.
            </p>
          </div>
        </div>
        
        <div class="grid md:grid-cols-3 gap-4">
          <div class="bg-white rounded-lg p-4 shadow-sm border-l-4 border-red-500">
            <h4 class="font-bold text-red-700 mb-2">UU ITE Pasal 30</h4>
            <p class="text-sm text-gray-600">Pidana penjara maksimal 8 tahun dan/atau denda Rp 800 juta</p>
          </div>
          
          <div class="bg-white rounded-lg p-4 shadow-sm border-l-4 border-red-500">
            <h4 class="font-bold text-red-700 mb-2">KUHP Pasal 363</h4>
            <p class="text-sm text-gray-600">Pencurian data dengan ancaman 7 tahun penjara</p>
          </div>
          
          <div class="bg-white rounded-lg p-4 shadow-sm border-l-4 border-red-500">
            <h4 class="font-bold text-red-700 mb-2">UU Perlindungan Data</h4>
            <p class="text-sm text-gray-600">Sanksi administratif dan pidana untuk akses ilegal</p>
          </div>
        </div>
      </div>

      <!-- Action Section -->
      <div class="bg-white rounded-xl shadow-lg p-8 text-center">
        <div class="max-w-2xl mx-auto">
          <div class="flex items-center justify-center gap-3 mb-6">
            <svg class="w-8 h-8 text-blue-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
            <p class="text-lg text-gray-700">
              Aktivitas Anda telah tercatat dalam sistem keamanan.<br>
              Administrator telah menerima notifikasi tentang percobaan akses ini.
            </p>
          </div>

          <button 
            @click="goBack"
            class="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl mb-6"
          >
            <span class="flex items-center gap-2 justify-center">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
              </svg>
              Kembali ke Halaman Utama
            </span>
          </button>
          
          <div class="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-6 py-3 rounded-full">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span class="font-semibold">Redirect otomatis dalam <span class="text-blue-900 text-lg">{{ countdown }}</span> detik</span>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 mt-12 py-6">
      <div class="max-w-7xl mx-auto px-4 text-center text-sm text-gray-600">
        <p>Sistem Keamanan Perpustakaan Digital © 2024 | Dilindungi oleh Hukum</p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'PenyusupView',
  data() {
    return {
      showGlitch: false,
      showShatter: false,
      ipAddress: 'XXX.XXX.XXX.XXX',
      timestamp: '',
      location: 'Detecting...',
      sessionId: '',
      countdown: 15,
      countdownInterval: null
    }
  },
  mounted() {
    this.initEffects()
    this.generateSessionData()
    this.startCountdown()
  },
  beforeUnmount() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval)
    }
  },
  methods: {
    initEffects() {
      setTimeout(() => {
        this.showShatter = true
      }, 100)

      setInterval(() => {
        this.showGlitch = true
        setTimeout(() => {
          this.showGlitch = false
        }, 300)
      }, 4000)
    },
    generateSessionData() {
      this.ipAddress = `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`
      
      this.timestamp = new Date().toLocaleString('id-ID', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
      
      this.sessionId = Array.from({ length: 16 }, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join('').toUpperCase()
      
      this.location = 'Yogyakarta, Indonesia'
    },
    getShardStyle(index) {
      const angle = (index * 24) + Math.random() * 15
      const distance = 150 + Math.random() * 250
      const rotation = Math.random() * 360
      
      return {
        transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
        clipPath: 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)',
        animationDelay: `${Math.random() * 0.6}s`
      }
    },
    startCountdown() {
      this.countdownInterval = setInterval(() => {
        this.countdown--
        if (this.countdown <= 0) {
          this.goBack()
        }
      }, 1000)
    },
    goBack() {
      if (this.countdownInterval) {
        clearInterval(this.countdownInterval)
      }
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
@keyframes shatter {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) translateX(var(--tx, 300px)) translateY(var(--ty, -300px)) rotate(720deg) scale(0.1);
    opacity: 0;
  }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px) rotate(-5deg); }
  75% { transform: translateX(10px) rotate(5deg); }
}

@keyframes blob {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
}

.animate-shatter {
  animation: shatter 2s ease-out forwards;
}

.animate-shake {
  animation: shake 0.5s ease-in-out;
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
</style>