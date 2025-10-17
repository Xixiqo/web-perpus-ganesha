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
        'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1920&h=1080&fit=crop',
        'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1920&h=1080&fit=crop',
        'https://images.unsplash.com/photo-1507842217343-583f20270057?w=1920&h=1080&fit=crop',
        'https://images.unsplash.com/photo-1507842217343-583f20270057?w=1920&h=1080&fit=crop',
        'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=1920&h=1080&fit=crop'
      ]
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
  <div class="hero-slider">
    <!-- Background Image with Slide Transition -->
    <div class="slide-background">
      <div class="image-container">
        <transition-group name="slide-image" tag="div">
          <img 
            v-for="(img, index) in images"
            :key="index"
            v-show="index === currentDescription"
            :src="img"
            :alt="descriptions[index]"
            class="slide-image"
          />
        </transition-group>
      </div>
      <div class="overlay-gradient"></div>
      <div class="overlay-bottom"></div>
    </div>

    <!-- Content -->
    <div class="slide-content">
      <div class="container">
        <div class="content-wrapper">
          <!-- Title -->
          <div class="title-wrapper">
            <h2 class="title">SELAMAT DATANG DI</h2>
          </div>

          <!-- Subtitle -->
          <div class="subtitle-wrapper">
            <h1 class="subtitle">GANESHA STEMBAYO</h1>
          </div>

          <!-- Description (Animated) -->
          <div class="description-container">
            <transition-group name="slide-up" tag="div">
              <p
                v-for="(desc, index) in descriptions"
                :key="index"
                v-show="index === currentDescription"
                class="description"
              >
                {{ desc }}
              </p>
            </transition-group>
          </div>

          <!-- CTA Buttons -->
          <div class="cta-buttons">
            <button class="btn-primary" @click="handlePrimaryClick">Temukan Hal Menarik</button>
            <button class="btn-secondary" @click="handleSecondaryClick">Jelajahi Buku</button>
          </div>
        </div>
      </div>
    </div>

    

    <!-- Social Media Links with Icons -->
    <div class="social-links">
      <span class="social-label">IKUTI KAMI</span>
      <div class="social-icons">
        <a href="#" class="social-icon" aria-label="Twitter">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
          </svg>
        </a>
        <a href="#" class="social-icon" aria-label="LinkedIn">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
            <rect width="4" height="12" x="2" y="9"/>
            <circle cx="4" cy="4" r="2"/>
          </svg>
        </a>
        <a href="#" class="social-icon" aria-label="YouTube">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/>
            <path d="m10 15 5-3-5-3z"/>
          </svg>
        </a>
        <a href="#" class="social-icon" aria-label="Instagram">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
          </svg>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Libre+Baskerville:wght@400;700&display=swap');

.hero-slider {
  position: relative;
  width: 100%;
  height: 95vh;
  overflow: hidden;
  background: #131313;
}

/* Background Image Transitions */
.slide-background {
  position: absolute;
  inset: 0;
}

.image-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.slide-image {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

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

.overlay-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to right,
    rgba(0, 0, 0, 0.65),
    rgba(0, 0, 0, 0.45),
    rgba(0, 0, 0, 0.25)
  );
  z-index: 3;
}

.overlay-bottom {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  z-index: 3;
}

/* Content */
.slide-content {
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  z-index: 4;
}

.container {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 3rem;
}

.content-wrapper {
  max-width: 48rem;
}

/* Title */
.title-wrapper {
  margin-bottom: 1rem;
}

.title {
  color: white;
  font-size: 1.25rem;
  font-weight: 400;
  letter-spacing: 0.2em;
  margin-bottom: 0.5rem;
  font-family: 'Libre Baskerville', serif;
}

/* Subtitle */
.subtitle-wrapper {
  margin-bottom: 2rem;
}

.subtitle {
  color: white;
  font-size: 4.5rem;
  font-weight: 900;
  letter-spacing: 0.03em;
  margin-bottom: 0;
  line-height: 1.1;
  font-family: 'Playfair Display', serif;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

/* Description Container */
.description-container {
  position: relative;
  height: 5rem;
  margin-bottom: 2.5rem;
  overflow: hidden;
}

.description {
  position: absolute;
  color: #e5e5e5;
  font-size: 1.25rem;
  font-weight: 300;
  line-height: 1.8;
  max-width: 42rem;
  margin: 0;
  font-family: 'Libre Baskerville', serif;
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

/* CTA Buttons */
.cta-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.btn-primary,
.btn-secondary {
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  font-family: 'Inter';
  letter-spacing: 0.05em;
}

.btn-primary {
  background-color: #2c64e3;
  color: white;
}

.btn-primary:hover {
  box-shadow: 0 10px 25px rgba(44, 100, 227, 0.5);
  transform: scale(1.05);
}

.btn-secondary {
  background: transparent;
  border: 2px solid white;
  color: white;
}

.btn-secondary:hover {
  background: white;
  color: black;
  transform: scale(1.05);
}

/* Slide Indicators (Vertical Dashes on Right) */
.slide-indicators {
  position: absolute;
  right: 2.5rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  z-index: 10;
}

.indicator-dash {
  width: 5px;
  height: 2.5rem;
  background: rgba(255, 255, 255, 0.3);
  transition: all 0.4s ease;
  position: relative;
  border-radius: 20px;
}

.indicator-dash.active {
  background: #2c64e3;
  height: 3.5rem;
  box-shadow: 0 0 10px rgba(44, 100, 227, 0.6);
}

.indicator-dash.active::before {
  content: '';
  position: absolute;
  inset: -2px;
  background: rgba(44, 100, 227, 0.2);
  filter: blur(4px);
  border-radius: 20px;
}

/* Social Media Links */
.social-links {
  position: absolute;
  bottom: 2rem;
  left: 1.5rem;
  display: flex;
  gap: 1rem;
  align-items: center;
  z-index: 10;
}

.social-label {
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  font-family: 'Libre Baskerville', serif;
}

.social-icons {
  display: flex;
  gap: 0.75rem;
}

.social-icon {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(4px);
  border-radius: 50%;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
}

.social-icon:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.social-icon svg {
  width: 18px;
  height: 18px;
}

/* Responsive */
@media (max-width: 768px) {
  .container {
    padding: 0 1.5rem;
  }

  .subtitle {
    font-size: 2.5rem;
  }

  .title {
    font-size: 1rem;
  }

  .description {
    font-size: 1rem;
  }

  .description-container {
    height: 6rem;
  }

  .cta-buttons {
    flex-direction: column;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
  }

  .social-links {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }

  /* Move indicators to bottom right on mobile */
  .slide-indicators {
    right: 1rem;
    bottom: 2rem;
    top: auto;
    transform: none;
    flex-direction: row;
  }

  .indicator-dash {
    width: 2rem;
    height: 5px;
  }

  .indicator-dash.active {
    width: 2.5rem;
    height: 5px;
  }
}

@media (max-width: 1024px) {
  .subtitle {
    font-size: 3.5rem;
  }
}
</style>