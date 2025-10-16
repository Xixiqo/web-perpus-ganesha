<template>
  <div class="informasi-page">
    <!-- Hero Section with Background Image -->
    <section class="hero-section">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1 class="hero-title">Visi & Misi</h1>

        <!-- Visi & Misi Content -->
        <div class="container content-wrapper">
          <div class="cards-wrapper">
            <!-- Card Visi -->
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

            <!-- Card Misi -->
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
                <li><span class="bullet"></span>Menyediakan Bahan Koleksi Perpustakaan yang Representatif</li>
                <li><span class="bullet"></span>Mengembangkan Pelayanan Perpustakaan Berbasis IT</li>
                <li><span class="bullet"></span>Mewujudkan Pemustaka yang Berprestasi</li>
                <li><span class="bullet"></span>Mengembangkan Koleksi Perpustakaan Sesuai Kebutuhan</li>
                <li><span class="bullet"></span>Menyediakan Pelayanan Perpustakaan dengan mengedepankan 5S</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Jam Layanan -->
    <section class="additional-info">
      <h1 class="hero-tite">Jam Layanan</h1>
      <div class="container">
        <div class="info-grid">
          <div class="info-item">
            <h3>Senin - Kamis</h3>
            <p><strong>Buka :</strong> 07:30</p>
            <p><strong>Istirahat :</strong> 12.00-13.00</p>
            <p><strong>Tutup :</strong> 15.00</p>
          </div>

          <div class="info-item">
            <h3>Jumat</h3>
            <p><strong>Buka :</strong> 07:30</p>
            <p><strong>Istirahat :</strong> 11.30-12.45</p>
            <p><strong>Tutup :</strong> 13.30</p>
          </div>

          <div class="info-item">
            <h3>Sabtu - Minggu</h3>
            <p><strong>Tutup</strong></p>
            <p>Libur Akhir Pekan</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Information -->
    <section class="info-container">
      <!-- Kontak Kiri -->
      <div class="contact-left">
        <!-- Telepon / WhatsApp -->
        <a href="https://wa.me/6285743718200" target="_blank" rel="noopener noreferrer" class="contact-item">
          <div class="contact-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
              <path fill="currentColor" d="M6.62 10.79c1.44 2.83 3.76 5.15 6.59 6.59l2.2-2.2c.28-.28.67-.36 1.02-.25c1.12.37 2.32.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57c.11.35.03.74-.25 1.02z"></path>
            </svg>
          </div>
          <h3>Telepon</h3>
          <p>+(62)812-3456-7890</p>
        </a>

        <!-- Instagram -->
        <a href="https://www.instagram.com/ganeshastembayo/" target="_blank" rel="noopener noreferrer" class="contact-item">
          <div class="contact-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
              <g fill="none">
                <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path>
                <path fill="currentColor" d="M16 3a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5zm-4 5a4 4 0 1 0 0 8a4 4 0 0 0 0-8m0 2a2 2 0 1 1 0 4a2 2 0 0 1 0-4m4.5-3.5a1 1 0 1 0 0 2a1 1 0 0 0 0-2"></path>
              </g>
            </svg>
          </div>
          <h3>Instagram</h3>
          <p>@ganeshastembayo</p>
        </a>

        <!-- TikTok -->
        <a href="https://www.tiktok.com/@ganeshastembayo" target="_blank" rel="noopener noreferrer" class="contact-item">
          <div class="contact-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
              <path fill="currentColor" d="M16.6 5.82s.51.5 0 0A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6c0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64c0 3.33 2.76 5.7 5.69 5.7c3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48"></path>
            </svg>
          </div>
          <h3>Tiktok</h3>
          <p>@ganeshastembayo</p>
        </a>

        <!-- Email -->
        <a href="mailto:ganeshastembayo@gmail.com" class="contact-item">
          <div class="contact-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
              <path fill="currentColor" d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2m0 4l-8 5l-8-5V6l8 5l8-5z"></path>
            </svg>
          </div>
          <h3>Email</h3>
          <p>ganeshastembayo@gmail.com</p>
        </a>

        <!-- MAP - Mengambil 2 kolom penuh -->
        <div class="map-container">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d570.7512129506578!2d110.39261118219468!3d-7.770946100676336!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a59b8343f8a9d%3A0x56427a46a6adb1c0!2sSTM%20Pembangunan%20YOGYAKARTA!5e1!3m2!1sid!2sid!4v1760342915041!5m2!1sid!2sid"
            width="100%"
            height="350"
            style="border:0; border-radius: 12px;"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>

      <!-- Form Hubungi Kami -->
      <div class="contact-right">
        <h2>Hubungi Kami</h2>
        <p>
          Punya pertanyaan, saran, atau ingin mengetahui lebih banyak tentang layanan perpustakaan kami?
          Silakan isi formulir di bawah ini, dan tim perpustakaan akan segera menghubungi Anda!
        </p>

        <form class="contact-form" @submit.prevent="handleSubmit">
          <label>Nama Lengkap</label>
          <input 
            type="text" 
            placeholder="Masukkan nama lengkap Anda" 
            v-model="form.name" 
            required 
            :disabled="isSubmitting"
          />

          <label>Email</label>
          <input 
            type="email" 
            placeholder="Masukkan alamat email aktif" 
            v-model="form.email" 
            required 
            :disabled="isSubmitting"
          />

          <label>Subjek</label>
          <input 
            type="text" 
            placeholder="Masukkan judul subjek" 
            v-model="form.subject" 
            required 
            :disabled="isSubmitting"
          />

          <label>Pesan</label>
          <textarea 
            rows="8" 
            placeholder="Tulis pesan Anda disini.." 
            v-model="form.message" 
            required
            :disabled="isSubmitting"
          ></textarea>

          <button type="submit" :disabled="isSubmitting">
            {{ isSubmitting ? 'Mengirim...' : 'Kirim Pesan' }}
          </button>
        </form>

        <!-- Alert Messages -->
        <div v-if="successMessage" class="alert alert-success">
          ✓ {{ successMessage }}
        </div>
        <div v-if="errorMessage" class="alert alert-error">
          ✗ {{ errorMessage }}
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
      isVisible: false,
      isSubmitting: false,
      successMessage: '',
      errorMessage: '',
      form: {
        name: '',
        email: '',
        subject: '',
        message: ''
      }
    }
  },
  mounted() {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 800,
        once: true
      });
    }
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleScroll() {
      const cardsWrapper = document.querySelector('.cards-wrapper');
      if (cardsWrapper) {
        const rect = cardsWrapper.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        if (rect.top < windowHeight * 0.5 && rect.bottom > windowHeight * 0.1) {
          this.isVisible = true;
        }
      }
    },
    handleSubmit() {
      // Validasi form
      if (!this.form.name || !this.form.email || !this.form.subject || !this.form.message) {
        this.errorMessage = 'Semua field harus diisi!';
        setTimeout(() => {
          this.errorMessage = '';
        }, 3000);
        return;
      }

      this.isSubmitting = true;
      this.successMessage = '';
      this.errorMessage = '';

      try {
        // Format email body
        const emailBody = `Nama: ${this.form.name}
Email: ${this.form.email}

Pesan:
${this.form.message}

---
Dikirim dari Form Hubungi Kami - Perpustakaan Ganesha STembayo`;

        // Encode untuk URL
        const subject = encodeURIComponent(this.form.subject);
        const body = encodeURIComponent(emailBody);
        const recipient = 'veltrixtowin@gmail.com';

        // Buat mailto link
        const mailtoLink = `mailto:${recipient}?subject=${subject}&body=${body}`;

        // Buka email client
        window.location.href = mailtoLink;

        this.successMessage = 'Email client Anda akan terbuka. Silakan kirim email dari aplikasi email Anda.';
        
        // Reset form setelah 2 detik
        setTimeout(() => {
          this.form = {
            name: '',
            email: '',
            subject: '',
            message: ''
          };
          this.successMessage = '';
        }, 3000);

      } catch (error) {
        console.error('Error:', error);
        this.errorMessage = 'Terjadi kesalahan. Pastikan Anda memiliki aplikasi email yang terpasang.';
        
        setTimeout(() => {
          this.errorMessage = '';
        }, 5000);
      } finally {
        this.isSubmitting = false;
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

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(30, 60, 114, 0.6) 50%, rgba(0, 0, 0, 0.7) 100%);
}

.hero-content {
  position: relative;
  z-index: 2;
  color: white;
  width: 100%;
  max-width: 1200px;
}

.hero-title {
  font-size: 3rem;
  font-weight: 800;
  text-align: center;
  color: white;
  margin-bottom: 80px;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
}

.hero-tite {
  font-size: 3rem;
  font-weight: 800;
  text-align: center;
  color: var(--primary);
  margin-bottom: 80px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.cards-wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 64px;
}

/* Card Animation */
.info-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  transition: all 0.4s ease;
  opacity: 0;
  transform: translateX(0);
}

.info-card.visi-card {
  transform: translateX(-100px);
}

.info-card.visi-card.slide-in-left {
  animation: slideInFromLeft 0.8s ease-out forwards;
}

.info-card.misi-card {
  transform: translateX(100px);
}

.info-card.misi-card.slide-in-right {
  animation: slideInFromRight 0.8s ease-out forwards;
  animation-delay: 0.2s;
}

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
  background: var(--primary);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
}

.card-icon svg {
  color: white;
}

.card-title {
  text-align: left;
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 16px;
}

.card-description {
  font-size: 1rem;
  line-height: 1.7;
  color: #4b5563;
  text-align: left;
}

.misi-list {
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: left;
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

.bullet {
  min-width: 10px;
  width: 10px;
  height: 10px;
  background: var(--primary);
  border-radius: 50%;
  margin-top: 5px;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
  flex-shrink: 0;
}

/* Jam Layanan */
.additional-info {
  background: #CDD8F1;
  padding: 50px 20px;
  padding-bottom: 90px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
}

.info-item {
  text-align: center;
  padding: 32px;
  background: white;
  border-radius: 20px;
  transition: all 0.3s ease;
}

.info-item:hover {
  transform: translateY(-5px);
}

/* Contact Section - FIXED LAYOUT */
.info-container {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 32px;
  padding: 80px 8%;
  background: #f9fafb;
  align-items: start;
}

.contact-left {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.contact-item {
  background: #CDD8F1;
  padding: 24px;
  border-radius: 12px;
  text-align: center;
  transition: all 0.3s ease;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}

.contact-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  background: #b8c5e0;
}

.contact-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 50%;
  color: var(--primary);
  transition: all 0.3s ease;
}

.contact-item:hover .contact-icon {
  background: var(--primary);
  color: white;
  box-shadow: 0 4px 12px rgba(44, 100, 227, 0.3);
}

.contact-item h3 {
  color: #000000;
  font-weight: 600;
  font-size: 20px;
  margin-bottom: 8px;
}

.contact-item p {
  font-size: 15px;
  color: #555;
  margin: 0;
}

/* MAP - Mengambil 2 kolom penuh */
.map-container {
  grid-column: 1 / -1;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}

/* Contact Right - FULL HEIGHT */
.contact-right {
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.contact-right h2 {
  font-size: 28px;
  color: var(--primary);
  margin-bottom: 12px;
  font-weight: 700;
}

.contact-right p {
  font-size: 15px;
  color: #555;
  margin-bottom: 30px;
  line-height: 1.6;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
}

.contact-form label {
  font-weight: 600;
  color: #333;
  font-size: 14px;
  margin-bottom: -8px;
}

.contact-form input,
.contact-form textarea {
  padding: 12px 16px;
  border-radius: 10px;
  border: 2px solid #e5e7eb;
  outline: none;
  transition: 0.3s;
  font-family: inherit;
  font-size: 14px;
}

.contact-form input:focus,
.contact-form textarea:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.contact-form input:disabled,
.contact-form textarea:disabled {
  background: #f3f4f6;
  color: #9ca3af;
}

.contact-form textarea {
  resize: vertical;
  min-height: 120px;
  flex: 1;
}

.contact-form button {
  background: var(--primary);
  color: white;
  border: none;
  padding: 14px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 600;
  font-size: 15px;
  margin-top: 20px;
}

.contact-form button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.contact-form button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Alert Messages */
.alert {
  padding: 14px 16px;
  border-radius: 10px;
  margin-top: 16px;
  font-size: 14px;
  font-weight: 600;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.alert-success {
  background: #d1fae5;
  color: #047857;
  border-left: 4px solid #10b981;
}

.alert-error {
  background: #fee2e2;
  color: #dc2626;
  border-left: 4px solid #ef4444;
}

/* Responsive */
@media (max-width: 968px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .cards-wrapper {
    grid-template-columns: 1fr;
  }

  .info-container {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .hero-section {
    padding: 150px 20px 200px;
  }

  .hero-title {
    font-size: 2rem;
    margin-bottom: 60px;
  }

  .info-container {
    padding: 40px 5%;
  }

  .contact-left {
    grid-template-columns: 1fr;
  }

  .contact-right {
    padding: 24px;
  }
}
</style>