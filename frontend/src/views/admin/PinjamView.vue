<template>
    <div class="max-w-[1400px] mx-auto p-5 bg-gray-50 min-h-screen">
        <!-- Modal Alert -->
        <div v-if="alert.show" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm" @click="closeAlert">
            <div class="bg-white rounded-xl shadow-2xl max-w-[600px] w-[90%] overflow-hidden animate-slideIn" @click.stop>
                <div :class="[
                    'p-6 flex items-center gap-4 text-white relative',
                    alert.type === 'alert' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                    alert.type === 'success' ? 'bg-gradient-to-r from-green-500 to-green-600' :
                    alert.type === 'error' ? 'bg-gradient-to-r from-red-500 to-red-600' :
                    'bg-gradient-to-r from-amber-500 to-amber-600'
                ]">
                    <div class="text-2xl">{{ alert.icon }}</div>
                    <h2 class="text-lg font-semibold flex-1">{{ alert.title }}</h2>
                    <button 
                        @click="closeAlert" 
                        class="absolute right-4 top-1/2 -translate-y-1/2 text-2xl hover:bg-white/20 w-8 h-8 flex items-center justify-center rounded-full transition-colors"
                    >×</button>
                </div>
                <div class="p-6 text-gray-700 leading-relaxed">
                    <p>{{ alert.message }}</p>
                </div>
                <div class="p-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-4">
                    <button 
                        @click="closeAlert"
                        :class="[
                            'px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 shadow-md hover:-translate-y-0.5 hover:shadow-lg',
                            alert.type === 'alert' ? 'bg-blue-500 text-white' :
                            alert.type === 'success' ? 'bg-green-500 text-white' :
                            alert.type === 'error' ? 'bg-red-500 text-white' :
                            'bg-amber-500 text-white'
                        ]"
                    >OK</button>
                </div>
            </div>
        </div>

        <div class="mb-8">
            <h1 class="text-2xl font-bold text-gray-800 mb-1">Manajemen Peminjaman</h1>
            <p class="text-sm text-gray-600">Kelola semua transaksi peminjaman buku perpustakaan</p>
        </div>

        <!-- Status Dropdown -->
        <div class="bg-white p-5 rounded-lg shadow-sm mb-5">
            <div class="relative w-64">
                <select 
                    v-model="filterStatus"
                    class="w-full px-4 py-2 rounded-lg text-sm font-semibold appearance-none border border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-200 transition-all"
                >
                    <option 
                        v-for="option in statusOptions" 
                        :key="option.value" 
                        :value="option.value"
                        class="py-2"
                    >
                        {{ option.label }} {{ option.value === '' ? `(${peminjaman.length})` :
                           option.value === 'Pending' ? `(${getPendingCount})` :
                           option.value === 'Approved' ? `(${getApprovedCount})` :
                           option.value === 'Dipinjam' ? `(${getBorrowedCount})` :
                           option.value === 'Dikembalikan' ? `(${getReturnedCount})` :
                           option.value === 'Terlambat' ? `(${getLateCount})` : ''
                        }}
                    </option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                </div>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="bg-white rounded-lg shadow-sm p-[60px] text-center">
            <div class="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p class="text-gray-500">Memuat data peminjaman...</p>
        </div>

        <!-- Tabel Peminjaman -->
        <div v-else class="bg-white rounded-lg shadow-sm overflow-x-auto">
            <table class="w-full">
                <thead class="bg-gray-800 text-white">
                    <tr>
                        <th class="p-4 text-left font-semibold text-sm">ID</th>
                        <th class="p-4 text-left font-semibold text-sm">Peminjam</th>
                        <th class="p-4 text-left font-semibold text-sm">Buku</th>
                        <th class="p-4 text-left font-semibold text-sm">Tgl Pinjam</th>
                        <th class="p-4 text-left font-semibold text-sm">Tgl Kembali</th>
                        <th class="p-4 text-left font-semibold text-sm">Status</th>
                        <th class="p-4 text-left font-semibold text-sm">Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in filteredItems" :key="item.id_peminjaman" class="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                        <td class="p-4 text-sm text-gray-600">#{{ item.id_peminjaman }}</td>
                        <td class="p-4 text-sm text-gray-600">{{ getPeminjamName(item.id_anggota) }}</td>
                        <td class="p-4 text-sm text-gray-600">{{ getBookTitle(item.id_buku) }}</td>
                        <td class="p-4 text-sm text-gray-600">{{ formatDate(item.tanggal_pinjam) }}</td>
                        <td class="p-4 text-sm text-gray-600">{{ formatDate(item.tanggal_kembali) }}</td>
                        <td class="p-4">
                            <span :class="[
                                'px-3 py-1 rounded-full text-xs font-semibold inline-block',
                                item.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                                item.status === 'Approved' ? 'bg-cyan-100 text-cyan-700' :
                                item.status === 'Dipinjam' ? 'bg-blue-100 text-blue-700' :
                                item.status === 'Dikembalikan' ? 'bg-green-100 text-green-700' :
                                'bg-red-100 text-red-700'
                            ]">
                                {{ item.status }}
                            </span>
                        </td>
                        <td class="p-4">
                            <div class="flex gap-2">
                                <button 
                                    v-if="item.status === 'Pending'"
                                    @click="approveLoan(item.id_peminjaman)"
                                    class="w-9 h-9 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition-colors flex items-center justify-center"
                                    title="Setujui"
                                >✓</button>
                                <button 
                                    v-if="item.status === 'Pending'"
                                    @click="rejectLoan(item.id_peminjaman)"
                                    class="w-9 h-9 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors flex items-center justify-center"
                                    title="Tolak"
                                >×</button>
                                <button 
                                    v-if="item.status === 'Approved'"
                                    @click="markBorrowed(item.id_peminjaman)"
                                    class="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors flex items-center justify-center"
                                    title="Tandai Dipinjam"
                                >↗</button>
                                <button 
                                    v-if="item.status === 'Dipinjam'"
                                    @click="openReturnModal(item)"
                                    class="w-9 h-9 rounded-lg bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors flex items-center justify-center"
                                    title="Kembalikan"
                                >↙</button>
                                <button 
                                    @click="showDetail(item)"
                                    class="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 hover:bg-amber-200 transition-colors flex items-center justify-center"
                                    title="Detail"
                                >ℹ</button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Modal Detail -->
        <div v-if="showDetailModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm" @click.self="closeModal">
            <div class="bg-white rounded-xl shadow-2xl max-w-[800px] w-[90%] max-h-[90vh] overflow-y-auto">
                <div class="p-6 flex items-center gap-4 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-t-xl">
                    <h2 class="text-xl font-semibold">Detail Peminjaman</h2>
                    <button 
                        @click="closeModal"
                        class="ml-auto text-2xl hover:bg-white/20 w-8 h-8 flex items-center justify-center rounded-full transition-colors"
                    >×</button>
                </div>
                <div class="p-6">
                    <div v-if="selectedItem" class="space-y-4">
                        <div class="flex border-b border-gray-200 py-3">
                            <div class="font-semibold text-gray-700 w-[180px]">ID Peminjaman</div>
                            <div class="text-gray-600">#{{ selectedItem.id }}</div>
                        </div>
                        <div class="flex border-b border-gray-200 py-3">
                            <div class="font-semibold text-gray-700 w-[180px]">Peminjam</div>
                            <div class="text-gray-600">{{ selectedItem.peminjam }}</div>
                        </div>
                        <div class="flex border-b border-gray-200 py-3">
                            <div class="font-semibold text-gray-700 w-[180px]">Buku</div>
                            <div class="text-gray-600">{{ selectedItem.buku }}</div>
                        </div>
                        <div class="flex border-b border-gray-200 py-3">
                            <div class="font-semibold text-gray-700 w-[180px]">Tanggal Pinjam</div>
                            <div class="text-gray-600">{{ formatDate(selectedItem.tanggal_pinjam) }}</div>
                        </div>
                        <div class="flex border-b border-gray-200 py-3">
                            <div class="font-semibold text-gray-700 w-[180px]">Tanggal Kembali</div>
                            <div class="text-gray-600">{{ formatDate(selectedItem.tanggal_kembali) }}</div>
                        </div>
                        <div class="flex border-b border-gray-200 py-3">
                            <div class="font-semibold text-gray-700 w-[180px]">Status</div>
                            <div>
                                <span :class="[
                                    'px-3 py-1 rounded-full text-xs font-semibold',
                                    selectedItem.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                    selectedItem.status === 'approved' ? 'bg-cyan-100 text-cyan-700' :
                                    selectedItem.status === 'borrowed' ? 'bg-blue-100 text-blue-700' :
                                    selectedItem.status === 'returned' ? 'bg-green-100 text-green-700' :
                                    'bg-red-100 text-red-700'
                                ]">
                                    {{ 
                                        selectedItem.status === 'pending' ? 'Menunggu' :
                                        selectedItem.status === 'approved' ? 'Disetujui' :
                                        selectedItem.status === 'borrowed' ? 'Dipinjam' :
                                        selectedItem.status === 'returned' ? 'Dikembalikan' :
                                        'Terlambat'
                                    }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Pengembalian -->
        <div v-if="showReturnModalVisible" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm" @click.self="closeReturnModal">
            <div class="bg-white rounded-xl shadow-2xl max-w-[600px] w-[90%]">
                <div class="p-6 flex items-center gap-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-t-xl">
                    <h2 class="text-xl font-semibold">Pengembalian Buku</h2>
                    <button 
                        @click="closeReturnModal"
                        class="ml-auto text-2xl hover:bg-white/20 w-8 h-8 flex items-center justify-center rounded-full transition-colors"
                    >×</button>
                </div>
                <div class="p-6">
                    <div class="mb-4">
                        <label class="block text-sm font-semibold text-gray-700 mb-2">Catatan Pengembalian</label>
                        <textarea 
                            v-model="returnNote"
                            class="w-full p-3 border-2 border-gray-200 rounded-lg text-sm resize-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
                            rows="4"
                            placeholder="Masukkan catatan pengembalian (opsional)"
                        ></textarea>
                    </div>
                </div>
                <div class="p-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-4 rounded-b-xl">
                    <button 
                        @click="closeReturnModal"
                        class="px-5 py-2.5 border-2 border-gray-200 rounded-lg text-gray-600 text-sm font-semibold hover:bg-gray-100 transition-colors"
                    >
                        Batal
                    </button>
                    <button 
                        @click="confirmReturn"
                        class="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg text-sm font-semibold shadow-purple-200 shadow-md hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300"
                    >
                        Konfirmasi Pengembalian
                    </button>
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
            users: [],
            books: [],
            filterStatus: '',
            showDetailModal: false,
            showReturnModalVisible: false,
            selectedItem: null,
            returnDate: new Date().toISOString().split('T')[0],
            keterangan: '',
            lateDays: 0,
            loading: false,
            alert: {
                show: false,
                type: 'alert',
                title: '',
                message: '',
                confirmText: 'OK',
            },
            statusOptions: [
                { label: 'Semua', value: '' },
                { label: 'Menunggu', value: 'Pending' },
                { label: 'Disetujui', value: 'Approved' },
                { label: 'Dipinjam', value: 'Dipinjam' },
                { label: 'Dikembalikan', value: 'Dikembalikan' },
                { label: 'Terlambat', value: 'Terlambat' }
            ],
            autoCheckDone: false,
            apiBase: import.meta.env.VITE_API_BASE || 'http://localhost:5000'
        }
    },
    mounted() {
        this.loadPeminjaman();
    },
    methods: {
        calculateStatus(item) {
            if (!item.approved) {
                return 'pending';
            }
            if (item.approved && !item.borrowed) {
                return 'approved';
            }
            if (item.borrowed && !item.returned) {
                const today = new Date();
                const dueDate = new Date(item.tanggal_kembali);
                if (today > dueDate) {
                    return 'late';
                }
                return 'borrowed';
            }
            if (item.returned) {
                return 'returned';
            }
            return 'unknown';
        },

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

       getPeminjamName(id_anggota) {
            const user = this.users.find(user => 
                user.id === id_anggota || 
                user.id_user === id_anggota || 
                user.id_anggota === id_anggota
            );
            return user ? (user.username || user.nama || user.name || '-') : '-';
        },

        getBookTitle(id_buku) {
            const book = this.books.find(book => 
                book.id === id_buku || 
                book.id_buku === id_buku
            );
            return book ? (book.judul || book.title || book.nama_buku || '-') : '-';
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
                const [peminjamanRes, usersRes, booksRes] = await Promise.all([
                    fetch(`${this.apiBase}/api/admin/peminjamann`, {
                        method: 'GET',
                        headers: this.getAuthHeaders()
                    }),
                    fetch(`${this.apiBase}/api/admin/users`, {
                        method: 'GET',
                        headers: this.getAuthHeaders()
                    }),
                    fetch(`${this.apiBase}/api/admin/books`, {
                        method: 'GET',
                        headers: this.getAuthHeaders()
                    })
                ]);

                if (!peminjamanRes.ok) {
                    this.handleUnauthorized(peminjamanRes);
                    throw new Error('Gagal memuat data peminjaman');
                }

                if (!usersRes.ok || !booksRes.ok) {
                    throw new Error('Gagal memuat data pendukung');
                }

                const [peminjaman, users, books] = await Promise.all([
                    peminjamanRes.json(),
                    usersRes.json(),
                    booksRes.json()
                ]);

                this.peminjaman = peminjaman;
                this.users = users;
                this.books = books;
                
                console.log('✅ Data berhasil dimuat:', {
                    peminjaman: this.peminjaman.length,
                    users: this.users.length,
                    books: this.books.length
                });

                // Auto check late status hanya sekali saat load pertama
                if (!this.autoCheckDone) {
                    this.autoCheckDone = true;
                    // try to auto-check late statuses on the server and refresh if updates exist
                    try {
                        const res = await fetch(`${this.apiBase}/api/admin/peminjamann/check/late`, {
                            method: 'GET',
                            headers: this.getAuthHeaders()
                        });
                        const result = await res.json();
                        if (res.ok && result.updated > 0) {
                            await this.loadPeminjamanSilent();
                            this.showSuccess('Sukses', `${result.updated} status terlambat diperbarui.`);
                        } else if (!res.ok) {
                            this.handleUnauthorized(res);
                            console.warn('Auto check returned non-ok:', result);
                        }
                    } catch (err) {
                        console.error('❌ Error auto checking late status:', err);
                    }
                }
            } catch (error) {
                console.error('❌ Error loading peminjaman:', error);
                this.showError('Error', 'Gagal memuat data peminjaman: ' + error.message);
            } finally {
                this.loading = false;
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

        async approveLoan(id) {
            try {
                const response = await fetch(`${this.apiBase}/api/admin/peminjamann/${id}/status`, {
                    method: 'PUT',
                    headers: this.getAuthHeaders(),
                    body: JSON.stringify({
                        status: 'Approved'
                    })
                });

                if (!response.ok) {
                    this.handleUnauthorized(response);
                    const result = await response.text();
                    throw new Error(result || 'Gagal menyetujui peminjaman');
                }

                await this.loadPeminjamanSilent();
                this.showSuccess('Sukses', 'Peminjaman berhasil disetujui');
            } catch (error) {
                console.error('❌ Error approving loan:', error);
                this.showError('Error', 'Gagal menyetujui peminjaman: ' + error.message);
            }
        },

        async rejectLoan(id) {
            try {
                const response = await fetch(`${this.apiBase}/api/admin/peminjamann/${id}`, {
                    method: 'PUT',
                    headers: this.getAuthHeaders(),
                    body: JSON.stringify({
                        status: 'Rejected'
                    })
                });

                if (!response.ok) {
                    this.handleUnauthorized(response);
                    const result = await response.text();
                    throw new Error(result || 'Gagal menolak peminjaman');
                }

                await this.loadPeminjamanSilent();
                this.showSuccess('Sukses', 'Peminjaman berhasil ditolak');
            } catch (error) {
                console.error('❌ Error rejecting loan:', error);
                this.showError('Error', 'Gagal menolak peminjaman: ' + error.message);
            }
        },

        async markBorrowed(id) {
            try {
                const response = await fetch(`${this.apiBase}/api/admin/peminjamann/${id}/status`, {
                    method: 'PUT',
                    headers: this.getAuthHeaders(),
                    body: JSON.stringify({
                        status: 'Dipinjam'
                    })
                });

                const result = await response.json();

                if (!response.ok) {
                    this.handleUnauthorized(response);
                    throw new Error(result.message || 'Gagal menandai buku sebagai dipinjam');
                }

                await this.loadPeminjamanSilent();
                this.showSuccess('Sukses', 'Buku berhasil ditandai sebagai dipinjam');
            } catch (error) {
                console.error('❌ Error marking as borrowed:', error);
                this.showError('Error', 'Gagal menandai buku sebagai dipinjam: ' + error.message);
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

        openReturnModal(item) {
            this.selectedItem = item;
            this.returnDate = new Date().toISOString().split('T')[0];
            this.keterangan = '';
            this.calculateLateDaysForReturn();
            this.showReturnModalVisible = true;
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
            this.showReturnModalVisible = false;
            this.selectedItem = null;
        },

        closeReturnModal() {
            this.showReturnModalVisible = false;
            this.selectedItem = null;
            this.returnDate = new Date().toISOString().split('T')[0];
            this.keterangan = '';
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
                'pending': 'bg-yellow-100 text-yellow-800',
                'approved': 'bg-blue-100 text-blue-800',
                'borrowed': 'bg-green-100 text-green-800',
                'returned': 'bg-gray-100 text-gray-800',
                'late': 'bg-red-100 text-red-800'
            };
            return map[status] || 'bg-gray-100 text-gray-800';
        }
    },
    computed: {
        filteredItems() {
            if (!this.filterStatus || this.filterStatus === '') {
                return this.peminjaman;
            }
            return this.peminjaman.filter(item => item.status === this.filterStatus);
        },
        getPendingCount() {
            return this.peminjaman.filter(item => item.status === 'Pending').length;
        },
        getApprovedCount() {
            return this.peminjaman.filter(item => item.status === 'Approved').length;
        },
        getBorrowedCount() {
            return this.peminjaman.filter(item => item.status === 'Dipinjam').length;
        },
        getReturnedCount() {
            return this.peminjaman.filter(item => item.status === 'Dikembalikan').length;
        },
        getLateCount() {
            return this.peminjaman.filter(item => item.status === 'Terlambat').length;
        }
    },
    watch: {
        returnDate() {
            this.calculateLateDays();
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