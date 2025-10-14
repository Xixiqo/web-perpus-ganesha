<template>
<section class="news-section">
  <div class="container">
    <h1 class="news-title">Temukan Berita Terbaru Kami</h1>
    <p class="news-description">
      Ikuti informasi seputar koleksi baru, kegiatan menarik, hingga berbagai pencapaian.
      Kami selalu bersemangat berbagi hal-hal terbaik untuk mendukung pengalaman membaca Anda.
    </p>

    <!-- Kartu artikel -->
    <div class="news-grid">
      <div class="news-card" v-for="(item, index) in newsList" :key="index">
        <img :src="item.image" :alt="item.title" class="news-image" />
        <div class="news-content">
          <h3 class="news-card-title">{{ item.title }}</h3>
          <p class="news-card-text">{{ item.summary }}</p>
          <button class="news-btn">Baca Selengkapnya</button>
        </div>
      </div>
    </div>
  </div>
</section>
</template>

<script>
export default {
  data() {
    return {
      newsList: [
        {
          title: 'Perpustakaan Digital Kini Hadir di Sekolah',
          summary: 'Program digitalisasi koleksi buku baru telah diluncurkan untuk memudahkan siswa mengakses bacaan.',
          image: '/news/news1.jpeg'
        },
        {
          title: 'Kegiatan Literasi Bersama Siswa',
          summary: 'Acara membaca bersama dan diskusi buku sukses menarik perhatian banyak siswa.',
          image: '/news/news2.jpeg'
        },
        {
          title: 'Peningkatan Layanan Perpustakaan 2025',
          summary: 'Kami berkomitmen meningkatkan fasilitas dan koleksi agar pengalaman membaca semakin nyaman.',
          image: '/news/news3.jpeg'
        }
      ]
    }
  }
}
</script>

<style>
.news-section {
  text-align: center;
  padding: 100px 8%;
  background: #fff;
}

.news-title {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 15px;
  color: #111;
}

.news-description {
  font-size: 16px;
  color: #666;
  max-width: 720px;
  margin: 0 auto 50px;
  line-height: 1.6;
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
}

.news-card {
  background: #f9fafb;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  text-align: left;
}

.news-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}

.news-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.news-content {
  padding: 20px;
}

.news-card-title {
  font-size: 20px;
  font-weight: 700;
  color: #222;
  margin-bottom: 8px;
}

.news-card-text {
  color: #666;
  font-size: 15px;
  line-height: 1.6;
  margin-bottom: 15px;
}

.news-btn {
  background: #3b5bff;
  color: #fff;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.3s;
}

.news-btn:hover {
  background: #2c46d4;
}

/* Responsif */
@media (max-width: 480px) {
  .news-title {
    font-size: 26px;
  }

  .news-description {
    font-size: 14px;
    margin-bottom: 30px;
  }

  .news-card-title {
    font-size: 18px;
  }

  .news-card-text {
    font-size: 14px;
  }
}

</style>