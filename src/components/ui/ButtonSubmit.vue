<script setup lang="ts">
defineProps<{
  loading?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}>()
</script>

<template>
  <button
    :type="type || 'submit'"
    :disabled="disabled || loading"
    class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <slot>{{ loading ? 'Chargement...' : 'Sauvegarder' }}</slot>
  </button>
</template>
