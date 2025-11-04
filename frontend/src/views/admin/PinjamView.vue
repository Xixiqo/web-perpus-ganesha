<template>
  <div class="p-5 max-w-[1400px] mx-auto bg-gray-50 min-h-screen">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-800 mb-1">Manajemen Peminjaman Buku</h1>
      <p class="text-gray-500 text-sm">Kelola status peminjaman buku perpustakaan</p>
    </div>
    
    <!-- Modal Alert -->
    <div v-if="alert.show" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click="closeAlert">
      <div @click.stop class="bg-white rounded-lg shadow-xl max-w-sm w-full p-6 animate-slide-up">
        <div class="flex items-start gap-3 mb-4">
          <div :class="[
            'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
            alert.type === 'success' ? 'bg-green-100' : '',
            alert.type === 'error' ? 'bg-red-100' : '',
            alert.type === 'confirm' ? 'bg-yellow-100' : '',
            alert.type === 'alert' ? 'bg-blue-100' : ''
          ]">
            <svg v-if="alert.type === 'success'" class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <svg v-else-if="alert.type === 'error'" class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <svg v-else-if="alert.type === 'confirm'" class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <svg v-else class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="font-semibold text-lg text-gray-900">{{ alert.title }}</h3>
            <p class="text-gray-600 text-sm mt-1">{{ alert.message }}</p>
          </div>
          <button @click="closeAlert" class="text-gray-400 hover:text-gray-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="flex justify-end gap-2 mt-6">
          <button v-if="alert.type==='confirm'" @click="closeAlert" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-sm">
            Batal
          </button>
          <button @click="handleAlertConfirm" :class="{
            'bg-blue-500 hover:bg-blue-600': alert.type==='alert',
            'bg-green-500 hover:bg-green-600': alert.type==='success',
            'bg-red-500 hover:bg-red-600': alert.type==='error',
            'bg-yellow-500 hover:bg-yellow-600': alert.type==='confirm'
          }" class="px-4 py-2 rounded-lg text-white transition font-medium text-sm">
            {{ alert.confirmText || 'OK' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Pengembalian -->
    <div v-if="showReturnModalFlag" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg p-6 w-full max-w-md shadow-xl animate-slide-up">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-800">Konfirmasi Pengembalian</h2>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="space-y-4">
          <div class="bg-gray-50 p-4 rounded-lg">
            <label class="text-xs font-medium text-gray-500 uppercase">Buku</label>
            <p class="text-sm text-gray-900 font-medium mt-1">{{ selectedItem.judul_buku }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Tanggal Dikembalikan</label>
            <input type="date" v-model="returnDate" class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2C64F9] focus:border-transparent"/>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div class="bg-yellow-50 p-3 rounded-lg">
              <label class="text-xs font-medium text-yellow-700 uppercase">Keterlambatan</label>
              <p class="text-lg font-bold text-yellow-900 mt-1">{{ lateDays }} Hari</p>
            </div>
            <div class="bg-red-50 p-3 rounded-lg">
              <label class="text-xs font-medium text-red-700 uppercase">Denda</label>
              <p class="text-lg font-bold text-red-900 mt-1">Rp {{ calculateDenda().toLocaleString('id-ID') }}</p>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Keterangan (Opsional)</label>
            <input type="text" v-model="keterangan" placeholder="Tambahkan catatan..." class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2C64F9] focus:border-transparent"/>
          </div>
        </div>

        <div class="mt-6 flex justify-end gap-3">
          <button @click="closeModal" class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium text-sm">
            Batal
          </button>
          <button @click="confirmReturn" class="px-4 py-2 bg-[#2C64F9] text-white rounded-lg hover:bg-[#1e4fd6] transition font-medium text-sm">
            Konfirmasi Pengembalian
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Detail -->
    <div v-if="showDetailModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg p-6 w-full max-w-lg shadow-xl animate-slide-up">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-800">Detail Peminjaman</h2>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="space-y-3">
          <div class="grid grid-cols-[140px_1fr] gap-2 text-sm">
            <span class="font-medium text-gray-600">Nama Anggota</span>
            <span class="text-gray-900">{{ selectedItem.nama_anggota }}</span>
          </div>
          <div class="grid grid-cols-[140px_1fr] gap-2 text-sm">
            <span class="font-medium text-gray-600">Judul Buku</span>
            <span class="text-gray-900">{{ selectedItem.judul_buku }}</span>
          </div>
          <div class="grid grid-cols-[140px_1fr] gap-2 text-sm">
            <span class="font-medium text-gray-600">Kode Buku</span>
            <span class="text-gray-900">{{ selectedItem.kode_buku }}</span>
          </div>
          <div class="grid grid-cols-[140px_1fr] gap-2 text-sm">
            <span class="font-medium text-gray-600">Tanggal Pinjam</span>
            <span class="text-gray-900">{{ formatDate(selectedItem.tanggal_pinjam) }}</span>
          </div>
          <div class="grid grid-cols-[140px_1fr] gap-2 text-sm">
            <span class="font-medium text-gray-600">Tenggat Kembali</span>
            <span class="text-gray-900">{{ formatDate(selectedItem.tanggal_kembali) }}</span>
          </div>
          <div class="grid grid-cols-[140px_1fr] gap-2 text-sm">
            <span class="font-medium text-gray-600">Tanggal Dikembalikan</span>
            <span class="text-gray-900">{{ selectedItem.tanggal_dikembalikan ? formatDate(selectedItem.tanggal_dikembalikan) : '-' }}</span>
          </div>
          <div class="grid grid-cols-[140px_1fr] gap-2 text-sm items-center">
            <span class="font-medium text-gray-600">Status</span>
            <span :class="['px-3 py-1 rounded-full text-xs font-semibold inline-block w-fit', getStatusClass(selectedItem.status, selectedItem.tanggal_dikembalikan, selectedItem.tanggal_kembali)]">
              {{ getStatusText(selectedItem.status, selectedItem.tanggal_dikembalikan, selectedItem.tanggal_kembali) }}
            </span>
          </div>
          <div v-if="selectedItem.denda && selectedItem.denda > 0" class="grid grid-cols-[140px_1fr] gap-2 text-sm">
            <span class="font-medium text-gray-600">Denda</span>
            <span class="text-red-600 font-semibold">Rp {{ selectedItem.denda.toLocaleString('id-ID') }}</span>
          </div>
          <div v-if="selectedItem.keterangan" class="grid grid-cols-[140px_1fr] gap-2 text-sm">
            <span class="font-medium text-gray-600">Keterangan</span>
            <span class="text-gray-900">{{ selectedItem.keterangan }}</span>
          </div>
        </div>

        <div class="mt-6 text-right">
          <button @click="closeModal" class="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition font-medium text-sm">
            Tutup
          </button>
        </div>
      </div>
    </div>

    <!-- Filter & Cek Terlambat -->
    <div class="flex flex-wrap items-center gap-4 bg-white p-5 rounded-lg shadow mb-6">
      <label class="font-semibold text-gray-700 text-sm">Filter Status:</label>
      <select v-model="filterStatus" @change="filterPeminjaman" class="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2C64F9] focus:border-transparent">
        <option value="all">Semua Status</option>
        <option value="Pending">Pending</option>
        <option value="Approved">Approved</option>
        <option value="Dipinjam">Dipinjam</option>
        <option value="Dikembalikan">Dikembalikan</option>
        <option value="Dikembalikan-Terlambat">Dikembalikan (Terlambat)</option>
      </select>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="bg-white rounded-lg shadow p-10 text-center">
      <div class="w-10 h-10 border-4 border-gray-300 border-t-[#2C64F9] rounded-full animate-spin mx-auto mb-4"></div>
      <p class="text-gray-500 text-sm">Memuat data...</p>
    </div>

    <!-- Table Peminjaman -->
    <div v-else class="bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full border-collapse min-w-[900px]">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Anggota</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul Buku</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kode Buku</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Pinjam</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tenggat Kembali</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dikembalikan</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Denda</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="item in filteredPeminjaman" :key="item.id_peminjaman" class="hover:bg-gray-50 transition">
              <td class="px-4 py-4 text-sm text-gray-900">{{ item.id_peminjaman }}</td>
              <td class="px-4 py-4 text-sm text-gray-900 font-medium">{{ item.nama_anggota }}</td>
              <td class="px-4 py-4 text-sm text-gray-900">{{ item.judul_buku }}</td>
              <td class="px-4 py-4 text-sm text-gray-600">{{ item.kode_buku }}</td>
              <td class="px-4 py-4 text-sm text-gray-600">{{ formatDate(item.tanggal_pinjam) }}</td>
              <td class="px-4 py-4 text-sm text-gray-600">{{ formatDate(item.tanggal_kembali) }}</td>
              <td class="px-4 py-4 text-sm text-gray-600">{{ item.tanggal_dikembalikan ? formatDate(item.tanggal_dikembalikan) : '-' }}</td>
              <td class="px-4 py-4">
                <span :class="['px-3 py-1 rounded-full text-xs font-semibold', getStatusClass(item.status, item.tanggal_dikembalikan, item.tanggal_kembali)]">
                  {{ getStatusText(item.status, item.tanggal_dikembalikan, item.tanggal_kembali) }}
                </span>
              </td>
              <td class="px-4 py-4 text-sm">
                <span v-if="item.denda && item.denda > 0" class="text-red-600 font-semibold">
                  Rp {{ item.denda.toLocaleString('id-ID') }}
                </span>
                <span v-else class="text-gray-400">-</span>
              </td>
              <td class="px-4 py-4">
                <div class="flex items-center gap-2">
                  <!-- Approve (Pending -> Approved) -->
                  <button 
                    v-if="item.status==='Pending'" 
                    @click="updateStatus(item, 'Approved')" 
                    class="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition group relative"
                    title="Setujui Peminjaman"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </button>
                  
                  <!-- Reject (Pending) -->
                  <button 
                    v-if="item.status==='Pending'" 
                    @click="confirmReject(item)" 
                    class="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition group relative"
                    title="Tolak Peminjaman"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  
                  <!-- Pinjamkan Buku (Approved -> Dipinjam) -->
                  <button 
                    v-if="item.status==='Approved'" 
                    @click="updateStatus(item, 'Dipinjam')" 
                    class="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition group relative"
                    title="Pinjamkan Buku"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                  
                  <!-- Kembalikan Buku (Dipinjam/Terlambat -> Dikembalikan) -->
                  <button 
                    v-if="item.status==='Dipinjam'||item.status==='Terlambat'" 
                    @click="showReturnModal(item)" 
                    class="p-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition group relative"
                    title="Proses Pengembalian"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                    </svg>
                  </button>
                  
                  <!-- Detail -->
                  <button 
                    @click="showDetail(item)" 
                    class="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition group relative"
                    title="Lihat Detail"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredPeminjaman.length===0">
              <td colspan="10" class="text-center text-gray-500 py-12">
                <svg class="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p class="text-sm font-medium">Tidak ada data peminjaman</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PeminjamanAdmin',
  data() {
    return {
      peminjaman: [],
      filteredPeminjaman: [],
      filterStatus: 'all',
      showDetailModal: false,
      showReturnModalFlag: false,
      selectedItem: null,
      returnDate: new Date().toISOString().split('T')[0],
      keterangan: '',
      lateDays: 0,
      loading: false,
      pendingCallback: null,
      alert: { show:false, type:'alert', title:'', message:'', confirmText:'OK' },
      autoCheckDone: false,
      apiBase: import.meta.env.VITE_API_BASE || 'http://localhost:5000'
    }
  },
  mounted() {
    this.loadPeminjaman();
  },
  watch: {
    returnDate() { if(this.selectedItem) this.calculateLateDaysForReturn(); },
    selectedItem() { if(this.showReturnModalFlag) this.calculateLateDaysForReturn(); }
  },
  methods: {
    getAuthHeaders() { const token = localStorage.getItem('token'); return { 'Authorization':`Bearer ${token}`, 'Content-Type':'application/json' }; },
    handleUnauthorized(response) { if([401,403].includes(response.status)) { console.error('⚠️ Unauthorized'); localStorage.removeItem('token'); window.location.reload(); } },
    showAlert(title,message,type='alert'){ this.alert={show:true,type,title,message,confirmText:'OK'} },
    showSuccess(t,m){ this.showAlert(t,m,'success') },
    showError(t,m){ this.showAlert(t,m,'error') },
    showConfirm(t,m,cb){ this.pendingCallback=cb; this.alert={show:true,type:'confirm',title:t,message:m,confirmText:'Lanjutkan'} },
    closeAlert(){ this.alert.show=false; this.pendingCallback=null; },
    handleAlertConfirm(){ if(this.alert.type==='confirm' && this.pendingCallback) this.pendingCallback(); this.closeAlert(); },

    async loadPeminjaman() {
      this.loading=true;
      try{
        const res=await fetch(`${this.apiBase}/api/admin/peminjamann`,{ method:'GET', headers:this.getAuthHeaders() });
        if(!res.ok){ this.handleUnauthorized(res); throw new Error('Gagal memuat data'); }
        this.peminjaman=await res.json();
        this.filteredPeminjaman=[...this.peminjaman];
        if(!this.autoCheckDone){ this.autoCheckDone=true; await this.autoCheckLateStatus(); }
      }catch(e){ console.error(e); this.showError('Error', e.message); }
      finally{ this.loading=false; }
    },

    async autoCheckLateStatus(){ try{ const res=await fetch(`${this.apiBase}/api/admin/peminjamann/check/late`,{method:'GET',headers:this.getAuthHeaders()}); const result=await res.json(); if(res.ok && result.updated>0) await this.loadPeminjamanSilent(); }catch(e){ console.error(e);} },
    async loadPeminjamanSilent(){ try{ const res=await fetch(`${this.apiBase}/api/admin/peminjamann`,{method:'GET',headers:this.getAuthHeaders()}); if(res.ok){ this.peminjaman=await res.json(); this.filterPeminjaman(); }}catch(e){ console.error(e);} },
    async manualCheckLateStatus(){ try{ const res=await fetch(`${this.apiBase}/api/admin/peminjamann/check/late`,{method:'GET',headers:this.getAuthHeaders()}); const result=await res.json(); if(res.ok){ this.showSuccess('Sukses',`Pengecekan berhasil. ${result.updated} data diperbarui.`); await this.loadPeminjamanSilent(); }else{ this.handleUnauthorized(res); throw new Error(result.message||'Gagal'); } }catch(e){ console.error(e); this.showError('Error',e.message); }},

    filterPeminjaman(){ 
      if(this.filterStatus==='all') {
        this.filteredPeminjaman = [...this.peminjaman];
      } else if(this.filterStatus==='Dikembalikan-Terlambat') {
        // Filter untuk buku yang dikembalikan terlambat (ada denda)
        this.filteredPeminjaman = this.peminjaman.filter(i => 
          i.status === 'Dikembalikan' && i.tanggal_dikembalikan && 
          new Date(i.tanggal_dikembalikan) > new Date(i.tanggal_kembali)
        );
      } else if(this.filterStatus==='Terlambat') {
        // Filter untuk buku yang belum dikembalikan dan sudah terlambat
        this.filteredPeminjaman = this.peminjaman.filter(i => i.status === 'Terlambat');
      } else {
        this.filteredPeminjaman = this.peminjaman.filter(i => i.status === this.filterStatus);
      }
    },

    updateStatus(item,newStatus){
      this.showConfirm('Ubah Status',`Apakah yakin ubah status ke ${newStatus}?`,async ()=>{
        try{
          const res=await fetch(`${this.apiBase}/api/admin/peminjamann/${item.id_peminjaman}/status`,{method:'PUT',headers:this.getAuthHeaders(),body:JSON.stringify({status:newStatus})});
          const result=await res.json();
          if(!res.ok){ this.handleUnauthorized(res); throw new Error(result.message||'Gagal'); }
          Object.assign(item,{status:newStatus,...(result.tanggal_kembali?{tanggal_kembali:result.tanggal_kembali}:{})});
          this.showSuccess('Sukses',`Status berhasil diubah menjadi ${newStatus}`);
          this.filterPeminjaman();
        }catch(e){ console.error(e); this.showError('Error',e.message); }
      });
    },

    confirmReject(item){
      this.showConfirm('Tolak Peminjaman','Yakin menolak peminjaman ini?', async ()=>{
        try{
          const res=await fetch(`${this.apiBase}/api/admin/peminjamann/${item.id_peminjaman}`,{method:'DELETE',headers:this.getAuthHeaders()});
          const result=await res.json();
          if(!res.ok){ this.handleUnauthorized(res); throw new Error(result.message||'Gagal'); }
          this.peminjaman=this.peminjaman.filter(p=>p.id_peminjaman!==item.id_peminjaman);
          this.filterPeminjaman();
          this.showSuccess('Sukses','Peminjaman berhasil ditolak');
        }catch(e){ console.error(e); this.showError('Error',e.message);}
      });
    },

    showReturnModal(item){ this.selectedItem=item; this.returnDate=new Date().toISOString().split('T')[0]; this.keterangan=''; this.calculateLateDaysForReturn(); this.showReturnModalFlag=true; },
    calculateLateDaysForReturn(){ if(!this.selectedItem) return; const diff=Math.floor((new Date(this.returnDate)-new Date(this.selectedItem.tanggal_kembali))/(1000*60*60*24)); this.lateDays=diff>0?diff:0; },
    calculateDenda(){ return this.lateDays*1000; },

    async confirmReturn(){
      try{
        const denda=this.calculateDenda();
        const res=await fetch(`${this.apiBase}/api/admin/peminjamann/${this.selectedItem.id_peminjaman}/return`,{method:'PUT',headers:this.getAuthHeaders(),body:JSON.stringify({tanggal_dikembalikan:this.returnDate,denda,keterangan:this.keterangan})});
        const result=await res.json();
        if(!res.ok){ this.handleUnauthorized(res); throw new Error(result.message||'Gagal'); }
        this.selectedItem.status='Dikembalikan';
        this.showSuccess('Sukses',`Buku berhasil dikembalikan${denda>0?` dengan denda Rp ${denda.toLocaleString('id-ID')}`:''}`);
        this.closeModal(); this.filterPeminjaman();
      }catch(e){ console.error(e); this.showError('Error',e.message);}
    },

    showDetail(item){ this.selectedItem=item; this.showDetailModal=true; },
    closeModal(){ this.showDetailModal=false; this.showReturnModalFlag=false; this.selectedItem=null; },

    calculateLateDays(dueDate){ const diff=Math.floor((new Date()-new Date(dueDate))/(1000*60*60*24)); return diff>0?diff:0; },
    formatDate(date){ if(!date) return '-'; return new Date(date).toLocaleDateString('id-ID',{year:'numeric',month:'long',day:'numeric'}); },
    
    // Get status class based on status and late condition
    getStatusClass(status, returnDate, dueDate){ 
      // Jika sudah dikembalikan, cek apakah terlambat
      if(status === 'Dikembalikan' && returnDate && dueDate) {
        const isLate = new Date(returnDate) > new Date(dueDate);
        return isLate ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800';
      }
      
      // Status lainnya
      return {
        'Pending':'bg-yellow-100 text-yellow-800',
        'Approved':'bg-blue-100 text-blue-800',
        'Dipinjam':'bg-purple-100 text-purple-800',
        'Dikembalikan':'bg-green-100 text-green-800',
        'Terlambat':'bg-red-100 text-red-800'
      }[status]||'bg-gray-100 text-gray-800'; 
    },
    
    // Get status text with late indicator
    getStatusText(status, returnDate, dueDate) {
      // Jika sudah dikembalikan, cek apakah terlambat
      if(status === 'Dikembalikan' && returnDate && dueDate) {
        const isLate = new Date(returnDate) > new Date(dueDate);
        return isLate ? 'Terlambat' : 'Dikembalikan';
      }
      
      return status;
    }
  }
}
</script>

<style scoped>
@keyframes slide-up { 
  from { 
    transform: translateY(20px); 
    opacity: 0; 
  } 
  to { 
    transform: translateY(0); 
    opacity: 1; 
  } 
}

.animate-slide-up { 
  animation: slide-up 0.3s ease forwards; 
}
</style>