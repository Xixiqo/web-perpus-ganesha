<template>
  <footer class="footer">
    <div class="footer-container">
      <!-- Bagian kiri: Deskripsi -->
      <div class="col">
        <h4>Gerbang Berdaya</h4>
        <p>
          JHIC Digital Library. Akses koleksi digital untuk semua warga sekolah.
          Baca lebih banyak, belajar lebih cepat.
        </p>
      </div>

      <!-- Bagian tengah: Alamat -->
      <div class="col">
        <h4>Alamat</h4>
        <ul>
          <li>Jl. Pendidikan No. 1</li>
          <li>Jakarta</li>
          <li>Indonesia</li>
        </ul>
      </div>

      <!-- Bagian kanan: Bantuan -->
      <div class="col">
        <h4>Bantuan</h4>
        <ul>
          <li><RouterLink to="/panduan" class="footer-link">Panduan</RouterLink></li>
          <li><RouterLink to="/kontak" class="footer-link">Kontak</RouterLink></li>
          <li><RouterLink to="/kebijakan" class="footer-link">Kebijakan</RouterLink></li>
        </ul>
      </div>
    </div>

    <div class="footer-nav">
      <div class="footer-links">
        <RouterLink to="/" class="footer-link">Beranda</RouterLink>
        <RouterLink to="/informasi" class="footer-link">Informasi</RouterLink>
        <RouterLink to="/cari" class="footer-link">Pencarian</RouterLink>
        <RouterLink to="/pinjam" class="footer-link">Peminjaman</RouterLink>
        <RouterLink to="/artikel" class="footer-link">Artikel</RouterLink>
      </div>
    </div>

    <div class="copy">
      © {{ currentYear }} Ganesha Stembayo. Semua hak dilindungi.
    </div>
  </footer>
</template>

<script setup>
const currentYear = new Date().getFullYear()
</script>

<style scoped>
.footer {
  background: #fafafa;
  color: #e5e7eb;
  margin-top: 28px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  padding-top: 2rem;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 24px;
  padding: 0 2rem 2rem;
}

.col h4 {
  color: var(--primary);
  margin-bottom: 10px;
  font-size: 1.1rem;
}

.col p,
.col li {
  color: #131313;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 6px;
}

.col ul {
  list-style: none;
  padding: 0;
}

.footer-link {
  color: var(--primary);
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.3s ease;
}

.footer-link:hover {
  opacity: 0.7;
}

/* Bagian bawah link navigasi tambahan */
.footer-nav {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1rem 2rem;
  display: flex;
  justify-content: center;
}

.footer-links {
  display: flex;
  gap: 1.2rem;
  flex-wrap: wrap;
}

.copy {
  text-align: center;
  padding: 1rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: #94a3b8;
  font-size: 0.85rem;
}

/* Responsif */
@media (max-width: 768px) {
  .footer-container {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .footer-nav {
    padding: 1rem;
  }
}
</style>
