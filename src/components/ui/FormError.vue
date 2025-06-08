<script setup lang="ts">
defineProps<{
  error: string | null
}>()
</script>

<template>
  <p v-if="error" class="text-red-500 text-sm mt-2">{{ error }}</p>
</template>
