import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AddEnvelopeView from '../views/AddEnvelopeView.vue'
import AddExpenseView from '../views/AddExpenseView.vue'
import ExpensesView from '../views/ExpensesView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/add-envelope',
      name: 'add-envelope',
      component: AddEnvelopeView,
    },
    {
      path: '/add-expense',
      name: 'add-expense',
      component: AddExpenseView,
    },
    {
      path: '/expenses',
      name: 'expenses',
      component: ExpensesView,
    },
    {
      path: '/edit-envelope/:id',
      name: 'edit-envelope',
      component: () => import('../views/EditEnvelopeView.vue'),
    },
  ],
})

export default router
