<template>
  <form @submit.prevent="handleSubmit" class="bg-white shadow-md rounded-lg p-6">
    <div class="space-y-4">
      <InputNumber v-model="formValues.amount" required :min="0" :step="0.01" placeholder="Montant">
        <template #label>Montant</template>
      </InputNumber>

      <InputText v-model="formValues.date" required placeholder="Date">
        <template #label>Date</template>
      </InputText>

      <InputText
        v-model="formValues.envelope_id"
        required
        placeholder="Identifiant de la enveloppe"
      >
        <template #label>Identifiant de la enveloppe</template>
      </InputText>

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
import { expensesService } from '@/services/expenses'
import type { TablesInsert } from '@/types/supabase.types'

interface FormValues {
  amount: number
  date: string
  envelope_id: string
}

const router = useRouter()
const formValues = ref<FormValues>({
  amount: 0,
  date: new Date().toISOString().split('T')[0],
  envelope_id: '',
})
const error = ref<string | null>(null)
const loading = ref(false)

async function handleSubmit() {
  try {
    loading.value = true
    error.value = null

    const values: TablesInsert<'expenses'> = {
      amount: formValues.value.amount,
      date: formValues.value.date,
      envelope_id: formValues.value.envelope_id,
    }

    await expensesService.create(values)
    router.push('/')
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Une erreur est survenue'
  } finally {
    loading.value = false
  }
}
</script>
