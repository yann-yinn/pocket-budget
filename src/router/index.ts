import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

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
    {
      path: '/envelopes',
      name: 'envelopes',
      component: () => import('../views/EnvelopesView.vue'),
    },
    {
      path: '/envelopes/:id/edit',
      name: 'envelopeEdit',
      component: () => import('../views/EnvelopeEditView.vue'),
    },
  ],
})

export default router
