<template>
  <form @submit.prevent="handleSubmit" class="bg-white shadow-md rounded-lg p-6">
    <div class="space-y-4">
      <InputNumber v-model="formValues.amount" required :min="0" :step="0.01" placeholder="Montant">
        <template #label>Montant</template>
      </InputNumber>

      <InputText v-model="formValues.date" required type="date" placeholder="Date">
        <template #label>Date</template>
      </InputText>

      <ButtonSubmit :loading="saveRequest.loading.value" />
    </div>
  </form>
  <FormError :error="saveRequest.error.value" />
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import InputText from '@/components/ui/InputText.vue'
import InputNumber from '@/components/ui/InputNumber.vue'
import ButtonSubmit from '@/components/ui/ButtonSubmit.vue'
import FormError from '@/components/ui/FormError.vue'
import { expensesService } from '@/services/expenses'
import type { TablesInsert } from '@/types/supabase.types'
import useAsync from '@/composables/useAsync'

interface FormValues {
  amount: number
  date: string
}

const router = useRouter()
const formValues = reactive<FormValues>(initFormValues())
const saveRequest = useAsync()

function initFormValues() {
  return {
    amount: 0,
    date: new Date().toISOString().split('T')[0],
  }
}

function prepareValuesForSaving(formValues: FormValues) {
  const values: TablesInsert<'expenses'> = {
    amount: formValues.amount,
    date: formValues.date,
  }
  return values
}

async function handleSubmit() {
  const expense = prepareValuesForSaving(formValues)
  const data = await saveRequest.execute(() => expensesService.create(expense))
  console.log('data', data)
  if (data) {
    router.push('/')
  }
}
</script>
