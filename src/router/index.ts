import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/add-expense',
      name: 'add-expense',
      component: () => import('../views/AddExpenseView.vue'),
    },
    {
      path: '/add-envelope',
      name: 'add-envelope',
      component: () => import('../views/AddEnvelopeView.vue'),
    },
  ],
})

export default router
