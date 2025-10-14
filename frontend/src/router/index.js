import { createRouter, createWebHistory } from 'vue-router'
import userRoutes from './userRoute.js'
import adminRoutes from './adminRoute.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...userRoutes,
    ...adminRoutes,
  ],
})

router.beforeEach((to, from, next) => {
  if (to.path.startsWith('/admin')) {
    const token = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('user'))

    if (!token || !user || user.role !== 'pustakawan') {
      return next('/login?redirect=' + to.fullPath)
    }
  }
  next()
})

export default router
