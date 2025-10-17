<template>
  <div class="borrow-card">
    <!-- Gambar Cover -->
    <img :src="bookCoverUrl" alt="Cover Buku" class="book-cover" />

    <!-- Info Buku -->
    <div class="book-info">
      <h3>{{ book.book.title }}</h3>
      <p>Penulis: {{ book.book.author }}</p>

      <!-- Status dengan warna -->
      <p>
        Status: 
        <span :class="statusClass">{{ book.status }}</span>
      </p>

      <!-- Tanggal Pinjam & Kembali -->
      <p>Tanggal Pinjam: {{ book.borrow_date }}</p>
      <p v-if="book.return_date">Tanggal Kembali: {{ book.return_date }}</p>
      <p v-if="book.actual_return_date">Dikembalikan: {{ book.actual_return_date }}</p>

      <!-- Denda & Keterangan -->
      <p v-if="book.denda">Denda: Rp {{ book.denda }}</p>
      <p v-if="book.keterangan">Keterangan: {{ book.keterangan }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "CardRiwayat",
  props: {
    book: {
      type: Object,
      required: true,
    },
  },
  computed: {
    // Pilih class warna berdasarkan status
    statusClass() {
      switch (this.book.status) {
        case "Dipinjam":
          return "status-dipinjam";
        case "Dikembalikan":
          return "status-dikembalikan";
        case "Terlambat":
          return "status-terlambat";
        case "Pending":
          return "status-pending";
        default:
          return "";
      }
    },
    // Tentukan URL cover
    bookCoverUrl() {
      const cover = this.book.book.cover;
      // Jika null/undefined/kosong → pakai placeholder
      if (!cover || cover.trim() === "") return "/placeholder-cover.svg";

      // Jika URL full → gunakan langsung
      if (/^https?:\/\//i.test(cover)) return cover;

      // Jika dari server → gunakan API_BASE + /uploads
      const base = import.meta.env.VITE_API_BASE || "http://localhost:5000";
      return `${base}/uploads/${cover}`;
    },
  },
};
</script>

<style scoped>
.borrow-card {
  display: flex;
  gap: 16px;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: #fff;
  transition: box-shadow 0.2s;
}
.borrow-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.12);
}

.book-cover {
  width: 120px;
  height: 160px;
  object-fit: cover;
  border-radius: 8px;
}

.book-info {
  flex: 1;
}

.book-info h3 {
  margin: 0 0 6px 0;
  font-size: 18px;
}

.book-info p {
  margin: 4px 0;
  font-size: 14px;
}

.status-dipinjam { color: #3b82f6; font-weight: 600; }
.status-dikembalikan { color: #10b981; font-weight: 600; }
.status-terlambat { color: #ef4444; font-weight: 600; }
.status-pending { color: #f59e0b; font-weight: 600; }
</style>
