<script>
export default {
  name: 'HeroSlider',
  emits: ['scroll-next', 'go-search'],
  data() {
    return {
      currentDescription: 0,
      autoSlideInterval: null,
      descriptions: [
        'Lebih dari 2000 Buku Siap Menemani Perjalanan Belajarmu',
        'Setiap Buku, Satu Langkah Menuju Pengetahuan Baru',
        'Ruang Tenang untuk Membaca, Belajar, dan Bertukar Ide',
        'Tempat Bertumbuhnya Generasi Cerdas dan Berkarakter',
        'Dari Rak Buku hingga Ruang Belajar',
        'Semua untuk Masa Depanmu'
      ],
      images: [
        '/ganesha-profile/ganesha1.jpg',
        '/ganesha-profile/ganesha2.jpg',
        '/ganesha-profile/ganesha3.jpg',
        '/ganesha-profile/ganesha4.jpg',
        '/ganesha-profile/ganesha5.jpg',
        '/ganesha-profile/ganesha6.jpg'
      ],
      socialMedia: [
        { 
          name: 'Instagram', 
          icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z', 
          url: 'https://instagram.com/ganeshastembayo' 
        },
        { 
          name: 'YouTube', 
          icon: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z', 
          url: 'https://youtube.com/@ganeshastembayo' 
        },
        { 
          name: 'TikTok', 
          icon: 'M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z', 
          url: 'https://tiktok.com/@ganeshastembayo' 
        },
        { 
          name: 'Website', 
          icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z', 
          url: 'https://ganeshastembayo.com' 
        }
      ],
      sponsorLogo: '/sponsor/logo-JHIC.png'
    };
  },
  mounted() {
    this.startAutoSlide();
  },
  beforeUnmount() {
    this.stopAutoSlide();
  },
  methods: {
    startAutoSlide() {
      this.autoSlideInterval = setInterval(() => {
        this.nextDescription();
      }, 4000);
    },
    stopAutoSlide() {
      if (this.autoSlideInterval) {
        clearInterval(this.autoSlideInterval);
      }
    },
    nextDescription() {
      this.currentDescription = (this.currentDescription + 1) % this.descriptions.length;
    },
    handlePrimaryClick() {
      this.$emit('scroll-next');
    },
    handleSecondaryClick() {
      this.$emit('go-search');
    }
  }
};
</script>

<template>
  <div class="relative w-full h-[85vh] sm:h-[90vh] lg:h-[95vh] overflow-hidden bg-gray-900">
    <!-- Background Image with Slide Transition -->
    <div class="absolute inset-0">
      <div class="relative w-full h-full">
        <transition-group name="slide-image" tag="div">
          <img 
            v-for="(img, index) in images"
            :key="index"
            v-show="index === currentDescription"
            :src="img"
            :alt="descriptions[index]"
            class="absolute w-full h-full object-cover"
          />
        </transition-group>
      </div>
      <!-- Overlay Gradients -->
      <div class="absolute inset-0 bg-gradient-to-r from-black/65 via-black/45 to-black/25 z-[3]"></div>
      <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-[3]"></div>
    </div>

    <!-- Sponsor Logo - Top Right -->
    <div class="absolute top-4 right-4 sm:top-6 sm:right-6 lg:top-8 lg:right-8 z-[5]">
      <div class="bg-white/95 backdrop-blur-sm rounded-lg p-2 sm:p-3 shadow-xl">
        <img 
          :src="sponsorLogo" 
          alt="Sponsor" 
          class="h-8 sm:h-10 lg:h-12 w-auto object-contain"
        />
      </div>
    </div>

    <!-- Social Media - Bottom Left -->
    <div class="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 lg:bottom-8 lg:left-8 z-[5]">
      <div class="flex flex-row gap-2 sm:gap-3">
        <a 
          v-for="social in socialMedia" 
          :key="social.name"
          :href="social.url"
          target="_blank"
          rel="noopener noreferrer"
          class="bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-full p-2 sm:p-2.5 transition-all duration-300 hover:scale-110 group shadow-lg"
          :title="social.name"
        >
          <svg 
            class="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 fill-white group-hover:scale-110 transition-transform" 
            viewBox="0 0 24 24"
          >
            <path :d="social.icon"/>
          </svg>
        </a>
      </div>
    </div>

    <!-- Content -->
    <div class="relative h-full flex items-center z-[4]">
      <div class="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div class="max-w-3xl">
          <!-- Title -->
          <div class="mb-3 sm:mb-4">
            <h2 class="text-white text-xs sm:text-sm lg:text-base xl:text-lg font-normal tracking-[0.2em] font-serif">
              SELAMAT DATANG DI
            </h2>
          </div>

          <!-- Subtitle -->
          <div class="mb-6 sm:mb-8">
            <h1 class="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight leading-tight font-serif drop-shadow-lg">
              GANESHA STEMBAYO
            </h1>
          </div>

          <!-- Description Container -->
          <div class="relative h-24 sm:h-28 lg:h-32 mb-8 sm:mb-10 overflow-hidden">
            <transition-group name="slide-up" tag="div">
              <p
                v-for="(desc, index) in descriptions"
                :key="index"
                v-show="index === currentDescription"
                class="absolute text-gray-200 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-light leading-relaxed max-w-2xl font-serif"
              >
                {{ desc }}
              </p>
            </transition-group>
          </div>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button 
              class="px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-xs sm:text-sm tracking-wider transition-all duration-300 hover:shadow-xl hover:shadow-blue-600/50 hover:scale-105"
              @click="handlePrimaryClick"
            >
              Temukan Hal Menarik
            </button>
            <button 
              class="px-6 sm:px-8 py-3 sm:py-4 bg-transparent border-4 border-white text-white hover:bg-white hover:text-black rounded-lg font-semibold text-xs sm:text-sm tracking-wider transition-all duration-300 hover:scale-105 shadow-[0_0_10px_rgba(255,255,255,0.6)]"
              @click="handleSecondaryClick"
            >
              Jelajahi Buku
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Libre+Baskerville:wght@400;700&display=swap');

/* Slide from Right Animation */
.slide-image-enter-active {
  transition: all 0.8s ease-out;
  z-index: 2;
}

.slide-image-leave-active {
  transition: all 0.8s ease-in;
  z-index: 1;
}

.slide-image-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-image-leave-to {
  transform: translateX(-30%);
  opacity: 0;
}

.slide-image-enter-to,
.slide-image-leave-from {
  transform: translateX(0);
  opacity: 1;
}

/* Slide Up Animation */
.slide-up-enter-active {
  transition: all 0.6s ease-out;
}

.slide-up-leave-active {
  transition: all 0.6s ease-in;
}

.slide-up-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

.slide-up-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

.slide-up-enter-to,
.slide-up-leave-from {
  transform: translateY(0);
  opacity: 1;
}

/* Dyslexia Mode Support - Override font when body has dyslexia class */
:global(body.dyslexia-mode) h1,
:global(body.dyslexia-mode) h2,
:global(body.dyslexia-mode) p,
:global(body.dyslexia-mode) button {
  font-family: 'OpenDyslexic', sans-serif !important;
}

/* Responsive font sizes for dyslexia mode */
@media (max-width: 640px) {
  :global(body.dyslexia-mode) h1 {
    font-size: 1.875rem !important;
    line-height: 2.25rem !important;
  }
  
  :global(body.dyslexia-mode) h2 {
    font-size: 0.75rem !important;
    line-height: 1rem !important;
  }
  
  :global(body.dyslexia-mode) p {
    font-size: 0.875rem !important;
    line-height: 1.5rem !important;
  }
}
</style>