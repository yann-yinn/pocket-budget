<template>
  <div class="bg-white shadow-md rounded-lg p-6">
    <h2 class="text-xl font-semibold text-gray-900 mb-4">Progression des dépenses</h2>
    <div v-if="loading" class="text-center py-4">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
    </div>
    <div v-else-if="error" class="p-4 bg-red-100 text-red-700 rounded-md">
      {{ error }}
    </div>
    <div v-else-if="envelopes.length === 0" class="text-center py-4 text-gray-500">
      Aucune enveloppe
    </div>
    <div v-else class="space-y-4">
      <div v-for="envelope in envelopes" :key="envelope.id" class="space-y-1">
        <div class="flex justify-between items-center">
          <span class="text-sm font-medium text-gray-700">{{ envelope.name }}</span>
          <span class="text-sm text-gray-500">
            {{ formatAmount(envelope.spent) }} / {{ formatAmount(envelope.amount) }}
          </span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2.5">
          <div
            class="h-2.5 rounded-full transition-all duration-300"
            :class="getProgressColor(envelope.spent / envelope.amount)"
            :style="{ width: `${Math.min((envelope.spent / envelope.amount) * 100, 100)}%` }"
          ></div>
        </div>
        <div class="flex justify-between text-xs">
          <span class="text-gray-500">0%</span>
          <span class="text-gray-500"
            >{{ Math.min(Math.round((envelope.spent / envelope.amount) * 100), 100) }}%</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { supabase } from '../utils/supabase'
import type { Envelope } from '../types/database'

interface EnvelopeWithSpent extends Envelope {
  spent: number
}

interface Period {
  startDate: Date
  endDate: Date
}

interface Props {
  period: Period
}

const props = defineProps<Props>()

const envelopes = ref<EnvelopeWithSpent[]>([])
const loading = ref(true)
const error = ref('')

const fetchEnvelopesWithSpent = async () => {
  loading.value = true
  error.value = null
  try {
    // Récupérer toutes les enveloppes
    const { data: envelopesData, error: envelopesError } = await supabase
      .from('envelopes')
      .select('*')
      .or('archived.is.null,archived.eq.false')
      .order('name')

    if (envelopesError) throw envelopesError

    // Récupérer les dépenses pour la période
    const { data: expensesData, error: expensesError } = await supabase
      .from('expenses')
      .select('*')
      .gte('date', props.period.startDate.toISOString().split('T')[0])
      .lte('date', props.period.endDate.toISOString().split('T')[0])

    if (expensesError) throw expensesError

    // Calculer le total dépensé par enveloppe
    const spentByEnvelope = expensesData.reduce(
      (acc, expense) => {
        acc[expense.envelope_id] = (acc[expense.envelope_id] || 0) + expense.amount
        return acc
      },
      {} as Record<string, number>,
    )

    // Combiner les données
    envelopes.value = envelopesData.map((envelope) => ({
      ...envelope,
      spent: spentByEnvelope[envelope.id] || 0,
    }))
  } catch (err) {
    console.error('Erreur lors du chargement des enveloppes:', err)
    error.value = 'Erreur lors du chargement des enveloppes'
  } finally {
    loading.value = false
  }
}

const formatAmount = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)
}

const getProgressColor = (ratio: number) => {
  if (ratio >= 1) return 'bg-red-600'
  if (ratio >= 0.8) return 'bg-orange-500'
  if (ratio >= 0.5) return 'bg-yellow-500'
  return 'bg-green-500'
}

// Mettre à jour les données quand la période change
watch(
  () => props.period,
  () => {
    fetchEnvelopesWithSpent()
  },
  { deep: true },
)

onMounted(() => {
  fetchEnvelopesWithSpent()
})
</script>
