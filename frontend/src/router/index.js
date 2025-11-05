import { createRouter, createWebHistory } from 'vue-router'
import usersRoutes from './user.js'
import adminRoutes from './admin.js'
import LoginView from '@/views/LoginView.vue'
import NotFound from '@/views/NotFound.vue'
import PenyusupView from '@/views/PenyusupView.vue'
// Fungsi untuk generate random path
function generateRandomPath() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let path = ''
  for (let i = 0; i < 16; i++) {
    path += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return `/intruder-${path}`
}

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
  const protectedPaths = ['/admin', '/pustakawan']

  // 🔹 Cek akses ke panel admin
  if (protectedPaths.some(prefix => to.path.startsWith(prefix))){
    // Jika bukan pustakawan, redirect ke halaman ancaman dengan path random
    if (user?.role !== 'pustakawan') {
      const randomPath = generateRandomPath()
      
      // Tambahkan route dinamis untuk path random ini
      router.addRoute({
        path: randomPath,
        name: `intruder-${Date.now()}`,
        component: PenyusupView,
      })
      
      return next(randomPath)
    }
  }

  // 🔹 Cegah akses halaman yang butuh login tanpa token
  if (to.meta.requiresAuth && !token) {
    return next({ path: '/login', query: { redirect: to.fullPath } })
  }

  next()
})

export default router