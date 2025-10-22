import { createRouter, createWebHistory } from 'vue-router'
import { getUserType, canAccessRoute, getDashboardRoute } from '@/service/userType'
import authRoutes from './routes/auth'
import adminRoutes from './routes/calculus'
import userRoutes from './routes/user'
import resourceRoutes from './routes/resource'

const routes = [
  ...authRoutes,
  ...adminRoutes,
  ...userRoutes,
  ...resourceRoutes,
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/views/User/NotFound/index.vue'), meta: { public: true } }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const isPublic = to.meta?.public === true
  const requiresAuth = to.meta?.requiresAuth === true
  const userType = getUserType()
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'

  if (isPublic) {
    //if (isAuthenticated) return next({ path: getDashboardRoute() })
    return next()
  }

  if (requiresAuth && !isAuthenticated) return next({ name: 'login' })

  const allowedRoles = to.meta?.roles
  if (allowedRoles && !allowedRoles.includes(userType)) {
    //return next({ path: getDashboardRoute() })
  }

  if (from.name == 'rewards') {
    if (to.name != 'rewards') {
      localStorage.removeItem('tempTargetCpf');
    }
  }
  next()
});

export default router;