<template>
  <div class="p-5 max-w-[1400px] mx-auto bg-gray-50 min-h-screen">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-800 mb-1">Manajemen Peminjaman Buku</h1>
      <p class="text-gray-500 text-sm">Kelola status peminjaman buku perpustakaan</p>
    </div>
    
    <!-- Modal Alert -->
<div v-if="alert.show" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click="closeAlert">
  <div @click.stop class="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 animate-slide-up">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <span v-html="getAlertIcon()" class="text-xl"></span>
        <h3 class="font-semibold text-lg">{{ alert.title }}</h3>
      </div>
      <button @click="closeAlert" class="text-gray-500 hover:text-gray-800 font-bold text-lg">✕</button>
    </div>
    <p class="text-gray-700 mb-4">{{ alert.message }}</p>
    <div class="flex justify-end gap-2">
      <button v-if="alert.type==='confirm'" @click="closeAlert" class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Batal</button>
      <button @click="handleAlertConfirm" :class="{
        'bg-blue-500 text-white hover:bg-blue-600': alert.type==='alert',
        'bg-green-500 text-white hover:bg-green-600': alert.type==='success',
        'bg-red-500 text-white hover:bg-red-600': alert.type==='error',
        'bg-yellow-500 text-white hover:bg-yellow-600': alert.type==='confirm'
      }" class="px-4 py-2 rounded">
        {{ alert.confirmText || 'OK' }}
      </button>
    </div>
  </div>
</div>

<!-- Modal Pengembalian -->
<div v-if="showReturnModalFlag" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
  <div class="bg-white rounded-lg p-6 w-full max-w-md relative shadow-lg animate-slide-up">
    <h2 class="text-xl font-bold mb-4">Konfirmasi Pengembalian</h2>
    <button @click="closeModal" class="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-lg font-bold">✕</button>

    <div class="grid gap-4 text-sm text-gray-700">
      <div>
        <label class="font-semibold">Buku:</label>
        <p>{{ selectedItem.judul_buku }}</p>
      </div>
      <div>
        <label class="font-semibold">Tanggal Dikembalikan:</label>
        <input type="date" v-model="returnDate" class="border px-3 py-2 rounded w-full"/>
      </div>
      <div>
        <label class="font-semibold">Keterlambatan (hari):</label>
        <p>{{ lateDays }}</p>
      </div>
      <div>
        <label class="font-semibold">Denda:</label>
        <p>Rp {{ calculateDenda().toLocaleString('id-ID') }}</p>
      </div>
      <div>
        <label class="font-semibold">Keterangan:</label>
        <input type="text" v-model="keterangan" placeholder="Opsional" class="border px-3 py-2 rounded w-full"/>
      </div>
    </div>

    <div class="mt-6 flex justify-end gap-2">
      <button @click="closeModal" class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Batal</button>
      <button @click="confirmReturn" class="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">Konfirmasi</button>
    </div>
  </div>
</div>

<!-- Modal Pengembalian -->
<div v-if="showReturnModalFlag" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
  <div class="bg-white rounded-lg p-6 w-full max-w-md relative shadow-lg animate-slide-up">
    <h2 class="text-xl font-bold mb-4">Konfirmasi Pengembalian</h2>
    <button @click="closeModal" class="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-lg font-bold">✕</button>

    <div class="grid gap-4 text-sm text-gray-700">
      <div>
        <label class="font-semibold">Buku:</label>
        <p>{{ selectedItem.judul_buku }}</p>
      </div>
      <div>
        <label class="font-semibold">Tanggal Dikembalikan:</label>
        <input type="date" v-model="returnDate" class="border px-3 py-2 rounded w-full"/>
      </div>
      <div>
        <label class="font-semibold">Keterlambatan (hari):</label>
        <p>{{ lateDays }}</p>
      </div>
      <div>
        <label class="font-semibold">Denda:</label>
        <p>Rp {{ calculateDenda().toLocaleString('id-ID') }}</p>
      </div>
      <div>
        <label class="font-semibold">Keterangan:</label>
        <input type="text" v-model="keterangan" placeholder="Opsional" class="border px-3 py-2 rounded w-full"/>
      </div>
    </div>

    <div class="mt-6 flex justify-end gap-2">
      <button @click="closeModal" class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Batal</button>
      <button @click="confirmReturn" class="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">Konfirmasi</button>
    </div>
  </div>
</div>


    <!-- Filter & Cek Terlambat -->
    <div class="flex flex-wrap items-center gap-4 bg-white p-5 rounded-lg shadow mb-6">
      <label class="font-semibold text-gray-700">Filter Status:</label>
      <select v-model="filterStatus" @change="filterPeminjaman" class="border rounded px-3 py-2 text-sm">
        <option value="all">Semua Status</option>
        <option value="Pending">Pending</option>
        <option value="Approved">Approved</option>
        <option value="Dipinjam">Dipinjam</option>
        <option value="Dikembalikan">Dikembalikan</option>
        <option value="Terlambat">Terlambat</option>
      </select>
      <button @click="manualCheckLateStatus" class="bg-yellow-400 text-gray-900 px-4 py-2 rounded hover:bg-yellow-500">🔄 Cek Status Terlambat</button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="bg-white rounded-lg shadow p-10 text-center">
      <div class="w-10 h-10 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin mx-auto mb-4"></div>
      <p class="text-gray-500 text-sm">Memuat data...</p>
    </div>

    <!--Detail Peminjaman-->
    <div v-if="showDetailModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg p-6 w-full max-w-lg relative shadow-lg animate-slide-up">
        <h2 class="text-xl font-bold mb-4">Detail Peminjaman</h2>
        <button @click="closeModal" class="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-lg font-bold">✕</button>

        <div class="grid grid-cols-2 gap-4 text-sm text-gray-700">
        <div class="font-semibold">Nama Anggota</div>
        <div>: {{ selectedItem.nama_anggota }}</div>

        <div class="font-semibold">Judul Buku</div>
        <div>: {{ selectedItem.judul_buku }}</div>

        <div class="font-semibold">Kode Buku</div>
        <div>: {{ selectedItem.kode_buku }}</div>

        <div class="font-semibold">Tanggal Pinjam</div>
        <div>: {{ formatDate(selectedItem.tanggal_pinjam) }}</div>

        <div class="font-semibold">Tenggat Pengembalian</div>
        <div>: {{ formatDate(selectedItem.tanggal_kembali) }}</div>

        <div class="font-semibold">Tanggal Dikembalikan</div>
        <div>: {{ selectedItem.tanggal_dikembalikan ? formatDate(selectedItem.tanggal_dikembalikan) : '-' }}</div>

        <div class="font-semibold">Status</div>
        <div>: {{ selectedItem.status }}</div>

        <div class="font-semibold" v-if="selectedItem.keterangan">Keterangan:</div>
        <div v-if="selectedItem.keterangan">{{ selectedItem.keterangan }}</div>
        </div>

        <div class="mt-6 text-right">
        <button @click="closeModal" class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Tutup</button>
        </div>
    </div>
    </div>



    <!-- Table Peminjaman -->
    <div v-else class="bg-white rounded-lg shadow overflow-x-auto">
      <table class="w-full border-collapse min-w-[900px]">
        <thead class="bg-gray-800 text-white">
          <tr>
            <th class="p-4 text-left text-sm font-semibold">ID</th>
            <th class="p-4 text-left text-sm font-semibold">Nama Anggota</th>
            <th class="p-4 text-left text-sm font-semibold">Judul Buku</th>
            <th class="p-4 text-left text-sm font-semibold">Kode Buku</th>
            <th class="p-4 text-left text-sm font-semibold">Tanggal Pinjam</th>
            <th class="p-4 text-left text-sm font-semibold">Tenggat Pengembalian</th>
            <th class="p-4 text-left text-sm font-semibold">Tanggal Dikembalikan</th>
            <th class="p-4 text-left text-sm font-semibold">Status</th>
            <th class="p-4 text-left text-sm font-semibold">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filteredPeminjaman" :key="item.id_peminjaman" class="hover:bg-gray-100">
            <td class="p-4 text-sm">{{ item.id_peminjaman }}</td>
            <td class="p-4 text-sm">{{ item.nama_anggota }}</td>
            <td class="p-4 text-sm">{{ item.judul_buku }}</td>
            <td class="p-4 text-sm">{{ item.kode_buku }}</td>
            <td class="p-4 text-sm">{{ formatDate(item.tanggal_pinjam) }}</td>
            <td class="p-4 text-sm">{{ formatDate(item.tanggal_kembali) }}</td>
            <td class="p-4 text-sm">{{ item.tanggal_dikembalikan ? formatDate(item.tanggal_dikembalikan) : '-' }}</td>
            <td class="p-4">
              <span :class="['px-3 py-1 rounded-full text-xs font-semibold', getStatusClass(item.status)]">{{ item.status }}</span>
            </td>
            <td class="p-4">
              <div class="flex flex-wrap gap-2">
                <button v-if="item.status==='Pending'" @click="updateStatus(item, 'Approved')" class="bg-green-200 text-green-800 p-2 rounded hover:scale-110 transform transition">✓</button>
                <button v-if="item.status==='Pending'" @click="confirmReject(item)" class="bg-red-200 text-red-800 p-2 rounded hover:scale-110 transform transition">✕</button>
                <button v-if="item.status==='Approved'" @click="updateStatus(item, 'Dipinjam')" class="bg-blue-200 text-blue-800 p-2 rounded hover:scale-110 transform transition">📤</button>
                <button v-if="item.status==='Dipinjam'||item.status==='Terlambat'" @click="showReturnModal(item)" class="bg-purple-200 text-purple-800 p-2 rounded hover:scale-110 transform transition">📥</button>
                <button @click="showDetail(item)" class="bg-yellow-200 text-yellow-800 p-2 rounded hover:scale-110 transform transition">ℹ️</button>
              </div>
            </td>
          </tr>
          <tr v-if="filteredPeminjaman.length===0">
            <td colspan="9" class="text-center text-gray-500 py-4">Tidak ada data peminjaman</td>
          </tr>
        </tbody>
      </table>
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
    getAlertIcon(){ return {'alert':'ℹ️','success':'✓','error':'✕','confirm':'❓'}[this.alert.type] || 'ℹ️'; },
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

    filterPeminjaman(){ this.filteredPeminjaman=this.filterStatus==='all'? [...this.peminjaman] : this.peminjaman.filter(i=>i.status===this.filterStatus); },

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
    getStatusClass(status){ return {Pending:'status-pending',Approved:'status-approved',Dipinjam:'status-dipinjam',Dikembalikan:'status-dikembalikan',Terlambat:'status-terlambat'}[status]||''; }
  }
}
</script>

<style>
@keyframes slide-up { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
.animate-slide-up { animation: slide-up 0.3s ease forwards; }
</style>
