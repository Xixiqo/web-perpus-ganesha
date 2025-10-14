import { createRouter, createWebHistory } from 'vue-router'
  import HomeBetter from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeBetter,
    },
    {
      path: '/informasi',
      name: 'informasi',
      component: () => import('../views/InformasiView.vue'),
    },
    {
      path: '/cari',
      name: 'cari',
      component: () => import('../views/CariView.vue'),
    },
    {
      path: '/pinjam',
      name: 'pinjam',
      component: () => import('../views/PinjamView.vue'),
    },
    {
      path: '/artikel',
      name: 'artikel',
      component: () => import('../views/ArtikelView.vue'),
    },
    {
     path: '/login',
     name: 'Login',
     component: () => import('@/views/LoginView.vue')
   },
   {
    path: '/cari',
    name: 'Cari',
    component: () => import('@/views/CariView.vue'),
    meta: { requiresAuth: false }
}
  ],
})

export default router
