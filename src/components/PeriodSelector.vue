<template>
  <div class="bg-white shadow-md rounded-lg p-6">
    <div class="flex justify-between items-center">
      <button
        @click="previousPeriod"
        class="p-2 text-gray-600 hover:text-gray-900 focus:outline-none transition-colors duration-200"
        :disabled="loading"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <div class="text-center">
        <h2 class="text-xl font-semibold text-gray-900">{{ formatPeriodTitle }}</h2>
        <p class="text-sm text-gray-500">{{ formatPeriodDates }}</p>
      </div>
      <button
        @click="nextPeriod"
        class="p-2 text-gray-600 hover:text-gray-900 focus:outline-none transition-colors duration-200"
        :disabled="loading"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
    <div class="mt-4 flex justify-center">
      <button
        @click="goToCurrentPeriod"
        class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 focus:outline-none transition-colors duration-200"
        :disabled="loading || isCurrentPeriod"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 mr-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Retour à la période actuelle
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { supabase } from '../utils/supabase'

interface Period {
  startDate: Date
  endDate: Date
}

const loading = ref(true)
const currentPeriod = ref<Period>({
  startDate: new Date(),
  endDate: new Date(),
})

const isCurrentPeriod = computed(() => {
  const now = new Date()
  return (
    currentPeriod.value.startDate.getTime() === getCurrentPeriodStart().getTime() &&
    currentPeriod.value.endDate.getTime() === getCurrentPeriodEnd().getTime()
  )
})

const fetchSettings = async () => {
  try {
    const { data, error: supabaseError } = await supabase
      .from('settings')
      .select('*')
      .eq('name', 'debutMois')
      .single()

    if (supabaseError) throw supabaseError

    const startDay = data ? parseInt(data.value) : 1
    updatePeriod(startDay)
  } catch (err) {
    console.error('Erreur lors du chargement des paramètres:', err)
  } finally {
    loading.value = false
  }
}

const getCurrentPeriodStart = () => {
  const now = new Date()
  const startDay = parseInt(localStorage.getItem('debutMois') || '1')
  const currentDay = now.getDate()

  if (currentDay >= startDay) {
    return new Date(now.getFullYear(), now.getMonth(), startDay)
  } else {
    return new Date(now.getFullYear(), now.getMonth() - 1, startDay)
  }
}

const getCurrentPeriodEnd = () => {
  const startDate = getCurrentPeriodStart()
  const endDate = new Date(startDate)
  endDate.setMonth(endDate.getMonth() + 1)
  endDate.setDate(endDate.getDate() - 1)
  return endDate
}

const updatePeriod = (startDay: number) => {
  const now = new Date()
  const currentDay = now.getDate()
  let startDate: Date
  let endDate: Date

  if (currentDay >= startDay) {
    // La période en cours a commencé ce mois-ci
    startDate = new Date(now.getFullYear(), now.getMonth(), startDay)
    endDate = new Date(now.getFullYear(), now.getMonth() + 1, startDay - 1)
  } else {
    // La période en cours a commencé le mois dernier
    startDate = new Date(now.getFullYear(), now.getMonth() - 1, startDay)
    endDate = new Date(now.getFullYear(), now.getMonth(), startDay - 1)
  }

  currentPeriod.value = { startDate, endDate }
  localStorage.setItem('debutMois', startDay.toString())
}

const previousPeriod = () => {
  const { startDate, endDate } = currentPeriod.value
  const newStartDate = new Date(startDate)
  newStartDate.setDate(newStartDate.getDate() - (endDate.getDate() - startDate.getDate() + 1))
  const newEndDate = new Date(startDate)
  newEndDate.setDate(newEndDate.getDate() - 1)
  currentPeriod.value = { startDate: newStartDate, endDate: newEndDate }
}

const nextPeriod = () => {
  const { startDate, endDate } = currentPeriod.value
  const newStartDate = new Date(endDate)
  newStartDate.setDate(newStartDate.getDate() + 1)
  const newEndDate = new Date(newStartDate)
  newEndDate.setDate(newEndDate.getDate() + (endDate.getDate() - startDate.getDate()))
  currentPeriod.value = { startDate: newStartDate, endDate: newEndDate }
}

const goToCurrentPeriod = () => {
  const startDay = parseInt(localStorage.getItem('debutMois') || '1')
  updatePeriod(startDay)
}

const formatPeriodTitle = computed(() => {
  const { startDate, endDate } = currentPeriod.value
  const startMonth = startDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
  const endMonth = endDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
  return startMonth === endMonth ? startMonth : `${startMonth} - ${endMonth}`
})

const formatPeriodDates = computed(() => {
  const { startDate, endDate } = currentPeriod.value
  const startDay = startDate.getDate()
  const endDay = endDate.getDate()
  const startMonth = startDate.toLocaleDateString('fr-FR', { month: 'long' })
  const endMonth = endDate.toLocaleDateString('fr-FR', { month: 'long' })

  if (startMonth === endMonth) {
    return `${startDay} - ${endDay} ${startMonth}`
  }
  return `${startDay} ${startMonth} - ${endDay} ${endMonth}`
})

onMounted(() => {
  fetchSettings()
})

// Exposer les dates pour les composants parents
defineExpose({
  currentPeriod,
})
</script>
