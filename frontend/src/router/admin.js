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
      {
        path: 'members',
        name: 'AdminMembers',
        component: () => import('@/views/admin/MemberView.vue'),
      },
      {
        path: 'borrowings',
        name: 'AdminBorrowings',
        component: () => import('@/views/admin/PinjamView.vue'),
      }
    ],
  },
]

export default adminRoutes