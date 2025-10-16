import LoginView from '@/views/LoginView.vue'
import userlayout from '@/layout/user.vue'

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
        component: () => import('../views/users/PinjamView.vue'),
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
        path: 'detail',
        name: 'detail',
        component: () => import('../views/users/DetailView.vue'),
        meta: { requiresAuth: false },
      },
      {
        path: 'slider',
        name: 'slider',
        component: () => import('../views/users/slider-smntr.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'kategori',
        name: 'kategori',
        component: () => import('../views/users/KategoriView.vue'),
      },
      {
        path: 'panduan',
        name: 'panduan',
        component: () => import('../views/users/PanduanView.vue'),
      },
      {
        path: 'kontak',
        name: 'kontak',
        component: () => import('../views/users/KontakView.vue'),
      },
      {
        path: 'kebijakan',
        name: 'kebijakan',
        component: () => import('../views/users/KebijakanView.vue'),
      },
      {
        path: 'artikel',
        name: 'artikel',
        component: () => import('../views/users/ArticleView.vue'),
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
  },
]

// Export the routes array so the main router can compose them
export default routes
