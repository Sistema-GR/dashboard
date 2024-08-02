import { createRouter, createWebHistory } from 'vue-router'
import login from '../views/Auth/login.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: login
    },
  ]
})

export default router
