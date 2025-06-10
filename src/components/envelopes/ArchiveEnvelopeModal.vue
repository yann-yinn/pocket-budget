<template>
  <BaseModal
    v-model="isOpen"
    title="Archiver l'enveloppe"
    confirm-text="Archiver"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  >
    <p class="text-gray-600">
      Êtes-vous sûr de vouloir archiver l'enveloppe "{{ envelope?.name }}" ?
    </p>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Tables } from '@/types/supabase.types'
import BaseModal from '@/components/ui/Modal.vue'
import { envelopesService } from '@/services/envelopes'

const props = defineProps<{
  modelValue: boolean
  envelope: Tables<'envelopes'>
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'archived'): void
}>()

const isOpen = ref(props.modelValue)

async function handleConfirm() {
  await envelopesService.update(props.envelope.id, { archived: true })
  emit('archived')
  handleCancel()
}

function handleCancel() {
  isOpen.value = false
  emit('update:modelValue', false)
}
</script>
