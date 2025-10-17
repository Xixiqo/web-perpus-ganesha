<template>
    <div class="peminjaman-container">
        <div class="header">
            <h1>Manajemen Peminjaman Buku</h1>
            <p class="subtitle">Kelola status peminjaman buku perpustakaan</p>
        </div>

        <!-- Filter Status -->
        <div class="filter-section">
            <label>Filter Status:</label>
            <select v-model="filterStatus" @change="filterPeminjaman" class="filter-select">
                <option value="all">Semua Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Dipinjam">Dipinjam</option>
                <option value="Dikembalikan">Dikembalikan</option>
                <option value="Terlambat">Terlambat</option>
            </select>
            <button @click="checkLateStatus" class="btn btn-warning" style="margin-left: 10px;">
                Cek Status Terlambat
            </button>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="loading">Memuat data...</div>

        <!-- Tabel Peminjaman -->
        <div v-else class="table-container">
            <table class="peminjaman-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nama Anggota</th>
                        <th>Judul Buku</th>
                        <th>Kode Buku</th>
                        <th>Tanggal Pinjam</th>
                        <th>Tanggal Kembali</th>
                        <th>Status</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in filteredPeminjaman" :key="item.id_peminjaman">
                        <td>{{ item.id_peminjaman }}</td>
                        <td>{{ item.nama_anggota }}</td>
                        <td>{{ item.judul_buku }}</td>
                        <td>{{ item.kode_buku }}</td>
                        <td>{{ formatDate(item.tanggal_pinjam) }}</td>
                        <td>{{ formatDate(item.tanggal_kembali) }}</td>
                        <td>
                            <span :class="['status-badge', getStatusClass(item.status)]">
                                {{ item.status }}
                            </span>
                        </td>
                        <td>
                            <div class="action-buttons">
                                <button 
                                    v-if="item.status === 'Pending'" 
                                    @click="updateStatus(item, 'Approved')"
                                    class="btn btn-success">
                                    Setujui
                                </button>
                                <button 
                                    v-if="item.status === 'Pending'" 
                                    @click="rejectPeminjaman(item)"
                                    class="btn btn-danger">
                                    Tolak
                                </button>
                                <button 
                                    v-if="item.status === 'Approved'" 
                                    @click="updateStatus(item, 'Dipinjam')"
                                    class="btn btn-primary">
                                    Dipinjam
                                </button>
                                <button 
                                    v-if="item.status === 'Dipinjam' || item.status === 'Terlambat'" 
                                    @click="showReturnModal(item)"
                                    class="btn btn-info">
                                    Kembalikan
                                </button>
                                <button 
                                    @click="showDetail(item)"
                                    class="btn btn-secondary">
                                    Detail
                                </button>
                            </div>
                        </td>
                    </tr>
                    <tr v-if="filteredPeminjaman.length === 0">
                        <td colspan="8" class="text-center">Tidak ada data peminjaman</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Modal Detail -->
        <div v-if="showDetailModal" class="modal-overlay" @click.self="closeModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Detail Peminjaman</h2>
                    <button @click="closeModal" class="close-btn">&times;</button>
                </div>
                <div class="modal-body" v-if="selectedItem">
                    <div class="detail-row">
                        <span class="detail-label">ID Peminjaman:</span>
                        <span>{{ selectedItem.id_peminjaman }}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Nama Anggota:</span>
                        <span>{{ selectedItem.nama_anggota }}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Username:</span>
                        <span>{{ selectedItem.username }}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">NIS/NIP:</span>
                        <span>{{ selectedItem.nis_nip }}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">No. Telp:</span>
                        <span>{{ selectedItem.no_telp }}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Judul Buku:</span>
                        <span>{{ selectedItem.judul_buku }}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Kode Buku:</span>
                        <span>{{ selectedItem.kode_buku }}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Penerbit:</span>
                        <span>{{ selectedItem.penerbit }}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Tanggal Pinjam:</span>
                        <span>{{ formatDate(selectedItem.tanggal_pinjam) }}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Tanggal Kembali:</span>
                        <span>{{ formatDate(selectedItem.tanggal_kembali) }}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Status:</span>
                        <span :class="['status-badge', getStatusClass(selectedItem.status)]">
                            {{ selectedItem.status }}
                        </span>
                    </div>
                    <div class="detail-row" v-if="selectedItem.status === 'Terlambat'">
                        <span class="detail-label">Hari Terlambat:</span>
                        <span class="text-danger">{{ calculateLateDays(selectedItem.tanggal_kembali) }} hari</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Pengembalian -->
        <div v-if="showReturnModalFlag" class="modal-overlay" @click.self="closeModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Pengembalian Buku</h2>
                    <button @click="closeModal" class="close-btn">&times;</button>
                </div>
                <div class="modal-body" v-if="selectedItem">
                    <div class="detail-row">
                        <span class="detail-label">Judul Buku:</span>
                        <span>{{ selectedItem.judul_buku }}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Nama Anggota:</span>
                        <span>{{ selectedItem.nama_anggota }}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Tanggal Harus Kembali:</span>
                        <span>{{ formatDate(selectedItem.tanggal_kembali) }}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Tanggal Dikembalikan:</span>
                        <input type="date" v-model="returnDate" class="form-input">
                    </div>
                    <div class="detail-row" v-if="lateDays > 0">
                        <span class="detail-label">Hari Terlambat:</span>
                        <span class="text-danger">{{ lateDays }} hari</span>
                    </div>
                    <div class="detail-row" v-if="lateDays > 0">
                        <span class="detail-label">Denda (Rp 1.000/hari):</span>
                        <span class="text-danger">Rp {{ calculateDenda().toLocaleString('id-ID') }}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Keterangan:</span>
                        <textarea v-model="keterangan" class="form-textarea" rows="3" placeholder="Kondisi buku, catatan, dll..."></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button @click="closeModal" class="btn btn-secondary">Batal</button>
                    <button @click="confirmReturn" class="btn btn-success">Konfirmasi Pengembalian</button>
                </div>
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
            loading: false
        }
    },
    mounted() {
        this.loadPeminjaman();
        this.checkLateStatus(); // Auto check setiap refresh
    },
    methods: {
        async loadPeminjaman() {
            this.loading = true;
            try {
                const response = await fetch('http://localhost:5000/api/admin/peminjamann');
                if (!response.ok) throw new Error('Gagal memuat data peminjaman');
                
                this.peminjaman = await response.json();
                this.filteredPeminjaman = [...this.peminjaman];
                console.log('✅ Data peminjaman dimuat:', this.peminjaman.length);
            } catch (error) {
                console.error('Error loading peminjaman:', error);
                alert('Gagal memuat data peminjaman: ' + error.message);
            } finally {
                this.loading = false;
            }
        },

        filterPeminjaman() {
            if (this.filterStatus === 'all') {
                this.filteredPeminjaman = [...this.peminjaman];
            } else {
                this.filteredPeminjaman = this.peminjaman.filter(
                    item => item.status === this.filterStatus
                );
            }
        },

        async updateStatus(item, newStatus) {
            if (!confirm(`Apakah Anda yakin ingin mengubah status menjadi ${newStatus}?`)) return;

            try {
                const response = await fetch(`http://localhost:5000/api/admin/peminjamann/${item.id_peminjaman}/status`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: newStatus })
                });

                const result = await response.json();
                if (!response.ok) throw new Error(result.message || 'Gagal mengubah status');

                item.status = newStatus;
                alert(`Status berhasil diubah menjadi ${newStatus}`);
                this.filterPeminjaman();
            } catch (error) {
                console.error('Error updating status:', error);
                alert('Gagal mengubah status: ' + error.message);
            }
        },

        async rejectPeminjaman(item) {
            if (!confirm('Apakah Anda yakin ingin menolak peminjaman ini?')) return;
            try {
                const response = await fetch(`http://localhost:5000/api/admin/peminjamann/${item.id_peminjaman}`, {
                    method: 'DELETE'
                });

                const result = await response.json();
                if (!response.ok) throw new Error(result.message || 'Gagal menolak peminjaman');

                this.peminjaman = this.peminjaman.filter(p => p.id_peminjaman !== item.id_peminjaman);
                this.filterPeminjaman();
                alert('Peminjaman berhasil ditolak');
            } catch (error) {
                console.error('Error rejecting peminjaman:', error);
                alert('Gagal menolak peminjaman: ' + error.message);
            }
        },

        showReturnModal(item) {
            this.selectedItem = item;
            this.returnDate = new Date().toISOString().split('T')[0];
            this.keterangan = '';
            this.calculateLateDaysForReturn();
            this.showReturnModalFlag = true;
        },

        calculateLateDaysForReturn() {
            const returnDateObj = new Date(this.returnDate);
            const dueDate = new Date(this.selectedItem.tanggal_kembali);
            const diffTime = returnDateObj - dueDate;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            this.lateDays = diffDays > 0 ? diffDays : 0;
        },

        calculateDenda() {
            return this.lateDays * 1000;
        },

        async confirmReturn() {
            try {
                const denda = this.calculateDenda();

                const response = await fetch(`http://localhost:5000/api/admin/peminjamann/${this.selectedItem.id_peminjaman}/return`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        tanggal_dikembalikan: this.returnDate,
                        denda: denda,
                        keterangan: this.keterangan
                    })
                });

                const result = await response.json();
                if (!response.ok) throw new Error(result.message || 'Gagal memproses pengembalian');

                this.selectedItem.status = 'Dikembalikan';
                alert(`Buku berhasil dikembalikan${denda > 0 ? ` dengan denda Rp ${denda.toLocaleString('id-ID')}` : ''}`);
                this.closeModal();
                this.filterPeminjaman();
            } catch (error) {
                console.error('Error returning book:', error);
                alert('Gagal memproses pengembalian: ' + error.message);
            }
        },

        showDetail(item) {
            this.selectedItem = item;
            this.showDetailModal = true;
        },

        closeModal() {
            this.showDetailModal = false;
            this.showReturnModalFlag = false;
            this.selectedItem = null;
        },

        async checkLateStatus() {
            try {
                const response = await fetch('http://localhost:5000/api/admin/peminjamann/check/late');
                const result = await response.json();

                if (response.ok) {
                    alert(`Pengecekan status terlambat berhasil. ${result.updated} data diperbarui.`);
                    await this.loadPeminjaman();
                } else {
                    throw new Error(result.message || 'Gagal mengecek status terlambat');
                }
            } catch (error) {
                console.error('Error checking late status:', error);
                alert('Gagal mengecek status terlambat: ' + error.message);
            }
        },

        calculateLateDays(dueDate) {
            const today = new Date();
            const due = new Date(dueDate);
            const diffTime = today - due;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays > 0 ? diffDays : 0;
        },

        formatDate(date) {
            if (!date) return '-';
            const d = new Date(date);
            return d.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
        },

        getStatusClass(status) {
            const map = {
                Pending: 'status-pending',
                Approved: 'status-approved',
                Dipinjam: 'status-dipinjam',
                Dikembalikan: 'status-dikembalikan',
                Terlambat: 'status-terlambat'
            };
            return map[status] || '';
        }
    },
    watch: {
        returnDate() {
            if (this.selectedItem) this.calculateLateDaysForReturn();
        }
    }
}
</script>

<style scoped>
.peminjaman-container {
    padding: 20px;
    max-width: 1400px;
    margin: 0 auto;
    background-color: #f8f9fa;
    min-height: 100vh;
}

.header {
    margin-bottom: 30px;
}

.header h1 {
    color: #2c3e50;
    margin-bottom: 5px;
}

.subtitle {
    color: #7f8c8d;
    font-size: 14px;
}

.filter-section {
    background: white;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    display: flex;
    align-items: center;
}

.filter-section label {
    font-weight: 600;
    margin-right: 10px;
    color: #2c3e50;
}

.filter-select {
    padding: 8px 15px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
}

.loading {
    text-align: center;
    padding: 40px;
    color: #7f8c8d;
    font-size: 16px;
}

.table-container {
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.peminjaman-table {
    width: 100%;
    border-collapse: collapse;
}

.peminjaman-table thead {
    background-color: #34495e;
    color: white;
}

.peminjaman-table th {
    padding: 15px;
    text-align: left;
    font-weight: 600;
    font-size: 14px;
}

.peminjaman-table td {
    padding: 15px;
    border-bottom: 1px solid #ecf0f1;
    font-size: 14px;
}

.peminjaman-table tbody tr:hover {
    background-color: #f8f9fa;
}

.status-badge {
    padding: 5px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    display: inline-block;
}

.status-pending {
    background-color: #fff3cd;
    color: #856404;
}

.status-approved {
    background-color: #d1ecf1;
    color: #0c5460;
}

.status-dipinjam {
    background-color: #cce5ff;
    color: #004085;
}

.status-dikembalikan {
    background-color: #d4edda;
    color: #155724;
}

.status-terlambat {
    background-color: #f8d7da;
    color: #721c24;
}

.action-buttons {
    display: flex;
    gap: 5px;
    flex-wrap: wrap;
}

.btn {
    padding: 6px 12px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 600;
    transition: all 0.3s;
}

.btn-success {
    background-color: #28a745;
    color: white;
}

.btn-success:hover {
    background-color: #218838;
}

.btn-danger {
    background-color: #dc3545;
    color: white;
}

.btn-danger:hover {
    background-color: #c82333;
}

.btn-primary {
    background-color: #007bff;
    color: white;
}

.btn-primary:hover {
    background-color: #0056b3;
}

.btn-info {
    background-color: #17a2b8;
    color: white;
}

.btn-info:hover {
    background-color: #138496;
}

.btn-secondary {
    background-color: #6c757d;
    color: white;
}

.btn-secondary:hover {
    background-color: #5a6268;
}

.btn-warning {
    background-color: #ffc107;
    color: #212529;
}

.btn-warning:hover {
    background-color: #e0a800;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-content {
    background: white;
    border-radius: 8px;
    width: 90%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.modal-header {
    padding: 20px;
    border-bottom: 1px solid #ecf0f1;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-header h2 {
    margin: 0;
    color: #2c3e50;
    font-size: 20px;
}

.close-btn {
    background: none;
    border: none;
    font-size: 28px;
    cursor: pointer;
    color: #7f8c8d;
    line-height: 1;
}

.close-btn:hover {
    color: #2c3e50;
}

.modal-body {
    padding: 20px;
}

.detail-row {
    display: flex;
    padding: 12px 0;
    border-bottom: 1px solid #ecf0f1;
}

.detail-row:last-child {
    border-bottom: none;
}

.detail-label {
    font-weight: 600;
    min-width: 180px;
    color: #34495e;
}

.form-input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
}

.form-textarea {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    resize: vertical;
}

.modal-footer {
    padding: 20px;
    border-top: 1px solid #ecf0f1;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}

.text-center {
    text-align: center;
    color: #7f8c8d;
}

.text-danger {
    color: #dc3545;
    font-weight: 600;
}

@media (max-width: 768px) {
    .peminjaman-container {
        padding: 10px;
    }
    
    .table-container {
        overflow-x: auto;
    }
    
    .peminjaman-table {
        font-size: 12px;
    }
    
    .peminjaman-table th,
    .peminjaman-table td {
        padding: 10px 5px;
    }
    
    .action-buttons {
        flex-direction: column;
    }
    
    .btn {
        width: 100%;
    }
    
    .detail-row {
        flex-direction: column;
    }
    
    .detail-label {
        margin-bottom: 5px;
    }
}
</style>