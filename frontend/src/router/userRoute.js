import UserLayout from '@/layouts/UserLayout.vue'
import HomeView from '@/views/user/HomeView.vue'

const userRoutes = [
  {
    path: '/',
    component: UserLayout,
    children: [
      { 
        path: '',
        name: 'home', 
        component: HomeView },
      { 
        path: '/informasi', 
        name: 'informasi', 
        component: () => import('@/views/user/InformasiView.vue') },
      { 
        path: '/cari', 
        name: 'cari', 
        component: () => import('@/views/user/CariView.vue') },
      { 
        path: '/pinjam', 
        name: 'pinjam', 
        component: () => import('@/views/user/PinjamView.vue') },
      { 
        path: '/artikel', 
        name: 'artikel', 
        component: () => import('@/views/user/ArtikelView.vue') },
      {
        path: '/login', 
        name: 'login', 
        component: () => import('@/views/user/LoginView.vue')
      }
    ],
  },
]

export default userRoutes
