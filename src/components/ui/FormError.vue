<script setup lang="ts">
interface Props {
  error: string
}

defineProps<Props>()
</script>

<template>
  <div v-if="error" class="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
    {{ error }}
  </div>
</template>
