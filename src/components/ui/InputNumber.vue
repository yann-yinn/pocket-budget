<script setup lang="ts">
interface Props {
  modelValue: number
  id?: string
  label?: string
  placeholder?: string
  required?: boolean
  min?: number
  step?: number
}

const props = withDefaults(defineProps<Props>(), {
  id: undefined,
  label: undefined,
  placeholder: undefined,
  required: false,
  min: undefined,
  step: 1,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value ? parseFloat(target.value) : 0
  emit('update:modelValue', value)
}
</script>

<template>
  <div>
    <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
    </label>
    <input
      :id="id"
      type="number"
      :value="modelValue"
      @input="handleInput"
      :placeholder="placeholder"
      :required="required"
      :min="min"
      :step="step"
      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
  </div>
</template>
