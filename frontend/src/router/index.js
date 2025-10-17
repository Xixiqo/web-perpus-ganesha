import { createRouter, createWebHistory } from 'vue-router'
import usersRoutes from './user.js'
import adminRoutes from './admin.js'
import LoginView from '@/views/LoginView.vue'
import NotFound from '@/views/NotFound.vue'

// Compose routes from modules first
const routes = [
  ...usersRoutes,
  ...adminRoutes,
  { path: '/login', name: 'login', component: LoginView },
    {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
]

// Create router with composed routes
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Global navigation guard (kept here centrally)
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    next({ path: '/login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})

export default router