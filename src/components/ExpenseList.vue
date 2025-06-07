<template>
  <div class="bg-white shadow-md rounded-lg p-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold text-gray-900">Dépenses</h2>
      <RouterLink
        to="/add-expense"
        class="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clip-rule="evenodd"
          />
        </svg>
        Ajouter une dépense
      </RouterLink>
    </div>
    <div v-if="loading" class="text-center py-4">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
    </div>
    <div v-else-if="error" class="p-4 bg-red-100 text-red-700 rounded-md">
      {{ error }}
    </div>
    <div v-else-if="expenses.length === 0" class="text-center py-4 text-gray-500">
      Aucune dépense enregistrée
    </div>
    <ul v-else class="divide-y divide-gray-200">
      <li v-for="expense in expenses" :key="expense.id" class="py-4">
        <div class="flex justify-between items-center">
          <div>
            <h3 class="text-lg font-medium text-gray-900">
              {{ expense.envelope?.name || 'Enveloppe inconnue' }}
            </h3>
            <p class="text-sm text-gray-500">{{ formatDate(expense.date) }}</p>
          </div>
          <div class="text-right">
            <p class="text-lg font-semibold text-gray-900">{{ formatAmount(expense.amount) }}</p>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { supabase } from '../utils/supabase'
import type { Expense, Envelope } from '../types/database'

interface ExpenseWithEnvelope extends Expense {
  envelope?: Envelope
}

const expenses = ref<ExpenseWithEnvelope[]>([])
const loading = ref(true)
const error = ref('')

const fetchExpenses = async () => {
  try {
    loading.value = true
    error.value = ''

    const { data, error: supabaseError } = await supabase
      .from('expenses')
      .select(
        `
        *,
        envelope:envelopes!envelope_id(*)
      `,
      )
      .order('date', { ascending: false })

    if (supabaseError) throw supabaseError

    expenses.value = data || []
  } catch (err) {
    console.error('Erreur lors du chargement des dépenses:', err)
    error.value = 'Une erreur est survenue lors du chargement des dépenses'
  } finally {
    loading.value = false
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

const formatAmount = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)
}

onMounted(() => {
  fetchExpenses()
})
</script>
