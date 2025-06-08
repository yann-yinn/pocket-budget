<script setup lang="ts">
import { ref, onMounted } from 'vue'
import EnvelopeList from '../components/EnvelopeList.vue'
import EnvelopeProgress from '../components/EnvelopeProgress.vue'
import PeriodSelector from '../components/PeriodSelector.vue'

const periodSelector = ref()
const currentPeriod = ref({
  startDate: new Date(),
  endDate: new Date(),
})

onMounted(() => {
  if (periodSelector.value) {
    currentPeriod.value = periodSelector.value.currentPeriod
  }
})
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Tableau de bord</h1>
    <div class="space-y-6">
      <PeriodSelector ref="periodSelector" />
      <EnvelopeProgress :period="currentPeriod" />
      <EnvelopeList />
    </div>
  </div>
</template>
