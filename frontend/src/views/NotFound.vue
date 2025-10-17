<template>
  <div class="not-found-container">
      <div class="content-wrapper">
        <!-- Animated 404 Text -->
        <div class="error-section">
          <h1 class="error-code" :class="{ 'animate-in': isVisible }">
            <span class="digit">4</span>
            <span class="digit delay-1">0</span>
            <span class="digit delay-2">4</span>
          </h1>
          <h2 class="error-title" :class="{ 'fade-in': isVisible }">Oops! Halaman Tidak Ditemukan</h2>
          <p class="error-description" :class="{ 'fade-in-delay': isVisible }">
            Sepertinya halaman yang Anda cari telah dipindahkan, dihapus, atau mungkin tidak pernah ada.
          </p>
        </div>

        <!-- Interactive Illustration -->
        <div class="illustration-section" :class="{ 'float-in': isVisible }">
          <div class="floating-elements">
            <div class="book book-1" @mouseenter="triggerBookAnimation(1)" :class="{ 'book-wiggle': animatedBook === 1 }">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
            </div>
            <div class="book book-2" @mouseenter="triggerBookAnimation(2)" :class="{ 'book-wiggle': animatedBook === 2 }">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
            </div>
            <div class="book book-3" @mouseenter="triggerBookAnimation(3)" :class="{ 'book-wiggle': animatedBook === 3 }">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
            </div>
            
            <!-- Search Icon -->
            <div class="search-icon" @click="triggerSearchPulse" :class="{ 'pulse': searchPulse }">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons" :class="{ 'slide-up': isVisible }">
          <button @click="goHome" class="btn btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            Kembali ke Beranda
          </button>
          <button @click="goBack" class="btn btn-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Halaman Sebelumnya
          </button>
        </div>

        <!-- Quick Links -->
        <div class="quick-links" :class="{ 'fade-in-up': isVisible }">
          <h3>Halaman Populer:</h3>
          <div class="link-grid">
            <router-link to="/" class="quick-link-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              </svg>
              Beranda
            </router-link>
            <router-link to="/cari" class="quick-link-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
              Koleksi Buku
            </router-link>
            <router-link to="/informasi" class="quick-link-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              Informasi
            </router-link>
          </div>
        </div>
      </div>

      <!-- Background Decorations -->
      <div class="bg-decoration decoration-1"></div>
      <div class="bg-decoration decoration-2"></div>
      <div class="bg-decoration decoration-3"></div>
    </div>
</template>

<script>
export default {
  name: 'NotFound',
  data() {
    return {
      isVisible: false,
      animatedBook: null,
      searchPulse: false
    }
  },
  mounted() {
    setTimeout(() => {
      this.isVisible = true;
    }, 100);
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    goHome() {
      this.$router.push('/');
    },
    triggerBookAnimation(bookNumber) {
      this.animatedBook = bookNumber;
      setTimeout(() => {
        this.animatedBook = null;
      }, 600);
    },
    triggerSearchPulse() {
      this.searchPulse = true;
      setTimeout(() => {
        this.searchPulse = false;
      }, 600);
    }
  }
}
</script>

<style scoped>
.not-found-container {
  background: linear-gradient(135deg, #f0f4ff 0%, #e6eeff 50%, #f0f4ff 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  min-height: calc(100vh - 140px);
}

.content-wrapper {
  max-width: 1200px;
  width: 100%;
  text-align: center;
  position: relative;
  z-index: 2;
}

/* Error Section */
.error-section {
  margin-bottom: 60px;
}

.error-code {
  font-size: 10rem;
  font-weight: 900;
  color: var(--primary);
  margin: 0 0 20px 0;
  line-height: 1;
  display: flex;
  justify-content: center;
  gap: 20px;
}

.error-code .digit {
  display: inline-block;
  opacity: 0;
  transform: translateY(50px) rotate(10deg);
}

.error-code.animate-in .digit {
  animation: digitDrop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.error-code .delay-1 {
  animation-delay: 0.1s;
}

.error-code .delay-2 {
  animation-delay: 0.2s;
}

@keyframes digitDrop {
  to {
    opacity: 1;
    transform: translateY(0) rotate(0);
  }
}

.error-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 16px 0;
  opacity: 0;
}

.error-title.fade-in {
  animation: fadeIn 0.6s ease forwards 0.4s;
}

.error-description {
  font-size: 1.1rem;
  color: #64748b;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
  opacity: 0;
}

.error-description.fade-in-delay {
  animation: fadeIn 0.6s ease forwards 0.6s;
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

/* Illustration Section */
.illustration-section {
  margin: 60px 0;
  opacity: 0;
}

.illustration-section.float-in {
  animation: floatIn 0.8s ease forwards 0.8s;
}

@keyframes floatIn {
  to {
    opacity: 1;
  }
}

.floating-elements {
  position: relative;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.book {
  position: absolute;
  width: 80px;
  height: 80px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(44, 100, 227, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.book svg {
  width: 40px;
  height: 40px;
  color: var(--primary);
}

.book:hover {
  transform: translateY(-10px) scale(1.05);
  box-shadow: 0 15px 40px rgba(44, 100, 227, 0.3);
}

.book-1 {
  top: 20%;
  left: 20%;
  animation: float1 3s ease-in-out infinite;
}

.book-2 {
  top: 50%;
  right: 15%;
  animation: float2 3.5s ease-in-out infinite;
}

.book-3 {
  bottom: 20%;
  left: 25%;
  animation: float3 4s ease-in-out infinite;
}

.book-wiggle {
  animation: wiggle 0.6s ease !important;
}

@keyframes wiggle {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-10deg); }
  75% { transform: rotate(10deg); }
}

@keyframes float1 {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

@keyframes float2 {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-25px); }
}

@keyframes float3 {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
}

.search-icon {
  width: 120px;
  height: 120px;
  background: var(--primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 15px 40px rgba(44, 100, 227, 0.4);
  cursor: pointer;
  transition: all 0.3s ease;
  animation: rotate 6s linear infinite;
}

.search-icon:hover {
  transform: scale(1.1);
  box-shadow: 0 20px 50px rgba(44, 100, 227, 0.5);
}

.search-icon.pulse {
  animation: pulsate 0.6s ease;
}

@keyframes pulsate {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.search-icon svg {
  width: 60px;
  height: 60px;
  color: white;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
  margin: 40px 0;
  opacity: 0;
  transform: translateY(30px);
}

.action-buttons.slide-up {
  animation: slideUp 0.6s ease forwards 1s;
}

@keyframes slideUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.btn {
  padding: 14px 32px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
}

.btn svg {
  transition: transform 0.3s ease;
}

.btn:hover svg {
  transform: translateX(-3px);
}

.btn-primary {
  background: var(--primary);
  color: white;
  box-shadow: 0 4px 15px rgba(44, 100, 227, 0.3);
}

.btn-primary:hover {
  background: #2C64E3;
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(44, 100, 227, 0.4);
}

.btn-secondary {
  background: white;
  color: #64748b;
  border: 2px solid #e2e8f0;
}

.btn-secondary:hover {
  border-color: var(--primary);
  color: var(--primary);
  transform: translateY(-3px);
}

/* Quick Links */
.quick-links {
  margin-top: 60px;
  opacity: 0;
  transform: translateY(30px);
}

.quick-links.fade-in-up {
  animation: slideUp 0.6s ease forwards 1.2s;
}

.quick-links h3 {
  font-size: 1.2rem;
  color: #1e293b;
  margin-bottom: 24px;
  font-weight: 600;
}

.link-grid {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.quick-link-item {
  padding: 12px 24px;
  background: white;
  border-radius: 10px;
  text-decoration: none;
  color: #64748b;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.quick-link-item:hover {
  color: var(--primary);
  transform: translateY(-3px);
  box-shadow: 0 4px 15px rgba(44, 100, 227, 0.2);
}

/* Background Decorations */
.bg-decoration {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
  pointer-events: none;
}

.decoration-1 {
  width: 400px;
  height: 400px;
  background: var(--primary);
  top: -100px;
  right: -100px;
  animation: pulse1 8s ease-in-out infinite;
}

.decoration-2 {
  width: 300px;
  height: 300px;
  background: var(--primary);
  bottom: -50px;
  left: -50px;
  animation: pulse2 10s ease-in-out infinite;
}

.decoration-3 {
  width: 200px;
  height: 200px;
  background: var(--primary);
  top: 50%;
  left: 10%;
  animation: pulse3 12s ease-in-out infinite;
}

@keyframes pulse1 {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

@keyframes pulse2 {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.3); }
}

@keyframes pulse3 {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

/* Responsive */
@media (max-width: 768px) {
  .error-code {
    font-size: 6rem;
    gap: 10px;
  }

  .error-title {
    font-size: 1.5rem;
  }

  .error-description {
    font-size: 1rem;
  }

  .floating-elements {
    height: 250px;
  }

  .book {
    width: 60px;
    height: 60px;
  }

  .book svg {
    width: 30px;
    height: 30px;
  }

  .search-icon {
    width: 100px;
    height: 100px;
  }

  .search-icon svg {
    width: 50px;
    height: 50px;
  }

  .btn {
    padding: 12px 24px;
    font-size: 0.9rem;
  }

  .action-buttons {
    flex-direction: column;
    align-items: stretch;
  }
}

@media (max-width: 480px) {
  .not-found-container {
    padding: 40px 16px;
  }

  .error-code {
    font-size: 4rem;
  }

  .error-title {
    font-size: 1.25rem;
  }

  .floating-elements {
    height: 200px;
  }

  .book-1 {
    left: 10%;
  }

  .book-2 {
    right: 10%;
  }

  .book-3 {
    left: 15%;
  }
}
</style>