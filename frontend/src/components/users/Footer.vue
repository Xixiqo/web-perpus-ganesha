<template>
  <footer class="footer">
    <div class="footer-container">
      <!-- Bagian kiri: Deskripsi -->
      <div class="col">
        <h4>Perpustakaan Ganesha Stembayo</h4>
        <p>
          Akses koleksi buku untuk semua warga sekolah. Baca lebih banyak, belajar lebih cepat.
Nikmati kemudahan mencari, membaca, dan meminjam buku kapan pun dan di mana pun.
Bangun kebiasaan membaca yang menyenangkan, dan jadikan perpustakaan sebagai sahabat belajar setiap hari.
        </p>
      </div>

      <!-- Bagian tengah: Alamat -->
      <div class="col">
        <h4>Alamat</h4>
        <ul>
          <li>Jl. STM Pembangunan, Mrican, Caturtunggal, Kec. Depok, Kabupaten Sleman, Daerah Istimewa Yogyakarta 55281</li>
        </ul>
      </div>

      <!-- Bagian kanan: Social Media -->
      <div class="col">
        <h4>Social Media</h4>
        <div class="social-icons">
          <!-- WhatsApp -->
          <a href="https://wa.me/6285743718200" target="_blank" rel="noopener noreferrer" class="social-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="currentColor" d="M6.62 10.79c1.44 2.83 3.76 5.15 6.59 6.59l2.2-2.2c.28-.28.67-.36 1.02-.25c1.12.37 2.32.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57c.11.35.03.74-.25 1.02z"></path>
            </svg>
          </a>
          
          <!-- Instagram -->
          <a href="https://www.instagram.com/ganeshastembayo/" target="_blank" rel="noopener noreferrer" class="social-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <g fill="none">
                <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path>
                <path fill="currentColor" d="M16 3a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5zm-4 5a4 4 0 1 0 0 8a4 4 0 0 0 0-8m0 2a2 2 0 1 1 0 4a2 2 0 0 1 0-4m4.5-3.5a1 1 0 1 0 0 2a1 1 0 0 0 0-2"></path>
              </g>
            </svg>
          </a>
          
          <!-- TikTok -->
          <a href="https://www.tiktok.com/@ganeshastembayo" target="_blank" rel="noopener noreferrer" class="social-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="currentColor" d="M16.6 5.82s.51.5 0 0A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6c0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64c0 3.33 2.76 5.7 5.69 5.7c3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48"></path>
            </svg>
          </a>
        </div>
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

/* Social Media Icons */
.social-icons {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  margin-top: 0.5rem;
}

.social-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  transition: all 0.3s ease;
  color: var(--primary);
}

.social-link:hover {
  background: var(--primary2);
  transform: translateY(-2px);
}

.social-link svg {
  width: 24px;
  height: 24px;
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

  .social-icons {
    justify-content: center;
  }

  .footer-nav {
    padding: 1rem;
  }
}
</style>