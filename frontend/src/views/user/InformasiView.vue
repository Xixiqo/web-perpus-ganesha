<template>
  <div class="informasi-page">
    <!-- Hero Section with Background Image -->
    <section class="hero-section">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1 class="hero-title">Visi & Misi</h1>

        <!-- Visi & Misi Content (dipindah ke dalam hero section) -->
        <div class="container content-wrapper">
          <div class="cards-wrapper">
            <!-- Card Visi - Slide from Left -->
            <div class="info-card visi-card" :class="{ 'slide-in-left': isVisible }">
              <div class="card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              </div>
              <h2 class="card-title">Visi</h2>
              <p class="card-description">
                Terwujudnya Insan Pembelajar yang Cerdas, Berkarakter, Berwawasan Luas, dan Berbudi Pekerti Luhur dengan
                Memberdayakan Perpustakaan.
              </p>
            </div>

            <!-- Card Misi - Slide from Right -->
            <div class="info-card misi-card" :class="{ 'slide-in-right': isVisible }">
              <div class="card-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <circle cx="12" cy="12" r="6"></circle>
                  <circle cx="12" cy="12" r="2"></circle>
                </svg>
              </div>
              <h2 class="card-title">Misi</h2>
              <ul class="misi-list">
                <li><span class="bullet"></span>Mewujudkan Perpustakaan yang nyaman dan menyenangkan</li>
                <li><span class="bullet"></span>Menyediakan Pelayanan Perpustakaan yang ramah dengan mengedepankan 5S</li>
                <li><span class="bullet"></span>Menyediakan Bahan Koleksi Perpustakaan yang Representatif</li>
                <li><span class="bullet"></span>Mengembangkan Pelayanan Perpustakaan Berbasis IT</li>
                <li><span class="bullet"></span>Mewujudkan Pemustaka yang Berprestasi</li>
                <li><span class="bullet"></span>Mengembangkan Koleksi Perpustakaan Sesuai Kebutuhan</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Additional Info Section -->
    <section class="additional-info">
      <div class="container">
        <div class="info-grid">
          <!-- Tentang Perpustakaan -->
          <div class="info-item" data-aos="fade-right">
            <div class="info-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
            </div>
            <h3>Tentang Kami</h3>
            <p>Perpustakaan Ganesha Stembayo adalah pusat sumber belajar yang menyediakan berbagai koleksi buku dan fasilitas modern untuk mendukung kegiatan pembelajaran.</p>
          </div>

          <!-- Jam Operasional -->
          <div class="info-item" data-aos="fade-up">
            <div class="info-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <h3>Jam Operasional</h3>
            <p><strong>Senin - Jumat:</strong> 07:00 - 16:00 WIB<br>
            <strong>Sabtu:</strong> 07:00 - 12:00 WIB<br>
            <strong>Minggu & Libur:</strong> Tutup</p>
          </div>

          <!-- Kontak -->
          <div class="info-item" data-aos="fade-left">
            <div class="info-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
            </div>
            <h3>Hubungi Kami</h3>
            <p><strong>Email:</strong> perpustakaan@ganeshastembayo.sch.id<br>
            <strong>Telepon:</strong> (0274) 123-4567<br>
            <strong>Lokasi:</strong> Jl. Pendidikan No. 123, Yogyakarta</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'InformasiView',
  data() {
    return {
      isVisible: false
    }
  },
  mounted() {
    // Initialize AOS (Animate On Scroll) if available
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 800,
        once: true
      });
    }

    // Add scroll event listener for card animation
    window.addEventListener('scroll', this.handleScroll);
    // JANGAN check on mount - biarkan tersembunyi sampai user scroll
  },
  beforeUnmount() {
    // Clean up event listener
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleScroll() {
      const cardsWrapper = document.querySelector('.cards-wrapper');
      if (cardsWrapper) {
        const rect = cardsWrapper.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Trigger animation hanya ketika user scroll dan cards mulai masuk viewport
        // Card harus scroll lebih ke bawah dulu baru muncul (50% visible)
        if (rect.top < windowHeight * 0.7 && rect.bottom > windowHeight * 0.3) {
          this.isVisible = true;
        }
      }
    }
  }
}
</script>

<style scoped>
.informasi-page {
  min-height: 100vh;
  background: #f9fafb;
}

/* Hero Section */
.hero-section {
  position: relative;
  min-height: 100vh;
  background-image: url('/emyu.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 200px 20px 250px;
  overflow: hidden;
  border: none !important;
}

.hero-section hr,
.hero-section .divider,
.hero-section::before,
.hero-section::after {
  display: none !important;
  content: none !important;
  border: none !important;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(30, 60, 114, 0.6) 50%, rgba(0, 0, 0, 0.7) 100%);
  border: none !important;
}

.hero-content {
  position: relative;
  z-index: 2;
  color: white;
  width: 100%;
  max-width: 1200px;
  border: none !important;
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  color: white;
  margin-bottom: 80px;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  position: relative;
  border: none !important;
  border-top: none !important;
  border-bottom: none !important;
}

.hero-title::before,
.hero-title::after {
  display: none !important;
  content: none !important;
  border: none !important;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Content Section */
.content-wrapper {
  border: none !important;
  border-top: none !important;
  border-bottom: none !important;
}

.content-wrapper::before,
.content-wrapper::after {
  display: none !important;
  content: none !important;
}

.content-section {
  padding: 60px 20px;
  position: relative;
  margin-top: -320px;
  border: none !important;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  border: none !important;
}

.cards-wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 32px;
  border: none !important;
}

/* Card Animation Styles */
.info-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  transition: all 0.4s ease;
  position: relative;
  border: none !important;
  
  /* Initial hidden state */
  opacity: 0;
  transform: translateX(0);
}

/* Visi Card - Slide from Left */
.info-card.visi-card {
  transform: translateX(-100px);
}

.info-card.visi-card.slide-in-left {
  animation: slideInFromLeft 0.8s ease-out forwards;
}

/* Misi Card - Slide from Right */
.info-card.misi-card {
  transform: translateX(100px);
}

.info-card.misi-card.slide-in-right {
  animation: slideInFromRight 0.8s ease-out forwards;
  animation-delay: 0.2s; /* Slight delay for stagger effect */
}

/* Keyframe Animations */
@keyframes slideInFromLeft {
  0% {
    opacity: 0;
    transform: translateX(-100px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInFromRight {
  0% {
    opacity: 0;
    transform: translateX(100px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

.info-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.card-icon {
  width: 64px;
  height: 64px;
  background: #667eea;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
}

.card-icon svg {
  color: white;
  width: 32px;
  height: 32px;
}

.card-title {
  text-align: left;
  font-size: 1.6rem;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 16px;
  border: none !important;
}

.card-description {
  font-size: 1rem;
  line-height: 1.7;
  color: #4b5563;
}

.misi-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.misi-list li {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 14px;
  font-size: 0.95rem;
  line-height: 1.6;
  color: #4b5563;
}

.misi-list li:last-child {
  margin-bottom: 0;
}

.bullet {
  min-width: 10px;
  width: 10px;
  height: 10px;
  background: #667eea;
  border-radius: 50%;
  margin-top: 5px;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
}

/* Additional Info Section */
.additional-info {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 80px 20px;
  color: white;
  border: none !important;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
}

.info-item {
  text-align: center;
  padding: 32px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.info-item:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-5px);
}

.info-icon {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
}

.info-icon svg {
  color: white;
}

.info-item h3 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 16px;
}

.info-item p {
  font-size: 1rem;
  line-height: 1.7;
  opacity: 0.95;
}

/* Responsive Design */
@media (max-width: 968px) {
  .hero-title {
    font-size: 3rem;
  }

  .hero-section {
    height: 80vh;
    min-height: 500px;
    padding-top: 80px;
  }

  .content-section {
    margin-top: -200px;
    padding: 60px 20px;
  }

  .cards-wrapper {
    grid-template-columns: 1fr;
  }

  .info-card {
    padding: 36px 28px;
  }

  .card-title {
    font-size: 1.75rem;
  }
}

@media (max-width: 640px) {
  .hero-section {
    height: 70vh;
    min-height: 400px;
    background-attachment: scroll;
    padding-top: 60px;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .content-section {
    padding: 40px 16px;
    margin-top: -150px;
  }

  .info-card {
    padding: 28px 20px;
  }

  /* Adjust animation distance for mobile */
  .info-card.visi-card {
    transform: translateX(-50px);
  }

  .info-card.misi-card {
    transform: translateX(50px);
  }

  @keyframes slideInFromLeft {
    0% {
      opacity: 0;
      transform: translateX(-50px);
    }
    100% {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slideInFromRight {
    0% {
      opacity: 0;
      transform: translateX(50px);
    }
    100% {
      opacity: 1;
      transform: translateX(0);
    }
  }

  .card-icon {
    width: 64px;
    height: 64px;
  }

  .card-icon svg {
    width: 32px;
    height: 32px;
  }

  .card-title {
    font-size: 1.5rem;
  }

  .card-description,
  .misi-list li {
    font-size: 1rem;
  }

  .additional-info {
    padding: 60px 16px;
  }

  .info-grid {
    gap: 24px;
  }

  .info-item {
    padding: 24px 16px;
  }

  .info-icon {
    width: 64px;
    height: 64px;
  }

  .info-icon svg {
    width: 32px;
    height: 32px;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }

  .cards-wrapper {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}
</style>