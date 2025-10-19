<template>
    <div class="peminjaman-container">
        <!-- Modal Alert -->
        <div v-if="alert.show" class="modal-overlay" @click="closeAlert">
            <div class="modal-content alert-modal" @click.stop>
                <div class="modal-header" :class="`alert-${alert.type}`">
                    <span class="alert-icon">{{ getAlertIcon() }}</span>
                    <span class="alert-title">{{ alert.title }}</span>
                    <button class="modal-close" @click="closeAlert">✕</button>
                </div>
                <div class="modal-body">
                    <p class="alert-message">{{ alert.message }}</p>
                </div>
                <div class="modal-footer">
                    <button 
                        v-if="alert.type === 'confirm'" 
                        @click="closeAlert" 
                        class="btn btn-secondary-modal"
                    >
                        Batal
                    </button>
                    <button 
                        @click="handleAlertConfirm" 
                        :class="`btn btn-${alert.type}-modal`"
                    >
                        {{ alert.confirmText || 'OK' }}
                    </button>
                </div>
            </div>
        </div>

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
            <button @click="manualCheckLateStatus" class="btn btn-warning" style="margin-left: 10px;">
                🔄 Cek Status Terlambat
            </button>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="loading">
            <div class="spinner"></div>
            <p>Memuat data...</p>
        </div>

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
                                    class="btn-icon-action approve-btn"
                                    title="Setujui"
                                >
                                    ✓
                                </button>
                                <button 
                                    v-if="item.status === 'Pending'" 
                                    @click="confirmReject(item)"
                                    class="btn-icon-action reject-btn"
                                    title="Tolak"
                                >
                                    ✕
                                </button>
                                <button 
                                    v-if="item.status === 'Approved'" 
                                    @click="updateStatus(item, 'Dipinjam')"
                                    class="btn-icon-action borrow-btn"
                                    title="Dipinjam"
                                >
                                    📤
                                </button>
                                <button 
                                    v-if="item.status === 'Dipinjam' || item.status === 'Terlambat'" 
                                    @click="showReturnModal(item)"
                                    class="btn-icon-action return-btn"
                                    title="Kembalikan"
                                >
                                    📥
                                </button>
                                <button 
                                    @click="showDetail(item)"
                                    class="btn-icon-action detail-btn"
                                    title="Detail"
                                >
                                    ℹ️
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
                <div class="modal-header detail-header">
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
                <div class="modal-header detail-header">
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
            loading: false,
            pendingCallback: null,
            alert: {
                show: false,
                type: 'alert',
                title: '',
                message: '',
                confirmText: 'OK',
            },
            autoCheckDone: false,
            apiBase: import.meta.env.VITE_API_BASE || 'http://localhost:5000'
        }
    },
    mounted() {
        this.loadPeminjaman();
    },
    methods: {
        getAuthHeaders() {
            const token = localStorage.getItem('token');
            return {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };
        },

        handleUnauthorized(response) {
            if (response.status === 401 || response.status === 403) {
                console.error('⚠️ Unauthorized - Token invalid atau expired');
                localStorage.removeItem('token');
            }
        },

        showAlert(title, message, type = 'alert') {
            this.alert = {
                show: true,
                type,
                title,
                message,
                confirmText: 'OK',
            };
        },

        showSuccess(title, message) {
            this.showAlert(title, message, 'success');
        },

        showError(title, message) {
            this.showAlert(title, message, 'error');
        },

        showConfirm(title, message, callback) {
            this.pendingCallback = callback;
            this.alert = {
                show: true,
                type: 'confirm',
                title,
                message,
                confirmText: 'Lanjutkan',
            };
        },

        getAlertIcon() {
            const icons = {
                'alert': 'ℹ️',
                'success': '✓',
                'error': '✕',
                'confirm': '❓'
            };
            return icons[this.alert.type] || 'ℹ️';
        },

        closeAlert() {
            this.alert.show = false;
            this.pendingCallback = null;
        },

        handleAlertConfirm() {
            if (this.alert.type === 'confirm' && this.pendingCallback) {
                this.pendingCallback();
            }
            this.closeAlert();
        },

        async loadPeminjaman() {
            this.loading = true;
            try {
                const response = await fetch(`${this.apiBase}/api/admin/peminjamann`, {
                    method: 'GET',
                    headers: this.getAuthHeaders()
                });

                if (!response.ok) {
                    this.handleUnauthorized(response);
                    throw new Error('Gagal memuat data peminjaman');
                }
                
                this.peminjaman = await response.json();
                this.filteredPeminjaman = [...this.peminjaman];
                console.log('✅ Data peminjaman dimuat:', this.peminjaman.length);

                // Auto check late status hanya sekali saat load pertama
                if (!this.autoCheckDone) {
                    this.autoCheckDone = true;
                    await this.autoCheckLateStatus();
                }
            } catch (error) {
                console.error('❌ Error loading peminjaman:', error);
                this.showError('Error', 'Gagal memuat data peminjaman: ' + error.message);
            } finally {
                this.loading = false;
            }
        },

        async autoCheckLateStatus() {
            try {
                const response = await fetch(`${this.apiBase}/api/admin/peminjamann/check/late`, {
                    method: 'GET',
                    headers: this.getAuthHeaders()
                });

                const result = await response.json();

                if (response.ok && result.updated > 0) {
                    await this.loadPeminjamanSilent();
                }
            } catch (error) {
                console.error('❌ Error auto checking late status:', error);
            }
        },

        async loadPeminjamanSilent() {
            try {
                const response = await fetch(`${this.apiBase}/api/admin/peminjamann`, {
                    method: 'GET',
                    headers: this.getAuthHeaders()
                });

                if (response.ok) {
                    this.peminjaman = await response.json();
                    this.filterPeminjaman();
                }
            } catch (error) {
                console.error('❌ Error reloading data:', error);
            }
        },

        async manualCheckLateStatus() {
            try {
                const response = await fetch(`${this.apiBase}/api/admin/peminjamann/check/late`, {
                    method: 'GET',
                    headers: this.getAuthHeaders()
                });

                const result = await response.json();

                if (response.ok) {
                    this.showSuccess('Sukses', `Pengecekan status terlambat berhasil. ${result.updated} data diperbarui.`);
                    await this.loadPeminjamanSilent();
                } else {
                    this.handleUnauthorized(response);
                    throw new Error(result.message || 'Gagal mengecek status terlambat');
                }
            } catch (error) {
                console.error('❌ Error checking late status:', error);
                this.showError('Error', 'Gagal mengecek status terlambat: ' + error.message);
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

        updateStatus(item, newStatus) {
            this.showConfirm(
                'Ubah Status',
                `Apakah Anda yakin ingin mengubah status menjadi ${newStatus}?`,
                async () => {
                    try {
                        const response = await fetch(`${this.apiBase}/api/admin/peminjamann/${item.id_peminjaman}/status`, {
                            method: 'PUT',
                            headers: this.getAuthHeaders(),
                            body: JSON.stringify({ status: newStatus })
                        });

                        const result = await response.json();
                        
                        if (!response.ok) {
                            this.handleUnauthorized(response);
                            throw new Error(result.message || 'Gagal mengubah status');
                        }

                        item.status = newStatus;
                        this.showSuccess('Sukses', `Status berhasil diubah menjadi ${newStatus}`);
                        this.filterPeminjaman();
                    } catch (error) {
                        console.error('❌ Error updating status:', error);
                        this.showError('Error', 'Gagal mengubah status: ' + error.message);
                    }
                }
            );
        },

        confirmReject(item) {
            this.showConfirm(
                'Tolak Peminjaman',
                'Apakah Anda yakin ingin menolak peminjaman ini?',
                async () => {
                    try {
                        const response = await fetch(`${this.apiBase}/api/admin/peminjamann/${item.id_peminjaman}`, {
                            method: 'DELETE',
                            headers: this.getAuthHeaders()
                        });

                        const result = await response.json();
                        
                        if (!response.ok) {
                            this.handleUnauthorized(response);
                            throw new Error(result.message || 'Gagal menolak peminjaman');
                        }

                        this.peminjaman = this.peminjaman.filter(p => p.id_peminjaman !== item.id_peminjaman);
                        this.filterPeminjaman();
                        this.showSuccess('Sukses', 'Peminjaman berhasil ditolak');
                    } catch (error) {
                        console.error('❌ Error rejecting peminjaman:', error);
                        this.showError('Error', 'Gagal menolak peminjaman: ' + error.message);
                    }
                }
            );
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

                const response = await fetch(`${this.apiBase}/api/admin/peminjamann/${this.selectedItem.id_peminjaman}/return`, {
                    method: 'PUT',
                    headers: this.getAuthHeaders(),
                    body: JSON.stringify({
                        tanggal_dikembalikan: this.returnDate,
                        denda: denda,
                        keterangan: this.keterangan
                    })
                });

                const result = await response.json();
                
                if (!response.ok) {
                    this.handleUnauthorized(response);
                    throw new Error(result.message || 'Gagal memproses pengembalian');
                }

                this.selectedItem.status = 'Dikembalikan';
                const message = `Buku berhasil dikembalikan${denda > 0 ? ` dengan denda Rp ${denda.toLocaleString('id-ID')}` : ''}`;
                this.showSuccess('Sukses', message);
                this.closeModal();
                this.filterPeminjaman();
            } catch (error) {
                console.error('❌ Error returning book:', error);
                this.showError('Error', 'Gagal memproses pengembalian: ' + error.message);
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
/* Alert Modal */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

@keyframes slideUp {
    from {
        transform: translateY(20px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

.modal-content {
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    max-width: 600px;
    width: 90%;
    overflow: hidden;
    animation: slideUp 0.3s ease;
}

.alert-modal {
    max-width: 400px;
}

.modal-header {
    padding: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    color: white;
    position: relative;
}

.modal-header.alert-alert {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.modal-header.alert-success {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.modal-header.alert-error {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

.modal-header.alert-confirm {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.modal-header.detail-header {
    background: linear-gradient(135deg, #34495e 0%, #2c3e50 100%);
}

.alert-icon {
    font-size: 1.75rem;
    flex-shrink: 0;
}

.alert-title,
.modal-header h2 {
    font-size: 1.1rem;
    font-weight: 600;
    flex: 1;
    margin: 0;
}

.modal-close {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    transition: background 0.2s ease;
}

.modal-close:hover {
    background: rgba(255, 255, 255, 0.2);
}

.close-btn {
    background: none;
    border: none;
    font-size: 28px;
    cursor: pointer;
    color: white;
    line-height: 1;
    transition: opacity 0.2s ease;
}

.close-btn:hover {
    opacity: 0.7;
}

.modal-body {
    padding: 1.5rem;
    color: #374151;
}

.alert-message {
    margin: 0;
    line-height: 1.6;
    font-size: 0.95rem;
}

.modal-footer {
    padding: 1rem 1.5rem;
    background: #f9fafb;
    border-top: 1px solid #e5e7eb;
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
}

.btn-alert-modal,
.btn-success-modal,
.btn-error-modal,
.btn-confirm-modal {
    padding: 0.625rem 1.25rem;
    border: none;
    border-radius: 6px;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
}

.btn-alert-modal {
    background: #3b82f6;
    color: white;
}

.btn-alert-modal:hover {
    background: #2563eb;
}

.btn-success-modal {
    background: #10b981;
    color: white;
}

.btn-success-modal:hover {
    background: #059669;
}

.btn-error-modal {
    background: #ef4444;
    color: white;
}

.btn-error-modal:hover {
    background: #dc2626;
}

.btn-confirm-modal {
    background: #f59e0b;
    color: white;
}

.btn-confirm-modal:hover {
    background: #d97706;
}

.btn-secondary-modal {
    padding: 0.625rem 1.25rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    background: white;
    color: #374151;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
}

.btn-secondary-modal:hover {
    background: #f3f4f6;
}

/* Main Container */
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
    flex-wrap: wrap;
    gap: 10px;
}

.filter-section label {
    font-weight: 600;
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
    padding: 60px 20px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #34495e;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 15px;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.loading p {
    color: #7f8c8d;
    font-size: 16px;
    margin: 0;
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
    gap: 8px;
    flex-wrap: wrap;
}

.btn-icon-action {
    width: 36px;
    height: 36px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    background: #e5e7eb;
    color: #374151;
}

.approve-btn {
    background: #d1fae5;
    color: #065f46;
}

.approve-btn:hover {
    background: #a7f3d0;
    transform: scale(1.1);
}

.reject-btn {
    background: #fee2e2;
    color: #991b1b;
}

.reject-btn:hover {
    background: #fecaca;
    transform: scale(1.1);
}

.borrow-btn {
    background: #dbeafe;
    color: #1e40af;
}

.borrow-btn:hover {
    background: #bfdbfe;
    transform: scale(1.1);
}

.return-btn {
    background: #f3e8ff;
    color: #6b21a8;
}

.return-btn:hover {
    background: #ede9fe;
    transform: scale(1.1);
}

.detail-btn {
    background: #fef3c7;
    color: #92400e;
}

.detail-btn:hover {
    background: #fde68a;
    transform: scale(1.1);
}

.btn {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
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
    
    .filter-section {
        flex-direction: column;
        align-items: stretch;
    }

    .filter-select {
        width: 100%;
    }
    
    .table-container {
        overflow-x: auto;
    }
    
    .peminjaman-table {
        font-size: 12px;
        min-width: 800px;
    }
    
    .peminjaman-table th,
    .peminjaman-table td {
        padding: 10px 5px;
    }
    
    .action-buttons {
        flex-direction: column;
    }
    
    .btn-icon-action {
        width: 100%;
        height: auto;
        padding: 8px;
    }
    
    .detail-row {
        flex-direction: column;
    }
    
    .detail-label {
        margin-bottom: 5px;
        min-width: auto;
    }

    .modal-footer {
        flex-direction: column-reverse;
    }

    .btn {
        width: 100%;
    }
}
</style>