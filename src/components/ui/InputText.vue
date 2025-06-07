<script setup lang="ts">
defineProps<{
  modelValue: string
  label?: string
  id?: string
  name?: string
  required?: boolean
  placeholder?: string
  error?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

function onInput(event: Event) {
  const value = (event.target as HTMLInputElement).value
  emit('update:modelValue', value)
}
</script>

<template>
  <div>
    <label v-if="$slots.label" for="name" class="block text-sm font-medium text-gray-700 mb-1">
      <slot name="label" />
    </label>
    <input
      type="text"
      :id="id"
      :name="name"
      :value="modelValue"
      :required="required"
      :placeholder="placeholder"
      @input="onInput"
      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
  </div>
</template>
