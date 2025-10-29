import LoginView from '@/views/LoginView.vue'
import userlayout from '@/layout/user.vue'
import Sidebar from '@/components/psidebar.vue';

const routes = [
  {
    path: '/',
    component: userlayout,
    children: [
      {
        path: '', // default child
        name: 'home',
        component: () => import('../views/HomeView.vue'),
      },
      {
        path: 'informasi',
        name: 'informasi',
        component: () => import('../views/users/InformasiView.vue'),
      },
      {
        path: 'cari',
        name: 'cari',
        component: () => import('../views/users/CariView.vue'),
        meta: { requiresAuth: false },
      },
      {
        path: 'pinjam',
        name: 'pinjam',
        component: () => import('../views/users/RiwayatView.vue'),
      },
      {
        path: 'article',
        name: 'article',
        component: () => import('../views/users/ArticleView.vue'),
      },
      {
        path: 'profil',
        name: 'profil',
        component: () => import('../views/users/ProfilView.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'kategori',
        name: 'kategori',
        component: () => import('../views/users/KategoriView.vue'),
      },
      {
        path: 'buku/:id',
        name: 'BookDetail',
        component: () => import('../views/users/DetailView.vue'),
        meta: { requiresAuth: false },
      },
      {
        path: 'riwayat',
        name: 'riwayat',
        component: () => import('../views/users/RiwayatView.vue'),
        meta: { requiresAuth: true },
      }
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
  },
  {
    path: '/side',
    name: 'side',
    component: Sidebar,
  }
]

// Export the routes array so the main router can compose them
export default routes
