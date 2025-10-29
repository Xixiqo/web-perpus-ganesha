<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section with Background Image -->
    <section class="relative min-h-screen flex items-center justify-center px-5 py-48 overflow-hidden">
      <!-- Background Image -->
      <div class="absolute inset-0 bg-cover bg-center bg-fixed" style="background-image: url('/ganesha-profile/ganesha9.jpg');"></div>
      
      <!-- Overlay -->
      <div class="absolute inset-0 bg-gradient-to-br from-black/75 via-blue-900/65 to-slate-900/70"></div>
      
      <!-- Content -->
      <div class="relative z-10 w-full max-w-6xl text-white">
        <h1 class="text-5xl md:text-6xl font-extrabold text-center mb-20 drop-shadow-2xl tracking-tight" data-aos="fade-down" data-aos-duration="1000">
          Visi & Misi
        </h1>

        <!-- Visi & Misi Cards -->
        <div class="visi-misi-cards grid grid-cols-1 lg:grid-cols-2 gap-16">
          <!-- Card Visi -->
          <div 
            class="bg-white rounded-3xl p-10 shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:shadow-3xl"
            :class="{ 'animate-slide-in-left': isVisible }"
            data-aos="fade-right" 
            data-aos-duration="800"
          >
            <div class="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg" style="background-color: #2C64E3; box-shadow: 0 10px 25px rgba(44, 100, 227, 0.3);">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"
                stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </div>
            <h2 class="text-3xl font-bold mb-5" style="color: #2C64E3;">Visi</h2>
            <p class="text-gray-800 leading-relaxed text-base font-medium">
              Terwujudnya Insan Pembelajar yang Cerdas, Berkarakter, Berwawasan Luas, dan Berbudi Pekerti Luhur dengan
              Memberdayakan Perpustakaan.
            </p>
          </div>

          <!-- Card Misi -->
          <div 
            class="bg-white rounded-3xl p-10 shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:shadow-3xl"
            :class="{ 'animate-slide-in-right': isVisible }"
            data-aos="fade-left" 
            data-aos-duration="800" 
            data-aos-delay="200"
          >
            <div class="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg" style="background-color: #2C64E3; box-shadow: 0 10px 25px rgba(44, 100, 227, 0.3);">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"
                stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="12" r="6"></circle>
                <circle cx="12" cy="12" r="2"></circle>
              </svg>
            </div>
            <h2 class="text-3xl font-bold mb-5" style="color: #2C64E3;">Misi</h2>
            <ul class="space-y-3.5">
              <li class="flex items-start gap-3 text-gray-800 text-base font-medium">
                <span class="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 shadow-md" style="background-color: #2C64E3; box-shadow: 0 4px 10px rgba(44, 100, 227, 0.4);"></span>
                <span>Mewujudkan Perpustakaan yang nyaman dan menyenangkan</span>
              </li>
              <li class="flex items-start gap-3 text-gray-800 text-base font-medium">
                <span class="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 shadow-md" style="background-color: #2C64E3; box-shadow: 0 4px 10px rgba(44, 100, 227, 0.4);"></span>
                <span>Menyediakan Bahan Koleksi Perpustakaan yang Representatif</span>
              </li>
              <li class="flex items-start gap-3 text-gray-800 text-base font-medium">
                <span class="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 shadow-md" style="background-color: #2C64E3; box-shadow: 0 4px 10px rgba(44, 100, 227, 0.4);"></span>
                <span>Mengembangkan Pelayanan Perpustakaan Berbasis IT</span>
              </li>
              <li class="flex items-start gap-3 text-gray-800 text-base font-medium">
                <span class="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 shadow-md" style="background-color: #2C64E3; box-shadow: 0 4px 10px rgba(44, 100, 227, 0.4);"></span>
                <span>Mewujudkan Pemustaka yang Berprestasi</span>
              </li>
              <li class="flex items-start gap-3 text-gray-800 text-base font-medium">
                <span class="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 shadow-md" style="background-color: #2C64E3; box-shadow: 0 4px 10px rgba(44, 100, 227, 0.4);"></span>
                <span>Mengembangkan Koleksi Perpustakaan Sesuai Kebutuhan</span>
              </li>
              <li class="flex items-start gap-3 text-gray-800 text-base font-medium">
                <span class="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 shadow-md" style="background-color: #2C64E3; box-shadow: 0 4px 10px rgba(44, 100, 227, 0.4);"></span>
                <span>Menyediakan Pelayanan Perpustakaan dengan mengedepankan 5S</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Jam Layanan -->
    <section class="relative py-20 px-5 overflow-hidden" style="background: linear-gradient(to bottom right, #2C64E3, #1e4bb8, #2C64E3);">
      <!-- Decorative Elements -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>
      
      <div class="relative max-w-6xl mx-auto">
        <h2 class="text-4xl md:text-5xl font-extrabold text-center text-white mb-4" data-aos="fade-up">
          Jam Layanan Perpustakaan
        </h2>
        <p class="text-center text-blue-100 text-lg mb-16" data-aos="fade-up" data-aos-delay="100">
          Kami siap melayani Anda sesuai jadwal di bawah ini
        </p>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Senin - Kamis -->
          <div 
            class="bg-white rounded-2xl p-8 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            data-aos="zoom-in" 
            data-aos-delay="200"
          >
            <div class="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-5" style="background-color: rgba(44, 100, 227, 0.1);">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2C64E3" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-800 text-center mb-6">Senin - Kamis</h3>
            <div class="space-y-3">
              <div class="flex justify-between items-center py-2 border-b border-gray-200">
                <span class="text-gray-600 font-medium">Buka</span>
                <span class="font-bold text-lg" style="color: #2C64E3;">07:30</span>
              </div>
              <div class="flex justify-between items-center py-2 border-b border-gray-200">
                <span class="text-gray-600 font-medium">Istirahat</span>
                <span class="font-bold text-lg" style="color: #2C64E3;">12:00 - 13:00</span>
              </div>
              <div class="flex justify-between items-center py-2">
                <span class="text-gray-600 font-medium">Tutup</span>
                <span class="font-bold text-lg" style="color: #2C64E3;">15:00</span>
              </div>
            </div>
          </div>

          <!-- Jumat -->
          <div 
            class="bg-white rounded-2xl p-8 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            data-aos="zoom-in" 
            data-aos-delay="300"
          >
            <div class="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-5" style="background-color: rgba(44, 100, 227, 0.1);">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2C64E3" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-800 text-center mb-6">Jumat</h3>
            <div class="space-y-3">
              <div class="flex justify-between items-center py-2 border-b border-gray-200">
                <span class="text-gray-600 font-medium">Buka</span>
                <span class="font-bold text-lg" style="color: #2C64E3;">07:30</span>
              </div>
              <div class="flex justify-between items-center py-2 border-b border-gray-200">
                <span class="text-gray-600 font-medium">Istirahat</span>
                <span class="font-bold text-lg" style="color: #2C64E3;">11:30 - 12:45</span>
              </div>
              <div class="flex justify-between items-center py-2">
                <span class="text-gray-600 font-medium">Tutup</span>
                <span class="font-bold text-lg" style="color: #2C64E3;">13:30</span>
              </div>
            </div>
          </div>

          <!-- Sabtu - Minggu -->
          <div 
            class="bg-gray-100 rounded-2xl p-8 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border-2 border-gray-300"
            data-aos="zoom-in" 
            data-aos-delay="400"
          >
            <div class="w-14 h-14 bg-gray-300 rounded-xl flex items-center justify-center mx-auto mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6b7280" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-800 text-center mb-6">Sabtu - Minggu</h3>
            <div class="text-center py-4">
              <p class="text-3xl font-bold text-red-600 mb-2">TUTUP</p>
              <p class="text-gray-600 text-base">Libur Akhir Pekan</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Information -->
    <section class="py-20 px-5 md:px-16 bg-gray-50">
      <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8">
        <!-- Contact Left (2 columns) -->
        <div class="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <!-- Telepon -->
          <a 
            href="https://wa.me/6285743718200" 
            target="_blank" 
            rel="noopener noreferrer" 
            class="rounded-xl p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            style="background-color: rgba(44, 100, 227, 0.1);"
            data-aos="zoom-in" 
            data-aos-delay="100"
          >
            <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md transition-all duration-300 hover:shadow-xl group" style="transition: all 0.3s ease;">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" class="transition-colors" style="color: #2C64E3;">
                <path fill="currentColor" d="M6.62 10.79c1.44 2.83 3.76 5.15 6.59 6.59l2.2-2.2c.28-.28.67-.36 1.02-.25c1.12.37 2.32.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57c.11.35.03.74-.25 1.02z"></path>
              </svg>
            </div>
            <h3 class="font-semibold text-gray-900 text-lg mb-2">Telepon</h3>
            <p class="text-gray-600 text-sm">+(62)812-3456-7890</p>
          </a>

          <!-- Instagram -->
          <a 
            href="https://www.instagram.com/ganeshastembayo/" 
            target="_blank" 
            rel="noopener noreferrer" 
            class="rounded-xl p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            style="background-color: rgba(44, 100, 227, 0.1);"
            data-aos="zoom-in" 
            data-aos-delay="200"
          >
            <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md transition-all duration-300 hover:shadow-xl group">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" class="transition-colors" style="color: #2C64E3;">
                <path fill="currentColor" d="M16 3a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5zm-4 5a4 4 0 1 0 0 8a4 4 0 0 0 0-8m0 2a2 2 0 1 1 0 4a2 2 0 0 1 0-4m4.5-3.5a1 1 0 1 0 0 2a1 1 0 0 0 0-2"></path>
              </svg>
            </div>
            <h3 class="font-semibold text-gray-900 text-lg mb-2">Instagram</h3>
            <p class="text-gray-600 text-sm">@ganeshastembayo</p>
          </a>

          <!-- TikTok -->
          <a 
            href="https://www.tiktok.com/@ganeshastembayo" 
            target="_blank" 
            rel="noopener noreferrer" 
            class="rounded-xl p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            style="background-color: rgba(44, 100, 227, 0.1);"
            data-aos="zoom-in" 
            data-aos-delay="300"
          >
            <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md transition-all duration-300 hover:shadow-xl group">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" class="transition-colors" style="color: #2C64E3;">
                <path fill="currentColor" d="M16.6 5.82s.51.5 0 0A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6c0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64c0 3.33 2.76 5.7 5.69 5.7c3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48"></path>
              </svg>
            </div>
            <h3 class="font-semibold text-gray-900 text-lg mb-2">Tiktok</h3>
            <p class="text-gray-600 text-sm">@ganeshastembayo</p>
          </a>

          <!-- Email -->
          <a 
            href="mailto:ganeshastembayo@gmail.com" 
            class="rounded-xl p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            style="background-color: rgba(44, 100, 227, 0.1);"
            data-aos="zoom-in" 
            data-aos-delay="400"
          >
            <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md transition-all duration-300 hover:shadow-xl group">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" class="transition-colors" style="color: #2C64E3;">
                <path fill="currentColor" d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2m0 4l-8 5l-8-5V6l8 5l8-5z"></path>
              </svg>
            </div>
            <h3 class="font-semibold text-gray-900 text-lg mb-2">Email</h3>
            <p class="text-gray-600 text-sm break-all">ganeshastembayo@gmail.com</p>
          </a>

          <!-- MAP -->
          <div class="col-span-1 sm:col-span-2 rounded-xl overflow-hidden shadow-lg" data-aos="fade-up" data-aos-delay="500">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d570.7512129506578!2d110.39261118219468!3d-7.770946100676336!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a59b8343f8a9d%3A0x56427a46a6adb1c0!2sSTM%20Pembangunan%20YOGYAKARTA!5e1!3m2!1sid!2sid!4v1760342915041!5m2!1sid!2sid"
              width="100%"
              height="300"
              style="border:0;"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              class="w-full"
            ></iframe>
          </div>
        </div>

        <!-- Contact Right Form (3 columns) -->
        <div class="lg:col-span-3 bg-white rounded-2xl p-8 md:p-10 shadow-xl" data-aos="fade-left" data-aos-duration="1000">
          <h2 class="text-3xl font-bold mb-3" style="color: #2C64E3;">Hubungi Kami</h2>
          <p class="text-gray-600 mb-8 leading-relaxed">
            Punya pertanyaan, saran, atau ingin mengetahui lebih banyak tentang layanan perpustakaan kami?
            Silakan isi formulir di bawah ini, dan tim perpustakaan akan segera menghubungi Anda!
          </p>

          <form @submit.prevent="handleSubmit" class="space-y-5">
            <div>
              <label class="block font-semibold text-gray-700 mb-2 text-sm">Nama Lengkap</label>
              <input 
                type="text" 
                placeholder="Masukkan nama lengkap Anda" 
                v-model="form.name" 
                required 
                :disabled="isSubmitting"
                class="form-input w-full px-4 py-3 border-2 border-gray-300 rounded-xl outline-none transition-all disabled:bg-gray-100 disabled:text-gray-500"
              />
            </div>

            <div>
              <label class="block font-semibold text-gray-700 mb-2 text-sm">Email</label>
              <input 
                type="email" 
                placeholder="Masukkan alamat email aktif" 
                v-model="form.email" 
                required 
                :disabled="isSubmitting"
                class="form-input w-full px-4 py-3 border-2 border-gray-300 rounded-xl outline-none transition-all disabled:bg-gray-100 disabled:text-gray-500"
              />
            </div>

            <div>
              <label class="block font-semibold text-gray-700 mb-2 text-sm">Subjek</label>
              <input 
                type="text" 
                placeholder="Masukkan judul subjek" 
                v-model="form.subject" 
                required 
                :disabled="isSubmitting"
                class="form-input w-full px-4 py-3 border-2 border-gray-300 rounded-xl outline-none transition-all disabled:bg-gray-100 disabled:text-gray-500"
              />
            </div>

            <div>
              <label class="block font-semibold text-gray-700 mb-2 text-sm">Pesan</label>
              <textarea 
                rows="6" 
                placeholder="Tulis pesan Anda disini.." 
                v-model="form.message" 
                required
                :disabled="isSubmitting"
                class="form-input w-full px-4 py-3 border-2 border-gray-300 rounded-xl outline-none transition-all resize-y disabled:bg-gray-100 disabled:text-gray-500"
              ></textarea>
            </div>

            <button 
              type="submit" 
              :disabled="isSubmitting"
              class="w-full text-white py-3.5 rounded-xl font-semibold text-base transition-all duration-300 hover:-translate-y-1 hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              style="background-color: #2C64E3; box-shadow: 0 10px 25px rgba(44, 100, 227, 0.4);"
            >
              {{ isSubmitting ? 'Mengirim...' : 'Kirim Pesan' }}
            </button>
          </form>

          <!-- Alert Messages -->
          <div v-if="successMessage" class="mt-5 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg animate-slide-up">
            <p class="text-green-700 font-semibold text-sm">✓ {{ successMessage }}</p>
          </div>
          <div v-if="errorMessage" class="mt-5 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg animate-slide-up">
            <p class="text-red-700 font-semibold text-sm">✗ {{ errorMessage }}</p>
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
        once: true,
        offset: 100,
        easing: 'ease-out-cubic'
      });
    }
    window.addEventListener('scroll', this.handleScroll);
    this.handleScroll();
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleScroll() {
      const cardsWrapper = document.querySelector('.visi-misi-cards');
      if (cardsWrapper) {
        const rect = cardsWrapper.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        if (rect.top < windowHeight * 0.5 && rect.bottom > windowHeight * 0.1) {
          this.isVisible = true;
        }
      }
    },
    handleSubmit() {
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
        const emailBody = `Nama: ${this.form.name}
Email: ${this.form.email}

Pesan:
${this.form.message}

---
Dikirim dari Form Hubungi Kami - Perpustakaan Ganesha STembayo`;

        const subject = encodeURIComponent(this.form.subject);
        const body = encodeURIComponent(emailBody);
        const recipient = 'veltrixtowin@gmail.com';

        const mailtoLink = `mailto:${recipient}?subject=${subject}&body=${body}`;

        window.location.href = mailtoLink;

        this.successMessage = 'Email client Anda akan terbuka. Silakan kirim email dari aplikasi email Anda.';
        
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
/* Animation untuk slide in dari kiri */
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Animation untuk slide in dari kanan */
@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Animation untuk slide up */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Kelas animasi */
.animate-slide-in-left {
  animation: slideInLeft 0.8s ease-out forwards;
}

.animate-slide-in-right {
  animation: slideInRight 0.8s ease-out forwards;
}

.animate-slide-up {
  animation: slideUp 0.4s ease-out forwards;
}

/* Hover effect untuk icon contact */
a:hover .group svg {
  transform: scale(1.1);
}

a:hover .group {
  background-color: #2C64E3 !important;
}

a:hover .group svg {
  color: white !important;
}

/* Custom scrollbar untuk textarea */
textarea::-webkit-scrollbar {
  width: 8px;
}

textarea::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

textarea::-webkit-scrollbar-thumb {
  background: #2C64E3;
  border-radius: 10px;
}

textarea::-webkit-scrollbar-thumb:hover {
  background: #1e4bb8;
}

/* Shadow enhancement */
.shadow-3xl {
  box-shadow: 0 35px 60px -15px rgba(0, 0, 0, 0.3);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .animate-slide-in-left,
  .animate-slide-in-right {
    animation: slideUp 0.6s ease-out forwards;
  }
}

/* Loading state untuk button */
button:disabled {
  cursor: not-allowed;
  position: relative;
}

button:disabled::after {
  content: '';
  position: absolute;
  top: 50%;
  right: 20px;
  width: 16px;
  height: 16px;
  margin-top: -8px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Focus visible untuk accessibility */
a:focus-visible,
button:focus-visible,
input:focus-visible,
textarea:focus-visible {
  outline: 3px solid #2C64E3;
  outline-offset: 2px;
}

/* Form input focus styles */
.form-input:focus {
  border-color: #2C64E3 !important;
  ring: 4px;
  ring-color: rgba(44, 100, 227, 0.1);
  box-shadow: 0 0 0 4px rgba(44, 100, 227, 0.1);
}

/* Smooth transitions */
* {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}
</style>