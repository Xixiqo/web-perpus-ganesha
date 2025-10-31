<template>
  <div class="max-w-[1400px] mx-auto px-5 py-10 bg-[#FAFAFA] min-h-screen">
    <!-- Loading State -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center min-h-[60vh] gap-5">
      <div class="w-[50px] h-[50px] border-4 border-gray-200 border-t-[#2C64F9] rounded-full animate-spin"></div>
      <p class="text-lg text-gray-500 font-medium">Memuat detail buku...</p>
    </div>

    <!-- Content -->
    <div v-else-if="book" class="grid lg:grid-cols-[320px_1fr] gap-[60px] items-start">
      <!-- Left Side - Book Cover (Sticky) -->
      <aside class="relative">
        <button 
          @click="goBack"
          class="flex items-center gap-2 px-4 py-2.5 mb-5 bg-gray-100 border-none rounded-lg text-sm font-semibold text-gray-700 cursor-pointer transition-all duration-300 hover:bg-gray-200 hover:text-gray-900 group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="transition-transform duration-300 group-hover:-translate-x-1">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Kembali
        </button>
        
        <div class="lg:sticky lg:top-5 bg-white p-[30px] rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
          <div class="relative mb-6">
            <img 
              :src="book.coverImage" 
              :alt="book.title" 
              class="w-full rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
              @error="onImageError"
            />
            
            <!-- Share Button -->
            <button 
              :class="[
                'absolute top-3 right-3 w-10 h-10 border-none rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 shadow-[0_2px_8px_rgba(0,0,0,0.15)]',
                isLinkCopied 
                  ? 'bg-[#2C64F9] text-white hover:bg-[#2C64F9] hover:scale-110' 
                  : 'bg-white/95 backdrop-blur-[8px] text-gray-700 hover:bg-white hover:scale-110 hover:text-[#2C64F9]'
              ]"
              @click="copyLink"
              :title="isLinkCopied ? 'Link tersalin!' : 'Salin link'"
            >
              <svg v-if="!isLinkCopied" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </button>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col gap-3">
            <button 
              @click="openBorrowModal"
              class="px-5 py-3.5 border-none rounded-lg text-[0.95rem] font-semibold cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 bg-[#2C64F9] text-white hover:bg-[#1e4ed8] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(44,100,249,0.3)]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
              Pinjam Buku
            </button>
          </div>
        </div>
      </aside>

      <!-- Right Side - Book Details -->
      <main class="bg-white p-10 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
        <!-- Book Title & Meta -->
        <div class="mb-8">
          <h1 class="text-[2.5rem] font-bold text-gray-900 mb-3 leading-tight">{{ book.title }}</h1>
          <p class="text-lg text-gray-500 mb-4">oleh <span class="text-[#2C64F9] font-semibold">{{ book.author }}</span> | {{ book.publishDate }}</p>
          
          <!-- Rating & Badges -->
          <div class="flex items-center gap-5 flex-wrap" v-if="book.rating">
            <div class="flex items-center gap-2">
              <div class="flex gap-0.5">
                <span v-for="i in 5" :key="i" :class="i <= book.rating ? 'text-[#FBBF24]' : 'text-gray-300'" class="text-xl">★</span>
              </div>
              <span class="text-sm text-gray-500">({{ book.reviewCount }} reviews)</span>
              <span v-if="book.readerCount" class="text-sm text-gray-500">• {{ book.readerCount }} pembaca</span>
            </div>
          </div>
        </div>

        <!-- Description -->
        <div v-if="book.description" class="mb-10 p-6 bg-gray-50 rounded-lg border-t-4 lg:border-t-0 lg:border-l-4 border-[#2C64F9]">
          <div :class="['relative overflow-hidden transition-[max-height] duration-400', isDescriptionExpanded ? 'max-h-none' : 'max-h-[150px]']">
            <p class="text-base leading-relaxed text-gray-700 m-0">{{ book.description }}</p>
          </div>
          <button 
            v-if="book.description && book.description.length > 300"
            @click="isDescriptionExpanded = !isDescriptionExpanded"
            class="mt-3 px-4 py-2 bg-transparent border border-[#2C64F9] text-[#2C64F9] rounded-md text-[0.85rem] font-semibold cursor-pointer transition-all duration-300 hover:bg-[#2C64F9] hover:text-white"
          >
            {{ isDescriptionExpanded ? 'Tampilkan Lebih Sedikit' : 'Baca Selengkapnya' }}
          </button>
        </div>

        <!-- Detail Buku -->
        <section class="mb-10">
          <h2 class="text-2xl font-bold text-gray-900 mb-5 pb-3 border-b-2 border-gray-200">Detail Buku</h2>
          <div class="grid md:grid-cols-2 gap-5">
            <div v-if="book.publisher" class="flex flex-col gap-1">
              <span class="text-[0.85rem] text-gray-500 font-medium">Penerbit</span>
              <span class="text-base text-gray-900 font-semibold">{{ book.publisher }}</span>
            </div>
            <div v-if="book.publishDate" class="flex flex-col gap-1">
              <span class="text-[0.85rem] text-gray-500 font-medium">Tanggal Terbit</span>
              <span class="text-base text-gray-900 font-semibold">{{ book.publishDate }}</span>
            </div>
            <div v-if="book.isbn" class="flex flex-col gap-1">
              <span class="text-[0.85rem] text-gray-500 font-medium">ISBN</span>
              <span class="text-base text-gray-900 font-semibold">{{ book.isbn }}</span>
            </div>
            <div v-if="book.pages" class="flex flex-col gap-1">
              <span class="text-[0.85rem] text-gray-500 font-medium">Halaman</span>
              <span class="text-base text-gray-900 font-semibold">{{ book.pages }}</span>
            </div>
            <div v-if="book.language" class="flex flex-col gap-1">
              <span class="text-[0.85rem] text-gray-500 font-medium">Bahasa</span>
              <span class="text-base text-gray-900 font-semibold">{{ book.language }}</span>
            </div>
          </div>
        </section>

        <!-- Ketersediaan Buku -->
        <section v-if="book.availability && book.availability.length > 0" class="mb-10">
          <h2 class="text-2xl font-bold text-gray-900 mb-5 pb-3 border-b-2 border-gray-200">Lokasi dan Ketersediaan</h2>
          <div class="bg-gray-50 rounded-lg overflow-hidden">
            <div class="hidden sm:grid grid-cols-[2fr_1fr_1fr] gap-4 px-5 py-4 bg-blue-100 font-semibold text-sm text-blue-900">
              <div>Lokasi dan Nomor Panggil</div>
              <div>Kode Buku</div>
              <div>Status</div>
            </div>
            <div v-for="item in book.availability" :key="item.code" class="sm:grid sm:grid-cols-[2fr_1fr_1fr] flex flex-col gap-2 sm:gap-4 px-5 py-4 border-b border-gray-200 last:border-b-0 sm:bg-transparent bg-white rounded-lg sm:rounded-none mb-3 sm:mb-0 sm:border sm:border-transparent">
              <div class="w-full">
                <div class="font-semibold text-gray-900 mb-1">{{ item.location }}</div>
                <div class="text-[0.85rem] text-gray-500">{{ item.callNumber }}</div>
              </div>
              <div class="flex items-center font-semibold text-gray-700 w-full sm:justify-start mt-2 sm:mt-0">{{ item.code }}</div>
              <div class="w-full sm:justify-start mt-2 sm:mt-0">
                <span :class="[
                  'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[0.85rem] font-semibold',
                  item.status === 'Tersedia' ? 'bg-emerald-100 text-emerald-800' :
                  item.status === 'Dipinjam' ? 'bg-amber-100 text-amber-800' :
                  'bg-red-100 text-red-800'
                ]">
                  <span v-if="item.status === 'Tersedia'">✓</span>
                  <span v-else-if="item.status === 'Dipinjam'">📚</span>
                  <span v-else>⏱</span>
                  {{ item.status }}
                </span>
              </div>
            </div>
          </div>
        </section>

        <!-- Buku Lainnya -->
        <section class="mb-5">
          <h2 class="text-2xl font-bold text-gray-900 mb-5 pb-3 border-b-2 border-gray-200">Rekomendasi Buku Lainnya</h2>
          
          <div v-if="isLoadingRelated" class="flex items-center justify-center gap-3 py-10">
            <div class="w-[30px] h-[30px] border-3 border-gray-200 border-t-[#2C64F9] rounded-full animate-spin"></div>
            <p class="text-[0.95rem] text-gray-500">Memuat rekomendasi...</p>
          </div>

          <div v-else-if="relatedBooks.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div 
              v-for="relatedBook in relatedBooks" 
              :key="relatedBook.id" 
              @click="goToBook(relatedBook.id)"
              class="bg-white border border-gray-200 rounded-lg overflow-hidden transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-[0_8px_16px_rgba(0,0,0,0.1)] hover:border-[#2C64F9]"
            >
              <img 
                :src="getCoverUrl(relatedBook.cover)" 
                :alt="relatedBook.title" 
                class="w-full h-[220px] object-cover bg-gray-100"
                @error="onRelatedImageError"
              />
              <div class="p-4">
                <h4 class="text-[0.95rem] font-semibold text-gray-900 mb-1.5 line-clamp-2 leading-[1.4] min-h-[2.8em]">{{ relatedBook.title }}</h4>
                <p class="text-[0.8rem] text-gray-500">oleh {{ relatedBook.author }} | {{ relatedBook.year }}</p>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-10 text-gray-500">
            <p>Tidak ada rekomendasi buku saat ini</p>
          </div>
        </section>
      </main>
    </div>

    <!-- Error State -->
    <div v-else class="flex flex-col items-center justify-center min-h-[60vh] gap-5 text-center">
      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-red-500">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <h2 class="text-[1.8rem] font-bold text-gray-900">Buku tidak ditemukan</h2>
      <p class="text-base text-gray-500 mb-5">Maaf, buku yang Anda cari tidak tersedia.</p>
      <button 
        @click="goBack"
        class="px-8 py-3.5 border-2 border-[#2C64F9] bg-white text-[#2C64F9] rounded-lg text-base font-semibold cursor-pointer transition-all duration-300 hover:bg-[#2C64F9] hover:text-white"
      >
        Kembali
      </button>
    </div>

    <!-- Member Modal (untuk non-member) -->
    <transition name="modal-fade">
      <div v-if="showMemberModal" @click="closeMemberModal" class="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] p-5 backdrop-blur-sm overflow-y-auto">
        <div @click.stop class="bg-white rounded-2xl max-w-[550px] w-full max-h-[90vh] overflow-y-auto shadow-[0_20px_40px_rgba(0,0,0,0.3)] animate-[modalSlideUp_0.3s_ease-out] my-auto">
          <div class="flex items-center justify-between px-6 pt-6 pb-0 mb-5 sticky top-0 bg-white z-10">
            <h3 class="text-2xl font-bold text-gray-900"></h3>
            <button 
              @click="closeMemberModal"
              class="w-8 h-8 border-none bg-gray-100 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 text-gray-500 shrink-0 hover:bg-gray-200 hover:text-gray-900"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div class="px-6 pb-6">
            <div class="flex justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-[#2C64F9] stroke-[1.5]">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>

            <h4 class="text-2xl font-bold text-gray-900 text-center mb-4">Jadilah Member Perpustakaan</h4>
            <p class="text-[0.95rem] text-gray-500 leading-relaxed text-center mb-8 px-4">
              Untuk meminjam buku, Anda harus menjadi member terdaftar. Kunjungi perpustakaan kami dan lakukan pendaftaran untuk mendapatkan akses penuh ke koleksi buku.
            </p>

            <div class="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6">
              <h5 class="text-[0.95rem] font-bold text-gray-900 mb-4 mt-0">Keuntungan Member:</h5>
              <ul class="list-none p-0 m-0 flex flex-col gap-3">
                <li class="flex items-center gap-3 text-sm text-gray-700">
                  <span class="inline-flex items-center justify-center w-6 h-6 bg-emerald-500 text-white rounded-full shrink-0 font-bold text-[0.8rem]">✓</span>
                  <span>Pinjam buku hingga 5 judul sekaligus</span>
                </li>
                <li class="flex items-center gap-3 text-sm text-gray-700">
                  <span class="inline-flex items-center justify-center w-6 h-6 bg-emerald-500 text-white rounded-full shrink-0 font-bold text-[0.8rem]">✓</span>
                  <span>Durasi peminjaman 14 hari</span>
                </li>
                <li class="flex items-center gap-3 text-sm text-gray-700">
                  <span class="inline-flex items-center justify-center w-6 h-6 bg-emerald-500 text-white rounded-full shrink-0 font-bold text-[0.8rem]">✓</span>
                  <span>Prioritas pemesanan buku</span>
                </li>
              </ul>
            </div>

            <div class="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6">
              <h5 class="text-[0.95rem] font-bold text-gray-900 mb-4 mt-0">Hubungi Kami:</h5>
              <div class="flex flex-col gap-4">
                <div class="flex gap-3 items-start">
                  <span class="text-2xl shrink-0 mt-0.5">⏰</span>
                  <div class="flex-1">
                    <p class="text-[0.8rem] text-gray-500 font-semibold m-0 uppercase tracking-wider">Jam Operasional</p>
                    <p class="text-sm text-gray-900 font-semibold mt-1 mb-0">Senin - Jumat: 07:00 - 15:00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex gap-3 px-6 pb-6 sticky bottom-0 bg-white pt-4">
            <button 
              @click="closeMemberModal"
              class="flex-1 px-5 py-3.5 border-none rounded-lg text-[0.95rem] font-semibold cursor-pointer transition-all duration-300 bg-[#2C64F9] text-white hover:bg-[#1e4ed8] hover:shadow-[0_4px_12px_rgba(44,100,249,0.3)]"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Borrow Confirmation Modal -->
    <transition name="modal-fade">
      <div v-if="showModal" @click="closeModal" class="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] p-5 backdrop-blur-sm overflow-y-auto">
        <div @click.stop class="bg-white rounded-2xl max-w-[550px] w-full max-h-[90vh] overflow-y-auto shadow-[0_20px_40px_rgba(0,0,0,0.3)] animate-[modalSlideUp_0.3s_ease-out] my-auto">
          <div class="flex items-center justify-between px-6 pt-6 pb-0 mb-5 sticky top-0 bg-white z-10">
            <h3 class="text-2xl font-bold text-gray-900">Konfirmasi Peminjaman Buku</h3>
            <button 
              @click="closeModal"
              class="w-8 h-8 border-none bg-gray-100 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 text-gray-500 shrink-0 hover:bg-gray-200 hover:text-gray-900"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div class="px-6 pb-6">
            <p class="text-base text-gray-700 mb-6 leading-relaxed">Apakah Anda yakin ingin mengajukan peminjaman buku ini?</p>
            
            <div class="flex gap-4 p-5 bg-gray-50 rounded-xl mb-5 border-2 border-gray-200 flex-col sm:flex-row items-center sm:items-start text-center sm:text-left">
              <img 
                :src="book.coverImage" 
                :alt="book.title" 
                class="w-20 sm:w-20 h-[120px] sm:h-[120px] object-cover rounded-md shadow-[0_2px_8px_rgba(0,0,0,0.1)] shrink-0"
                @error="e => e.target.src = '/default_cover.png'"
              />
              <div class="flex-1 flex flex-col gap-2 min-w-0 items-center sm:items-start">
                <h4 class="text-lg font-bold text-gray-900 leading-tight line-clamp-2 break-words">{{ book.title }}</h4>
                <p class="text-sm text-gray-500">{{ book.author }}</p>
                <div v-if="selectedBook" class="flex items-center gap-2 mt-1 flex-wrap justify-center sm:justify-start">
                  <span class="text-[0.85rem] text-gray-500 font-medium">Kode Buku:</span>
                  <span class="text-sm text-[#2C64F9] font-bold bg-blue-100 px-3 py-1 rounded-md">{{ selectedBook.code }}</span>
                </div>
                <div v-if="selectedBook" class="flex items-center gap-1.5 text-[0.85rem] text-gray-500 flex-wrap justify-center sm:justify-start">
                  <span class="text-base">📍</span>
                  <span>{{ selectedBook.location }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-3 px-6 pb-6 sticky bottom-0 bg-white pt-4">
            <button 
              @click="closeModal"
              class="flex-1 px-5 py-3.5 border-none rounded-lg text-[0.95rem] font-semibold cursor-pointer transition-all duration-300 bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Batal
            </button>
            <button 
              @click="confirmBorrow"
              class="flex-1 px-5 py-3.5 border-none rounded-lg text-[0.95rem] font-semibold cursor-pointer transition-all duration-300 bg-[#2C64F9] text-white hover:bg-[#1e4ed8] hover:shadow-[0_4px_12px_rgba(44,100,249,0.3)]"
            >
              Ya, Ajukan Peminjaman
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Success Confirmation -->
    <transition name="modal-fade">
      <div v-if="showConfirmation" @click="closeConfirmation" class="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] p-5 backdrop-blur-sm overflow-y-auto">
        <div @click.stop class="bg-white rounded-2xl text-center py-10 px-[30px] max-w-[450px] w-full shadow-[0_20px_40px_rgba(0,0,0,0.3)] animate-[modalSlideUp_0.3s_ease-out] my-auto">
          <div class="inline-flex w-20 h-20 items-center justify-center bg-emerald-100 rounded-full mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-emerald-500">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          
          <h3 class="text-[1.8rem] font-bold text-gray-900 mb-4">Pengajuan Berhasil!</h3>
          <p class="text-base text-gray-500 leading-relaxed mb-6">Peminjaman buku Anda telah diajukan. Pihak perpustakaan akan segera menghubungi Anda</p>

          <button 
            @click="closeConfirmation"
            class="w-full px-5 py-3.5 border-none rounded-lg text-base font-semibold bg-[#2C64F9] text-white cursor-pointer transition-all duration-300 hover:bg-[#1e4ed8] hover:shadow-[0_4px_12px_rgba(44,100,249,0.3)]"
          >
            Mengerti
          </button>
        </div>
      </div>
    </transition>

    <!-- Alert Notifications -->
    <transition name="slide-fade">
      <div v-if="alert.show" :class="[
        'fixed bottom-6 right-6 min-w-[320px] max-w-[420px] px-5 py-4 rounded-lg flex items-center gap-3 shadow-[0_4px_12px_rgba(0,0,0,0.15)] z-[9999] border-l-4',
        alert.type === 'success' ? 'bg-emerald-100 border-l-emerald-600 text-emerald-900' :
        alert.type === 'error' ? 'bg-red-100 border-l-red-600 text-red-900' :
        'bg-blue-100 border-l-blue-500 text-blue-900'
      ]">
        <div class="text-xl leading-none font-bold">
          <span v-if="alert.type === 'success'" class="text-emerald-600">✓</span>
          <span v-else-if="alert.type === 'error'" class="text-red-600">✕</span>
          <span v-else class="text-blue-500">ℹ</span>
        </div>
        <div class="flex-1">
          <span class="text-[0.95rem] font-medium leading-[1.4]">{{ alert.message }}</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// ===== AUTH STATE =====
const currentUser = ref(null)
const isLoadingAuth = ref(true)

// ===== BOOK STATE =====
const book = ref(null)
const relatedBooks = ref([])
const isLoading = ref(true)
const isLoadingRelated = ref(true)
const isDescriptionExpanded = ref(false)

// ===== MODAL STATE =====
const isLinkCopied = ref(false)
const showModal = ref(false)
const showConfirmation = ref(false)
const showMemberModal = ref(false)
const selectedBook = ref(null)
const userDataStatus = ref({ isComplete: true, missingFields: [] })

// ===== FETCH CURRENT USER =====
const fetchCurrentUser = async () => {
  isLoadingAuth.value = true
  try {
    const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:5000'
    const token = localStorage.getItem('token')
    
    if (!token) {
      currentUser.value = null
      isLoadingAuth.value = false
      return
    }

    const res = await fetch(`${apiBase}/api/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })

    if (res.ok) {
      const data = await res.json()
      currentUser.value = data.user || data
      console.log('✅ User logged in:', currentUser.value)
    } else {
      currentUser.value = null
      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('token')
      }
    }
  } catch (err) {
    console.error('❌ Error fetching user:', err)
    currentUser.value = null
  } finally {
    isLoadingAuth.value = false
  }
}

// ===== CHECK USER DATA COMPLETENESS =====
const checkUserDataCompleteness = (user) => {
  const requiredFields = [
    { key: 'nama_lengkap', label: 'Nama Lengkap' },
    { key: 'email', label: 'Email' },
    { key: 'no_telp', label: 'Nomor Telepon' },
    { key: 'alamat', label: 'Alamat' }
  ]

  const missingFields = []

  requiredFields.forEach(field => {
    const value = user[field.key]
    if (!value || value.toString().trim() === '' || value === null) {
      missingFields.push(field.label)
    }
  })

  return {
    isComplete: missingFields.length === 0,
    missingFields
  }
}

// ===== CHECK MEMBERSHIP STATUS =====
const checkMembershipStatus = (user) => {
  if (!user.id_anggota && !user.id) {
    return { isActive: false, reason: 'not_member' }
  }

  if (!user.member_expired) {
    return { isActive: false, reason: 'no_expiry_date' }
  }

  const today = new Date()
  const expiryDate = new Date(user.member_expired)
  
  if (expiryDate < today) {
    return { isActive: false, reason: 'expired' }
  }

  return { isActive: true }
}

// ===== BOOK DETAIL FUNCTIONS =====
const onImageError = (event) => {
  event.target.src = '/default_cover.png'
}

const onRelatedImageError = (event) => {
  event.target.src = '/default_cover.png'
}

const getCoverUrl = (filename) => {
  const base = import.meta.env.VITE_API_BASE || 'http://localhost:5000'
  if (!filename) return '/default_cover.png'
  if (/^https?:\/\//i.test(filename)) return filename
  return `${base}/uploads/${filename}`
}

const fetchBookDetails = async (id) => {
  try {
    const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:5000'
    const res = await fetch(`${apiBase}/api/books/${id}`)

    if (res.ok) {
      const data = await res.json()
      book.value = {  
        id: data.id,
        title: data.judul || data.title || '',
        author: data.pembuat || data.author || '',
        publishDate: data.tahun_rilis || data.publishDate || '',
        coverImage: getCoverUrl(data.cover),
        description: data.sinopsis || data.description || '',
        publisher: data.penerbit || data.publisher || '',
        isbn: data.isbn_issn || data.isbn || '',
        pages: data.halaman || data.pages || '',
        language: data.bahasa_buku || data.language || '',
        rating: data.rating || 0,
        reviewCount: data.reviewCount || 0,
        readerCount: data.readerCount || 0,
        availability: data.availability || []
      }
    } else {
      book.value = null
    }
  } catch (err) {
    console.error('Failed to fetch book details:', err)
    book.value = null
  } finally {
    isLoading.value = false
  }
}

const fetchRelatedBooks = async () => {
  try {
    const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:5000'
    const res = await fetch(`${apiBase}/api/books`)
    
    if (res.ok) {
      const data = await res.json()
      const allBooks = data.books || data || []
      
      const filtered = allBooks.filter(b => b.id !== book.value?.id)
      const shuffled = filtered.sort(() => Math.random() - 0.5)
      
      relatedBooks.value = shuffled.slice(0, 4).map(b => ({
        id: b.id,
        title: b.judul || b.title || '',
        author: b.pembuat || b.author || '',
        year: b.tahun_rilis || '',
        cover: b.cover || b.sampul || ''
      }))
    }
  } catch (err) {
    console.error('Failed to fetch related books:', err)
  } finally {
    isLoadingRelated.value = false
  }
}

// ===== BORROW FUNCTIONS =====
const openBorrowModal = () => {
  if (!currentUser.value) {
    showAlert('error', 'Silakan login terlebih dahulu untuk meminjam buku')
    return
  }

  const isMember = checkMembershipStatus(currentUser.value)

  if (!isMember.isActive) {
    showMemberModal.value = true
    return
  }

  // Check data completeness
  const dataStatus = checkUserDataCompleteness(currentUser.value)
  userDataStatus.value = dataStatus

  if (book.value?.availability?.length > 0) {
    const available = book.value.availability
      .filter(item => item.status === 'Tersedia')
      .sort((a, b) => a.code.localeCompare(b.code))
    
    if (available.length > 0) {
      selectedBook.value = available[0]
      showModal.value = true
    } else {
      showAlert('error', 'Maaf, tidak ada buku yang tersedia saat ini.')
    }
  } else {
    showAlert('error', 'Informasi ketersediaan buku tidak tersedia.')
  }
}

const confirmBorrow = async () => {
  if (!selectedBook.value || !currentUser.value) return

  try {
    const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:5000'
    const token = localStorage.getItem('token')

    const borrowData = {
      id_buku: book.value.id,
      tanggal_pinjam: new Date().toISOString().split('T')[0],
      status: 'Dipinjam'
    }

    const res = await fetch(`${apiBase}/api/peminjaman`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(borrowData)
    })

    const result = await res.json()

    if (res.ok) {
      showModal.value = false
      showConfirmation.value = true
      selectedBook.value = null
      await fetchBookDetails(book.value.id)
      showAlert('success', result.message || 'Peminjaman berhasil diajukan!')
    } else {
      showAlert('error', result.message || 'Gagal mengajukan peminjaman')
    }
  } catch (err) {
    console.error('Error confirming borrow:', err)
    showAlert('error', 'Terjadi kesalahan saat memproses peminjaman.')
  }
}

// ===== MODAL & NAVIGATION =====
const closeModal = () => {
  showModal.value = false
  selectedBook.value = null
}

const closeConfirmation = () => {
  showConfirmation.value = false
  selectedBook.value = null
}

const closeMemberModal = () => {
  showMemberModal.value = false
}

const goBack = () => {
  router.push('/')
}

const goToBook = (id) => {
  router.push(`/buku/${id}`)
  window.scrollTo({ top: 0, behavior: 'smooth' })
  
  isLoading.value = true
  isLoadingRelated.value = true
  fetchBookDetails(id).then(() => {
    if (book.value) {
      fetchRelatedBooks()
    }
  })
}

const copyLink = () => {
  const url = window.location.href
  navigator.clipboard.writeText(url).then(() => {
    isLinkCopied.value = true
    showAlert('success', 'Link berhasil disalin ke clipboard!')
    
    setTimeout(() => {
      isLinkCopied.value = false
    }, 3000)
  }).catch(() => {
    showAlert('error', 'Gagal menyalin link')
  })
}

// ===== ALERT =====
const alert = reactive({
  show: false,
  type: 'success',
  message: ''
})

const showAlert = (type, message) => {
  alert.type = type
  alert.message = message
  alert.show = true
  
  setTimeout(() => {
    alert.show = false
  }, 4000)
}

// ===== COMPONENT LIFECYCLE =====
onMounted(async () => {
  await fetchCurrentUser()
  
  const id = route.params.id
  if (id) {
    await fetchBookDetails(id)
    if (book.value) {
      await fetchRelatedBooks()
    }
  } else {
    isLoading.value = false
  }
})
</script>

<style scoped>
@keyframes modalSlideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.slide-fade-leave-active {
  transition: all 0.3s ease-out;
}

.slide-fade-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>