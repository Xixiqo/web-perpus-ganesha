import AdminLayout from '@/layout/admin.vue'
import Dashboard from '@/views/admin/dashboardView.vue'

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
        path: 'books',
        name: 'AdminBooks',
        component: () => import('@/views/admin/booksView.vue'),
      },
    ],
  },
]

export default adminRoutes