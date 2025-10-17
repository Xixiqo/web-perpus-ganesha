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
        'https://images.unsplash.com/photo-1508107536691-b1449928187d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1282',
        'https://plus.unsplash.com/premium_photo-1661963932641-3f1316d66a43?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1470',
        'https://plus.unsplash.com/premium_photo-1675369009502-4125a781576a?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1470',
        'https://plus.unsplash.com/premium_photo-1661962244825-73142e2b6d93?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1936',
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
}

@media (max-width: 1024px) {
  .subtitle {
    font-size: 3.5rem;
  }
}
</style>
