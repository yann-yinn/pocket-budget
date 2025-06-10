<template>
  <div class="max-w-md mx-auto">
    <h1 class="text-2xl font-bold text-gray-900 mb-6 text-center">
      Editer une enveloppe budgétaire
    </h1>
    <EnvelopeForm v-if="envelope" :envelope="envelope" />
  </div>
</template>

<script setup lang="ts">
import EnvelopeForm from '@/components/forms/EnvelopeForm.vue'
import useAsync from '@/composables/useAsync'
import { onMounted, ref } from 'vue'
import { envelopesService } from '@/services/envelopes'
import type { Tables } from '@/types/supabase.types'
import { useRoute } from 'vue-router'

const fetchRequest = useAsync()
const envelope = ref<Tables<'envelopes'>>()
const route = useRoute()
const envelopeId = route.params.id as string

onMounted(fetchEnvelopes)

async function fetchEnvelopes() {
  const data = await fetchRequest.execute(() => envelopesService.getById(envelopeId))
  if (data) {
    envelope.value = data
  }
}
</script>
