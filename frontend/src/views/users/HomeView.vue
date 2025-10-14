<template>
  <div class="home">
    <!-- Top banner image -->
    <section class="container banner">
      <div class="banner-img" role="img" aria-label="Rak buku perpustakaan"></div>
    </section>

    <!-- Featured highlight 
    <section class="container featured">
      <div class="featured-inner">
        <div class="featured-left">
          <div class="cover-stack">rcd
            <img class="cover main" src="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=640&auto=format&fit=crop" alt="Sampul buku utama" />
            <img class="cover small s1" src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=400&auto=format&fit=crop" alt="Sampul buku 2" />
            <img class="cover small s2" src="https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=400&auto=format&fit=crop" alt="Sampul buku 3" />
          </div>
        </div>
        <div class="featured-right">
          <h2 class="book-title">See You Again Love</h2>
          <div class="rating">
            <span class="stars">⭐⭐⭐⭐⭐</span>
            <span class="score">4.8</span>
          </div>
          <p class="book-desc">
            Kisah romansa yang menyentuh hati tentang kesempatan kedua, pertemanan, dan keberanian untuk
            memulai kembali. Temukan cerita yang akan membuatmu sulit meletakkan buku ini.
          </p>
          <div class="cta">
            <button class="btn primary">Baca Sekarang</button>
            <button class="btn ghost">Detail</button>
          </div>
        </div>
      </div>
    </section>
    -->

    <!-- Rekomendasi Koleksi -->
    <section class="container section">
      <div class="section-header">
        <h3>Rekomendasi Koleksi</h3>
        <a href="#" class="see-all">Lihat semua</a>
      </div>
      <div class="grid">
        <div class="book-card" v-for="n in 8" :key="'rec-'+n">
          <div class="thumb placeholder"></div>
          <div class="meta">
            <h4>Judul Buku {{ n }}</h4>
            <p class="author">Kategori • Penulis</p>
            <div class="rating small">
              <span class="stars">⭐⭐⭐⭐</span>
              <span class="score">4.2</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Pilih Buku Berdasarkan -->
    <section class="container section">
      <div class="section-header">
        <h3>Pilih Buku Berdasarkan</h3>
        <a href="#" class="see-all">Lihat lainnya</a>
      </div>
      <div class="grid">
        <div class="book-card" v-for="n in 6" :key="'cat-'+n">
          <div class="thumb placeholder alt"></div>
          <div class="meta">
            <h4>Kategori {{ n }}</h4>
            <p class="author">120+ buku</p>
            <div class="rating small">
              <span class="stars">⭐⭐⭐⭐⭐</span>
              <span class="score">5.0</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Wave + Podium Top Readers -->
    <section class="podium">
     <!-- <svg class="wave" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
        <path fill="#e9f0ff" d="M0,96L80,90.7C160,85,320,75,480,90.7C640,107,800,149,960,154.7C1120,160,1280,128,1360,112L1440,96L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z" />
      </svg>
      -->
      <div class="podium-inner container">
        <div class="podium-title">Penikmat Koleksi <span>Tahun 2025</span></div>
        <div class="steps">
          <div class="step second">
            <div class="avatar crown silver">🥈</div>
            <div class="name">Gendis</div>
            <div class="points">2 Peminjaman</div>
            <div class="block">2nd</div>
          </div>
          <div class="step first">
            <div class="avatar crown gold">👑</div>
            <div class="name">Rafif</div>
            <div class="points">3 Peminjaman</div>
            <div class="block">1st</div>
          </div>
          <div class="step third">
            <div class="avatar crown bronze">🥉</div>
            <div class="name">Naila</div>
            <div class="points">1 Peminjaman</div>
            <div class="block">3th</div>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script>
export default {
  name: 'HomeBetter'
}
</script>

<style scoped>
:root { --primary:#3b82f6; --primary-2:#5b8df7; --text:#1f2937; }

.home { background: #ffffff; }

.container { max-width: 1200px; margin: 0 auto; padding: 1rem; }

/* Banner */
.banner { margin-top: 1rem; }
.banner-img {
  height: 220px;
  border-radius: 14px;
  background: url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1600&auto=format&fit=crop') center/cover no-repeat;
  box-shadow: 0 10px 24px rgba(0,0,0,0.12);
}

/* Featured */
.featured { margin-top: 18px; }
.featured-inner {
  background: linear-gradient(135deg, #3b82f6, #22c1c3);
  color: #fff;
  border-radius: 16px;
  display: grid;
  grid-template-columns: 1fr 1.1fr;
  gap: 1rem;
  padding: 1.5rem 2rem;
  overflow: hidden;
}
.cover-stack { position: relative; height: 200px; display:flex; align-items:center; }
.cover { border-radius: 12px; box-shadow: 0 10px 24px rgba(0,0,0,0.2); object-fit: cover; }
.cover.main { width: 160px; height: 200px; transform: rotate(-4deg); z-index: 2; }
.cover.small { width: 110px; height: 140px; position: absolute; filter: brightness(0.95); }
.cover.small.s1 { left: -10px; top: 30px; transform: rotate(-12deg); z-index:1; opacity:0.9; }
.cover.small.s2 { left: 120px; bottom: 10px; transform: rotate(8deg); z-index:1; opacity:0.9; }

.book-title { font-size: 1.8rem; margin-bottom: .25rem; font-weight: 800; }
.rating { display: flex; align-items: center; gap: .5rem; margin: .25rem 0 1rem; }
.rating .score { opacity: .9; }
.book-desc { opacity: .95; max-width: 560px; }
.cta { margin-top: 1rem; display:flex; gap:.75rem; }
.btn { border: 0; border-radius: 10px; padding: .7rem 1.1rem; font-weight: 600; cursor:pointer; }
.btn.primary { background: #fff; color:#2563eb; }
.btn.ghost { background: rgba(255,255,255,.15); color:#fff; border:1px solid rgba(255,255,255,.35); }
.btn:hover { transform: translateY(-1px); }

/* Sections */
.section { margin-top: 28px; }
.section-header { display:flex; justify-content: space-between; align-items:center; margin-bottom: 12px; }
.section-header h3 { color:#0f172a; font-size: 1.2rem; }
.see-all { color:#3b82f6; text-decoration: none; font-weight:600; }

.grid { display:grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
.book-card { background: #fff; border:2px solid #eef2ff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 14px rgba(37,99,235,0.08); transition: transform .2s ease; }
.book-card:hover { 
  transform: translateY(-4px); 
  border: 2px solid #3b82f6;
  box-shadow: 0 10px 24px rgba(37,99,235,0.2);
  transition: all 0.5s ease-in-out;
}
.thumb { height: 150px; background:#f8fafc; }
.placeholder { background-image:
  linear-gradient(45deg, #f3f4f6 25%, transparent 25%),
  linear-gradient(-45deg, #f3f4f6 25%, transparent 25%),
  linear-gradient(45deg, transparent 75%, #f3f4f6 75%),
  linear-gradient(-45deg, transparent 75%, #f3f4f6 75%);
  background-size: 20px 20px; background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
}
.placeholder.alt { background-color:#eef2ff; }
.meta { padding: .8rem; }
.meta h4 { font-size: .95rem; color:#111827; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.meta .author { font-size: .8rem; color:#64748b; margin-bottom: 6px; }
.rating.small .stars { font-size: .9rem; }
.rating.small .score { font-size: .85rem; color:#475569; }

/* Podium */
.podium { margin-top: 36px; background: linear-gradient(#ffffff 0, #e9f0ff 40%, #d8e5ff 100%); padding-top: 20px; }
.wave { display:block; width:100%; height:90px; }
.podium-inner { padding-bottom: 30px; }
.podium-title { text-align:center; font-weight:900; letter-spacing:.5px; font-size: 2.4rem; color:#0f172a; margin: 0 auto 16px; }
.podium-title span { color:#3b82f6; font-weight: 700;} 
.steps { display:grid; grid-template-columns: repeat(3, 1fr); gap: 14px; align-items:end; }
.step { text-align:center; position: relative; }
.avatar { width: 70px; height: 70px; border-radius: 50%; display:grid; place-items:center; margin: 0 auto 8px; font-size: 28px; color:#fff; }
.crown.gold { background: linear-gradient(135deg, #fbbf24, #f59e0b); }
.crown.silver { background: linear-gradient(135deg, #cbd5e1, #94a3b8); }
.crown.bronze { background: linear-gradient(135deg, #f59e0b, #ea580c); }
.name { font-weight: 700; color:#0f172a; }
.points { color:#334155; font-size:.9rem; margin-bottom: 8px; }
.block { background: linear-gradient(180deg,#3b82f6,#5b8df7); color:#fff; font-weight:800; border-radius: 50px 50px 0 0; width: 100%; height: 70px; display:grid; place-items:center; box-shadow: 0 10px 22px rgba(59,130,246,0.35); }
.first .block { height: 100vh; }
.second .block { height: 85vh; }
.third .block { height: 70vh; }



/* Responsive */
@media (max-width: 980px) {
  .grid { grid-template-columns: repeat(3, 1fr); }
  .featured-inner { grid-template-columns: 1fr; }
}
@media (max-width: 680px) {
  .grid { grid-template-columns: repeat(2, 1fr); }
  .banner-img { height: 170px; }
}
@media (max-width: 420px) {
  .grid { grid-template-columns: 1fr; }
}
</style>