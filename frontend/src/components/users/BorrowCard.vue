<template>
  <div class="book-card">
    <div class="book-image-container">
      <img v-if="book.image" :src="book.image" :alt="book.title" class="book-image" />
      <div v-else class="book-image-placeholder"></div>
      <button v-if="book.status" class="status-badge" :class="statusClass">
        {{ book.status }}
      </button>
    </div>
    
    <div class="book-details">
      <h3 class="book-title">{{ book.title }}</h3>
      <p class="book-author">{{ book.author }}</p>
      <p class="book-isbn">{{ book.isbn }}</p>
      
      <div class="book-info">
        <div class="info-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span>Pengembalian</span>
          <span class="info-value">{{ book.returnDate }}</span>
        </div>
        
        <div class="info-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span>Peminjaman</span>
          <span class="info-value">{{ book.borrowDate }}</span>
        </div>
        
        <div class="info-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <span>Sisa Perpanjangan</span>
          <span class="info-value">{{ book.extensions }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BookCard',
  props: {
    book: {
      type: Object,
      required: true
    }
  },
  computed: {
    statusClass() {
      if (this.book.status === 'Dipinjam') return 'status-borrowed';
      if (this.book.status === 'Tersedia') return 'status-available';
      return '';
    }
  }
}
</script>

<style scoped>
.book-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.book-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.book-image-container {
  position: relative;
  width: 100%;
  padding-top: 140%;
  background: #f5f5f5;
  overflow: hidden;
}

.book-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.book-image-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 100%);
}

.status-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  border: none;
  cursor: default;
}

.status-borrowed {
  background: #fef3c7;
  color: #92400e;
}

.status-available {
  background: #dcfce7;
  color: #166534;
}

.book-details {
  padding: 16px;
}

.book-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 4px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.book-author {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 2px 0;
}

.book-isbn {
  font-size: 12px;
  color: #9ca3af;
  margin: 0 0 16px 0;
}

.book-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #6b7280;
}

.info-item svg {
  color: #9ca3af;
  flex-shrink: 0;
}

.info-value {
  margin-left: auto;
  font-weight: 500;
  color: #1f2937;
}
</style>