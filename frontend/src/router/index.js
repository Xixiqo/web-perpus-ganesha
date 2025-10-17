import { createRouter, createWebHistory } from 'vue-router'
import usersRoutes from './user.js'
import adminRoutes from './admin.js'
import LoginView from '@/views/LoginView.vue'
import NotFound from '@/views/NotFound.vue'

const routes = [
  ...usersRoutes,
  ...adminRoutes,
  {
    path: '/login',
    name: 'login',
    component: LoginView,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// ✅ Global Navigation Guard (Cek login & role)
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const userData = localStorage.getItem('user')
  const user = userData ? JSON.parse(userData) : null

  // 🔹 Cegah akses halaman yang butuh login tanpa token
  if (to.meta.requiresAuth && !token) {
    return next({ path: '/login', query: { redirect: to.fullPath } })
  }

  // 🔹 Cegah akses ke panel admin jika bukan pustakawan
  if (to.path.startsWith('/admin') && user?.role !== 'pustakawan') {
    alert('❌ Akses ditolak. Hanya pustakawan yang dapat mengakses panel admin.')
    return next('/')
  }

  next()
})

export default router
