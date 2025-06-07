<template>
  <div class="max-w-md mx-auto">
    <h1 class="text-2xl font-bold text-gray-900 mb-6 text-center">
      Ajouter une enveloppe budgétaire
    </h1>
    <EnvelopeForm :envelope="envelope" />
  </div>
</template>

<script setup lang="ts">
import EnvelopeForm from '@/components/EnvelopeForm.vue'
import { ref } from 'vue'
import type { Envelope } from '@/types/database'
const envelope = ref<Envelope>({ id: 0, name: '', amount: 10, created_at: '' })
</script>
