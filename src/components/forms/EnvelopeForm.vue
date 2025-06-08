<template>
  <form @submit.prevent="handleSubmit" class="bg-white shadow-md rounded-lg p-6">
    <div class="space-y-4">
      <InputText v-model="formValues.name" required placeholder="Nom de l'enveloppe">
        <template #label>Nom de l'enveloppe</template>
      </InputText>

      <InputNumber v-model="formValues.amount" required :min="0" :step="0.01" placeholder="Montant">
        <template #label>Montant</template>
      </InputNumber>

      <ButtonSubmit :loading="loading" />
    </div>
  </form>
  <FormError :error="error" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import InputText from '@/components/ui/InputText.vue'
import InputNumber from '@/components/ui/InputNumber.vue'
import ButtonSubmit from '@/components/ui/ButtonSubmit.vue'
import FormError from '@/components/ui/FormError.vue'
import { envelopesService } from '@/services/envelopes'
import type { TablesInsert } from '@/types/supabase.types'

interface FormValues {
  name: string
  amount: number
}

const router = useRouter()
const formValues = ref<FormValues>({
  name: '',
  amount: 0,
})
const error = ref<string | null>(null)
const loading = ref(false)

async function handleSubmit() {
  try {
    loading.value = true
    error.value = null

    const values: TablesInsert<'envelopes'> = {
      name: formValues.value.name,
      amount: formValues.value.amount,
    }

    await envelopesService.create(values)
    router.push('/')
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Une erreur est survenue'
  } finally {
    loading.value = false
  }
}
</script>
