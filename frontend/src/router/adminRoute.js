import AdminLayout from '@/layouts/AdminLayout.vue'
import Dashboard from '@/views/admin/DashboardView.vue'
import TambahBuku from '@/views/admin/ManajemenBuku/tambahbuku.vue'
import HapusBuku from '@/views/admin/ManajemenBuku/hapusbuku.vue'

const adminRoutes = [
  {
    path: '/admin',
    component: AdminLayout,
    children: [
      {
        path: '',
        name: 'AdminDashboard',
        component: Dashboard,
      },
      {
        path: 'tambah-buku',
        name: 'TambahBuku',
        component: TambahBuku,
      },
      {
        path: 'hapus-buku',
        name: 'HapusBuku',
        component: HapusBuku,
      },
    ],
  },
]

export default adminRoutes
