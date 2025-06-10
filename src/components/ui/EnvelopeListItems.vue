<template>
  <div class="space-y-4">
    <div v-if="envelopes.length === 0" class="text-center py-4">
      <p class="text-gray-500">Aucune enveloppe trouvée</p>
    </div>

    <div v-else class="space-y-4">
      <div v-for="envelope in envelopes" :key="envelope.id" class="bg-white p-4 rounded-lg shadow">
        <div class="flex justify-between items-center">
          <div>
            <h3 class="text-lg font-medium text-gray-900">{{ envelope.name }}</h3>
            <p class="text-sm text-gray-500">{{ envelope.amount?.toFixed(2) }}€</p>
          </div>
          <div class="flex items-center space-x-2">
            <RouterLink
              :to="`/envelopes/${envelope.id}/edit`"
              class="text-blue-600 hover:text-blue-800"
            >
              Modifier
            </RouterLink>
            <button class="text-red-600 hover:text-red-800" @click="$emit('delete', envelope)">
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Tables } from '@/types/supabase.types'

defineProps<{
  envelopes: Tables<'envelopes'>[]
}>()

defineEmits<{
  (e: 'delete', envelope: Tables<'envelopes'>): void
}>()
</script>
