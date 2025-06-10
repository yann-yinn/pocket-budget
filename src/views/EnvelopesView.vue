<template>
  <div class="max-w-4xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Enveloppes budgétaires</h1>
      <RouterLink
        to="/add-envelope"
        class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
      >
        Ajouter une enveloppe
      </RouterLink>
    </div>

    <EnvelopeList @edit="handleEdit" @delete="handleDelete" />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import EnvelopeList from '@/components/EnvelopeList.vue'
import type { Tables } from '@/types/supabase.types'

const router = useRouter()

function handleEdit(envelope: Tables<'envelopes'>) {
  console.log('Edit envelope:', envelope)
  // TODO: Implémenter l'édition
}

function handleDelete(envelope: Tables<'envelopes'>) {
  console.log('Delete envelope:', envelope)
  // TODO: Implémenter la suppression
}
</script>
