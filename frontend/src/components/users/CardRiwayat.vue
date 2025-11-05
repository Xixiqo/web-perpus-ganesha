<template>
  <div class="flex gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
    <!-- Gambar Cover -->
    <img 
      :src="bookCoverUrl" 
      alt="Cover Buku" 
      class="w-28 h-36 object-cover rounded-lg flex-shrink-0 shadow-sm"
    />
    
    <!-- Info Buku -->
    <div class="flex-1 min-w-0">
      <h3 class="text-lg font-semibold text-gray-900 mb-1 truncate">{{ book.book.title }}</h3>
      <p class="text-sm text-gray-600 mb-3">{{ book.book.author }}</p>
      
      <!-- Status Badge -->
      <div class="mb-3">
        <span 
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
          :class="statusClass"
        >
          {{ book.status }}
        </span>
      </div>
      
      <!-- Tanggal Info dengan Grid -->
      <div class="space-y-2 text-sm">
        <!-- Tanggal Pinjam -->
        <div class="flex items-start gap-2">
          <svg class="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          <div>
            <span class="text-gray-500">Dipinjam:</span>
            <span class="text-gray-900 font-medium ml-1">{{ formatDate(book.borrow_date) }}</span>
          </div>
        </div>

        <!-- Tanggal Kembali (Expected) -->
        <div v-if="book.return_date" class="flex items-start gap-2">
          <svg class="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <div>
            <span class="text-gray-500">Batas Kembali:</span>
            <span class="text-gray-900 font-medium ml-1">{{ formatDate(book.return_date) }}</span>
          </div>
        </div>

        <!-- Tanggal Dikembalikan (Actual) -->
        <div v-if="book.actual_return_date" class="flex items-start gap-2">
          <svg class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <div>
            <span class="text-gray-500">Dikembalikan:</span>
            <span class="text-green-700 font-medium ml-1">{{ formatDate(book.actual_return_date) }}</span>
          </div>
        </div>
      </div>

      <!-- Denda & Keterangan -->
      <div v-if="book.denda" class="mt-3 flex items-center gap-2 text-sm">
        <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <span class="text-red-700 font-semibold">Denda: Rp {{ formatNumber(book.denda) }}</span>
      </div>
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
    statusClass() {
      switch (this.book.status) {
        case "Dipinjam":
          return "bg-blue-100 text-blue-800";
        case "Dikembalikan":
          return "bg-green-100 text-green-800";
        case "Terlambat":
          return "bg-red-100 text-red-800";
        case "Pending":
          return "bg-amber-100 text-amber-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    },
    bookCoverUrl() {
      const cover = this.book.book.cover;
      if (!cover || cover.trim() === "") return "/default_cover.png";
      if (/^https?:\/\//i.test(cover)) return cover;
      const base = import.meta.env.VITE_API_BASE || "http://localhost:5000";
      return `${base}/uploads/${cover}`;
    },
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return "-";
      const date = new Date(dateString);
      const options = { day: '2-digit', month: 'short', year: 'numeric' };
      return date.toLocaleDateString('id-ID', options);
    },
    formatNumber(num) {
      return new Intl.NumberFormat('id-ID').format(num);
    }
  }
};
</script>