<template>
  <div class="stack-carousel-container">
    <div class="carousel-content">
      <!-- Title Section -->
      <div class="carousel-header">
        <h2 class="carousel-title">
          <span class="title-main">10 Koleksi</span>
          <span class="title-highlight">Terpopuler</span>
          <span class="title-year">2025</span>
        </h2>
        <p class="carousel-subtitle">Jelajahi koleksi favorit peminjam di perpustakaan kami</p>
      </div>

      <div class="carousel-body">
        <!-- Stack of books -->
        <div class="books-stack">
          <button class="nav-button prev" @click="prevSlide">‹</button>

          <transition-group name="book-transition" tag="div" class="stack-wrapper">
            <div
              v-for="(book, index) in visibleBooks"
              :key="book.id"
              class="book-card"
              :style="getBookStyle(index)"
              :class="{ 'active': index === 0 }"
            >
              <img
                :src="getCoverUrl(book.cover)"
                :alt="book.title"
                class="book-cover"
                @error="e => e.target.src = '/default_cover.png'"
              />
            </div>
          </transition-group>

          <button class="nav-button next" @click="nextSlide">›</button>
        </div>

        <!-- Book details -->
        <transition name="fade" mode="out-in">
          <div class="book-details" :key="currentBook.id">
            <h2 class="book-title">{{ currentBook.title }}</h2>
            <p class="book-author">{{ currentBook.author }}</p>

            <div class="book-rating">
              <span
                v-for="star in 5"
                :key="star"
                class="star"
                :class="{ 'filled': star <= currentBook.rating }"
              >
                ★
              </span>
            </div>

            <p class="book-synopsis">{{ currentBook.synopsis }}</p>

            <button class="cta-button" @click="onViewBook(currentBook)">
              Lihat Buku
            </button>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StackPopBook',
  props: {
    books: {
      type: Array,
      required: true,
      default: () => []
    },
    autoplay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 4000
    }
  },
  data() {
    return {
      currentIndex: 0,
      autoplayTimer: null
    }
  },
  computed: {
    currentBook() {
      return this.books[this.currentIndex] || {}
    },
    visibleBooks() {
      const visible = []
      const totalBooks = this.books.length
      for (let i = 0; i < Math.min(4, totalBooks); i++) {
        const index = (this.currentIndex + i) % totalBooks
        visible.push(this.books[index])
      }
      return visible
    }
  },
  mounted() {
    if (this.autoplay) this.startAutoplay()
  },
  beforeUnmount() {
    this.stopAutoplay()
  },
  methods: {
    getCoverUrl(filename) {
      if (!filename) return '/default_cover.png' // null atau ''
      if (/^https?:\/\//i.test(filename)) return filename
      const base = import.meta.env.VITE_API_BASE || 'http://localhost:5000'
      return `${base}/uploads/${filename}`
    },
    getBookStyle(index) {
      const baseRotation = -8
      const rotationStep = 4
      const scale = 1 - (index * 0.05)
      const translateX = index * 15
      const translateY = index * 10
      const zIndex = 10 - index
      return {
        transform: `translateX(${translateX}px) translateY(${translateY}px) rotate(${baseRotation + (index * rotationStep)}deg) scale(${scale})`,
        zIndex: zIndex,
        opacity: index === 0 ? 1 : 0.7 - (index * 0.1)
      }
    },
    prevSlide() {
      this.currentIndex = (this.currentIndex - 1 + this.books.length) % this.books.length
      this.resetAutoplay()
    },
    nextSlide() {
      this.currentIndex = (this.currentIndex + 1) % this.books.length
      this.resetAutoplay()
    },
    startAutoplay() {
      this.autoplayTimer = setInterval(() => this.nextSlide(), this.interval)
    },
    stopAutoplay() {
      if (this.autoplayTimer) {
        clearInterval(this.autoplayTimer)
        this.autoplayTimer = null
      }
    },
    resetAutoplay() {
      if (this.autoplay) {
        this.stopAutoplay()
        this.startAutoplay()
      }
    },
    onViewBook(book) {
      this.$emit('view-book', book)
    }
  }
}
</script>

<style scoped>
.stack-carousel-container {
  position: relative;
  width: 100%;
  height: 670px;
  background: linear-gradient(135deg, #2C64E3 0%, #00C7D1 100%);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           : 64px;
}

/* Bubble pattern background */
.bubble-pattern {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 40% 70%, rgba(255, 255, 255, 0.12) 0%, transparent 50%),
    radial-gradient(circle at 90% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 10% 80%, rgba(255, 255, 255, 0.09) 0%, transparent 50%),
    radial-gradient(circle at 70% 60%, rgba(255, 255, 255, 0.07) 0%, transparent 50%);
  background-size: 
    400px 400px,
    350px 350px,
    500px 500px,
    300px 300px,
    450px 450px,
    380px 380px;
  animation: float 20s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0);
  }
  33% {
    transform: translate(30px, -30px);
  }
  66% {
    transform: translate(-20px, 20px);
  }
}

/* Carousel Header */
.carousel-header {
  text-align: center;
  margin-bottom: 40px;
  position: relative;
  z-index: 1;
}

.carousel-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0;
  line-height: 1.3;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

.title-main {
  color: white;
  font-weight: 700;
  font-size: 1em;
  letter-spacing: 1px;
  opacity: 0.95;
}

.title-highlight {
  background: linear-gradient(135deg, #FFD700, #FFA500, #FFD700);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 900;
  font-size: 1em;
  text-shadow: 0 4px 20px rgba(255, 215, 0, 0.3);
  animation: shimmer 3s ease-in-out infinite;
  letter-spacing: 1px;
}

@keyframes shimmer {
  0%, 100% {
    filter: brightness(1);
  }
  50% {
    filter: brightness(1.2);
  }
}

.title-year {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.8em;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.15);
  padding: 6px 16px;
  border-radius: 20px;
  backdrop-filter: blur(10px);
  letter-spacing: 2px;
}

.carousel-subtitle {
  color: rgba(255, 255, 255, 0.85);
  font-size: 1rem;
  margin: 15px 0 0;
  font-weight: 400;
  letter-spacing: 0.5px;
}

.carousel-body {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.carousel-content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 1200px;
  width: 90%;
  height: auto;
  padding: 40px 40px 60px;
  z-index: 1;
}

/* Books stack */
.books-stack {
  position: relative;
  width: 45%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stack-wrapper {
  position: relative;
  width: 320px;
  height: 450px;
}

.book-card {
  position: absolute;
  width: 280px;
  height: 400px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  transition: all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  left: 50%;
  top: 50%;
  margin-left: -140px;
  margin-top: -200px;
}

.book-card.active {
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.4);
}

.book-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Book transition animations */
.book-transition-enter-active {
  transition: all 0.8s ease;
}

.book-transition-leave-active {
  transition: all 0.6s ease;
}

.book-transition-enter-from {
  opacity: 0;
  transform: translateX(-100px) translateY(50px) rotate(-15deg) scale(0.8) !important;
}

.book-transition-leave-to {
  opacity: 0;
  transform: translateX(100px) translateY(-50px) rotate(15deg) scale(0.7) !important;
}

/* Book details */
.book-details {
  width: 50%;
  padding-left: 60px;
  color: white;
}

.book-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 10px 0;
  line-height: 1.2;
}

.book-author {
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0 0 20px 0;
}

.book-rating {
  margin-bottom: 20px;
}

.star {
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.3);
  margin-right: 5px;
}

.star.filled {
  color: #FFD700;
}

.book-synopsis {
  font-size: 1rem;
  line-height: 1.6;
  opacity: 0.95;
  margin: 0 0 30px 0;
  max-height: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 5;
  -webkit-box-orient: vertical;
}

.cta-button {
  background: white;
  color: #2C64E3;
  border: none;
  padding: 14px 32px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.cta-button:active {
  transform: translateY(0);
}

/* Fade transition for book details */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* Navigation arrows */
.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: #2C64E3;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  z-index: 100;
  font-weight: 300;
  line-height: 1;
}

.nav-button span {
  display: block;
  margin-top: -3px;
}

.nav-button:hover {
  background: white;
  transform: translateY(-50%) scale(1.15);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.nav-button:active {
  transform: translateY(-50%) scale(0.95);
}

.nav-button.prev {
  left: -70px;
}

.nav-button.next {
  right: -70px;
}

/* Responsive */
/* Responsive */
@media (max-width: 1200px) {
  .carousel-content {
    width: 95%;
    padding: 30px 20px 50px;
  }

  .carousel-title {
    font-size: 2.2rem;
  }

  .book-title {
    font-size: 2.2rem;
  }

  .book-details {
    padding-left: 40px;
  }
}

@media (max-width: 968px) {
  .stack-carousel-container {
    height: auto;
    min-height: 600px;
    padding: 40px 20px;
  }

  .carousel-content {
    padding: 20px 15px 30px;
  }

  .carousel-header {
    margin-bottom: 30px;
  }

  .carousel-title {
    font-size: 1.8rem;
    gap: 8px;
  }

  .title-year {
    padding: 4px 12px;
    font-size: 0.75em;
  }

  .carousel-subtitle {
    font-size: 0.9rem;
    margin-top: 10px;
  }

  .carousel-body {
    flex-direction: column;
    gap: 30px;
  }

  .books-stack {
    width: 100%;
    height: auto;
    margin-bottom: 0;
  }

  .stack-wrapper {
    width: 260px;
    height: 370px;
  }

  .book-card {
    width: 220px;
    height: 320px;
    margin-left: -110px;
    margin-top: -160px;
  }

  .book-details {
    width: 100%;
    padding-left: 0;
    text-align: center;
  }

  .book-title {
    font-size: 1.8rem;
  }

  .book-author {
    font-size: 1rem;
  }

  .book-synopsis {
    -webkit-line-clamp: 4;
    font-size: 0.95rem;
  }

  .nav-button {
    width: 45px;
    height: 45px;
    font-size: 1.8rem;
  }

  .nav-button.prev {
    left: -20px;
  }

  .nav-button.next {
    right: -20px;
  }
}

@media (max-width: 640px) {
  .stack-carousel-container {
    padding: 30px 10px;
    min-height: 550px;
  }

  .carousel-content {
    width: 100%;
    padding: 15px 10px 20px;
  }

  .carousel-header {
    margin-bottom: 25px;
  }

  .carousel-title {
    font-size: 1.5rem;
    gap: 6px;
  }

  .title-year {
    font-size: 0.7em;
    padding: 3px 10px;
  }

  .carousel-subtitle {
    font-size: 0.85rem;
  }

  .carousel-body {
    gap: 25px;
  }

  .stack-wrapper {
    width: 200px;
    height: 290px;
  }

  .book-card {
    width: 170px;
    height: 250px;
    margin-left: -85px;
    margin-top: -125px;
  }

  .book-details {
    padding: 0 10px;
  }

  .book-title {
    font-size: 1.5rem;
  }

  .book-author {
    font-size: 0.95rem;
    margin-bottom: 15px;
  }

  .book-rating {
    margin-bottom: 15px;
  }

  .star {
    font-size: 1.3rem;
    margin-right: 3px;
  }

  .book-synopsis {
    font-size: 0.9rem;
    -webkit-line-clamp: 3;
    margin-bottom: 20px;
  }

  .cta-button {
    padding: 12px 28px;
    font-size: 0.95rem;
  }

  .nav-button {
    width: 40px;
    height: 40px;
    font-size: 1.6rem;
  }

  .nav-button.prev {
    left: -15px;
  }

  .nav-button.next {
    right: -15px;
  }
}

@media (max-width: 480px) {
  .stack-carousel-container {
    padding: 20px 5px;
  }

  .carousel-title {
    font-size: 1.3rem;
    flex-direction: column;
    gap: 4px;
  }

  .title-year {
    font-size: 0.65em;
  }

  .carousel-subtitle {
    font-size: 0.8rem;
  }

  .stack-wrapper {
    width: 160px;
    height: 240px;
  }

  .book-card {
    width: 140px;
    height: 210px;
    margin-left: -70px;
    margin-top: -105px;
  }

  .book-title {
    font-size: 1.3rem;
  }

  .book-author {
    font-size: 0.9rem;
  }

  .star {
    font-size: 1.2rem;
  }

  .book-synopsis {
    font-size: 0.85rem;
    -webkit-line-clamp: 2;
  }

  .cta-button {
    padding: 10px 24px;
    font-size: 0.9rem;
  }

  .nav-button {
    width: 35px;
    height: 35px;
    font-size: 1.4rem;
  }

  .nav-button.prev {
    left: -10px;
  }

  .nav-button.next {
    right: -10px;
  }
}

@media (max-width: 380px) {
  .carousel-title {
    font-size: 1.1rem;
  }

  .carousel-subtitle {
    font-size: 0.75rem;
  }

  .stack-wrapper {
    width: 140px;
    height: 210px;
  }

  .book-card {
    width: 120px;
    height: 180px;
    margin-left: -60px;
    margin-top: -90px;
  }

  .book-title {
    font-size: 1.1rem;
  }

  .nav-button {
    width: 32px;
    height: 32px;
    font-size: 1.2rem;
  }

  .nav-button.prev {
    left: -5px;
  }

  .nav-button.next {
    right: -5px;
  }
}
</style>