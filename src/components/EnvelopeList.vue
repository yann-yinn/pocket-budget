<template>
  <div class="space-y-4">
    <div v-if="fetchRequest.loading.value" class="text-center py-4">
      <p class="text-gray-500">Chargement...</p>
    </div>

    <div v-else-if="fetchRequest.error.value" class="text-center py-4">
      <p class="text-red-500">{{ fetchRequest.error.value }}</p>
    </div>

    <EnvelopeListItems v-else :envelopes="envelopes" @archived="fetchEnvelopes" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { envelopesService } from '@/services/envelopes'
import type { Tables } from '@/types/supabase.types'
import useAsync from '@/composables/useAsync'
import EnvelopeListItems from '@/components/ui/EnvelopeListItems.vue'

type Envelope = Tables<'envelopes'>
const envelopes = ref<Envelope[]>([])
const fetchRequest = useAsync()

async function fetchEnvelopes() {
  const data = await fetchRequest.execute(() => envelopesService.getAll())
  if (data) {
    envelopes.value = data
  }
}

onMounted(fetchEnvelopes)
</script>
