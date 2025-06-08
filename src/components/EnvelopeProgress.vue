<template>
  <div class="space-y-4">
    <div v-if="loading" class="text-center py-4">
      <p class="text-gray-500">Chargement...</p>
    </div>

    <div v-else-if="error" class="text-center py-4">
      <p class="text-red-500">{{ error }}</p>
    </div>

    <div v-else-if="envelopes.length === 0" class="text-center py-4">
      <p class="text-gray-500">Aucune enveloppe trouvée</p>
    </div>

    <div v-else class="space-y-4">
      <div v-for="envelope in envelopes" :key="envelope.id" class="bg-white p-4 rounded-lg shadow">
        <div class="flex justify-between items-center mb-2">
          <h3 class="text-lg font-medium text-gray-900">{{ envelope.name }}</h3>
          <span class="text-sm text-gray-500">
            {{ calculateSpent(envelope).toFixed(2) }}€ / {{ envelope.amount?.toFixed(2) }}€
          </span>
        </div>

        <div class="w-full bg-gray-200 rounded-full h-2.5">
          <div
            class="h-2.5 rounded-full transition-all duration-300"
            :class="getProgressColor(calculatePercentage(envelope))"
            :style="{ width: `${Math.min(calculatePercentage(envelope), 100)}%` }"
          ></div>
        </div>

        <p class="text-sm text-gray-500 mt-1">
          {{ calculatePercentage(envelope).toFixed(1) }}% du budget utilisé
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { envelopesService } from '@/services/envelopes'
import type { Tables } from '@/types/supabase.types'

interface Props {
  period?: {
    startDate: string
    endDate: string
  }
}

const props = defineProps<Props>()

interface EnvelopeWithSpent extends Tables<'envelopes'> {
  expenses: Pick<Tables<'expenses'>, 'id' | 'amount' | 'date'>[]
}

const envelopes = ref<EnvelopeWithSpent[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

async function fetchEnvelopesWithSpent() {
  try {
    loading.value = true
    error.value = null
    envelopes.value = await envelopesService.getWithSpent(props.period)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Une erreur est survenue'
  } finally {
    loading.value = false
  }
}

onMounted(fetchEnvelopesWithSpent)

watch(() => props.period, fetchEnvelopesWithSpent)

function calculateSpent(envelope: EnvelopeWithSpent): number {
  return envelope.expenses.reduce((total, expense) => total + (expense.amount || 0), 0)
}

function calculatePercentage(envelope: EnvelopeWithSpent): number {
  const spent = calculateSpent(envelope)
  const total = envelope.amount || 0
  return total > 0 ? (spent / total) * 100 : 0
}

function getProgressColor(percentage: number): string {
  if (percentage >= 100) return 'bg-red-500'
  if (percentage >= 80) return 'bg-yellow-500'
  return 'bg-green-500'
}
</script>
