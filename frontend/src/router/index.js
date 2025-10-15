import { createRouter, createWebHistory } from 'vue-router'
  import HomeBetter from '../views/users/HomeView.vue'

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
      component: () => import('../views/users/InformasiView.vue'),
    },
    {
      path: '/cari',
      name: 'cari',
      component: () => import('../views/users/CariView.vue'),
    },
    {
      path: '/pinjam',
      name: 'pinjam',
      component: () => import('../views/users/PinjamView.vue'),
    },
    {
      path: '/article',
      name: 'article',
      component: () => import('../views/users/ArticleView.vue'),
    },
    {
     path: '/login',
     name: 'Login',
     component: () => import('@/views/LoginView.vue')
   },
   {
    path: '/cari',
    name: 'Cari',
    component: () => import('@/views/users/CariView.vue'),
    meta: { requiresAuth: false }
    },
    {
      path: '/profil',
      name: 'Profil',
      component: () => import('../views/users/ProfilView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/detail',
      name: 'detail',
      component: () => import('../views/users/DetailView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/slider',
      name: 'slider',
      component: () => import('../views/users/slider-smntr.vue'),
      meta: { requiresAuth: true }
    },
  ],
})

export default router
