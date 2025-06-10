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
            <button class="text-red-600 hover:text-red-800" @click="showArchiveModal(envelope)">
              Archiver
            </button>
          </div>
        </div>
      </div>
    </div>

    <ArchiveEnvelopeModal
      v-if="selectedEnvelope"
      v-model="isArchiveModalOpen"
      :envelope="selectedEnvelope"
      @archived="$emit('archived')"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Tables } from '@/types/supabase.types'
import ArchiveEnvelopeModal from '@/components/envelopes/ArchiveEnvelopeModal.vue'

defineProps<{
  envelopes: Tables<'envelopes'>[]
}>()

defineEmits<{
  (e: 'archived'): void
}>()

const isArchiveModalOpen = ref(false)
const selectedEnvelope = ref<Tables<'envelopes'> | null>(null)

function showArchiveModal(envelope: Tables<'envelopes'>) {
  selectedEnvelope.value = envelope
  isArchiveModalOpen.value = true
}
</script>
