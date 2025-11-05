<template>
  <div class="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex items-center justify-center px-4 py-8">
    <div class="max-w-4xl w-full">
      
      <!-- Main Card -->
      <div class="bg-white rounded-3xl shadow-2xl overflow-hidden">
        
        <!-- Header dengan Illustration -->
        <div class="bg-gradient-to-r from-red-500 to-pink-500 p-8 text-center relative overflow-hidden">
          <!-- Decorative circles -->
          <div class="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-16 -translate-y-16"></div>
          <div class="absolute bottom-0 right-0 w-40 h-40 bg-white/10 rounded-full translate-x-20 translate-y-20"></div>
          
          <!-- SVG Illustration - Confused Person -->
          <div class="relative z-10 mb-4">
            <svg class="w-32 h-32 md:w-40 md:h-40 mx-auto animate-float" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <!-- Head -->
              <circle cx="100" cy="80" r="45" fill="#FEF3C7"/>
              <!-- Eyes -->
              <circle cx="85" cy="75" r="8" fill="#374151"/>
              <circle cx="115" cy="75" r="8" fill="#374151"/>
              <!-- Mouth (confused) -->
              <path d="M 80 95 Q 100 100 120 95" stroke="#374151" stroke-width="3" fill="none" stroke-linecap="round"/>
              <!-- Body -->
              <rect x="70" y="120" width="60" height="70" rx="10" fill="#DBEAFE"/>
              <!-- Arms (shrugging) -->
              <path d="M 70 130 L 40 140 L 35 135" stroke="#DBEAFE" stroke-width="8" fill="none" stroke-linecap="round"/>
              <path d="M 130 130 L 160 140 L 165 135" stroke="#DBEAFE" stroke-width="8" fill="none" stroke-linecap="round"/>
              <!-- Question marks -->
              <text x="30" y="60" font-size="24" fill="#FDE047" class="animate-pulse">?</text>
              <text x="160" y="60" font-size="24" fill="#FDE047" class="animate-pulse" style="animation-delay: 0.5s">?</text>
            </svg>
          </div>
          
          <h1 class="text-4xl md:text-5xl font-black text-white mb-2">
            Ehh... Tunggu Dulu!
          </h1>
          <p class="text-xl md:text-2xl text-white/90 font-semibold">
            Kayaknya kamu salah jalan deh
          </p>
        </div>

        <!-- Content -->
        <div class="p-8 md:p-12">
          
          <!-- Main Message -->
          <div class="text-center mb-10">
            <div class="inline-flex items-center gap-3 bg-yellow-100 text-yellow-800 px-6 py-3 rounded-full mb-6">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"/>
              </svg>
              <span class="font-bold">Akses Tidak Diizinkan</span>
            </div>
            
            <h2 class="text-3xl md:text-4xl font-bold text-gray-800 mb-4 leading-tight">
              "Hayoo... Mau Ngapain Kamu?"
            </h2>
            <p class="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Sepertinya Kamu mencoba mengakses halaman yang nggak boleh diakses nih. 
              Inget ya, ini perpustakaan digital yang aman dan terpercaya!
            </p>
          </div>

          <!-- Quote Section -->
          <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mb-10 relative overflow-hidden">
            <svg class="absolute top-4 left-4 w-12 h-12 text-blue-200 opacity-50" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
            </svg>
            <div class="relative z-10 text-center">
              <p class="text-2xl md:text-3xl font-bold text-gray-800 mb-3 italic">
                "Pembaca tidak mencuri,<br>
                <span class="text-blue-600">Pencuri tidak membaca"</span>
              </p>
              <p class="text-sm text-gray-500">— Pepatah Perpustakaan</p>
            </div>
          </div>

          <!-- Legal Warning -->
          <div class="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 mb-10">
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0">
                <svg class="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z"/>
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-bold text-red-800 mb-3">Peringatan Hukum</h3>
                <p class="text-sm text-red-700 mb-4">
                  Akses tidak sah ke sistem ini melanggar hukum yang berlaku. 
                  Setiap upaya akses ilegal akan diproses sesuai ketentuan hukum.
                </p>
                
                <div class="grid sm:grid-cols-3 gap-3">
                  <div class="bg-white rounded-lg p-3 text-center">
                    <p class="text-xs font-bold text-red-600 mb-1">UU ITE Pasal 30</p>
                    <p class="text-xs text-gray-600">Penjara 8 tahun / Denda 800 juta</p>
                  </div>
                  <div class="bg-white rounded-lg p-3 text-center">
                    <p class="text-xs font-bold text-red-600 mb-1">KUHP Pasal 363</p>
                    <p class="text-xs text-gray-600">Penjara 7 tahun</p>
                  </div>
                  <div class="bg-white rounded-lg p-3 text-center">
                    <p class="text-xs font-bold text-red-600 mb-1">UU Perlindungan Data</p>
                    <p class="text-xs text-gray-600">Sanksi pidana & administratif</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="text-center space-y-4">
            <button 
              @click="goBack"
              class="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-lg py-4 px-10 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg inline-flex items-center gap-3"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
              </svg>
              Kembali ke Halaman Aman
            </button>
            
            <div>
              <p class="text-sm text-gray-500">
                <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Otomatis kembali dalam <span class="font-bold text-red-600">{{ countdown }}</span> detik
              </p>
            </div>
          </div>

        </div>
      </div>

      <!-- Footer -->
      <div class="text-center mt-8 text-sm text-gray-600">
        <p>Perpustakaan Ganesha Stembayo © 2025 • Dilindungi Hukum</p>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'PenyusupView',
  data() {
    return {
      countdown: 20,
      countdownInterval: null
    }
  },
  mounted() {
    this.startCountdown()
  },
  beforeUnmount() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval)
    }
  },
  methods: {
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
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

@media (max-width: 640px) {
  .animate-float {
    animation: float 2s ease-in-out infinite;
  }
}
</style>