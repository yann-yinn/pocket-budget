<template>
  <form @submit.prevent="handleSubmit" class="bg-white shadow-md rounded-lg p-6">
    <div class="space-y-4">
      <InputText v-model="formValues.name" required placeholder="Nom de l'enveloppe">
        <template #label>Nom de l'enveloppe</template>
      </InputText>

      <InputNumber v-model="formValues.amount" required :min="0" :step="0.01" placeholder="Montant">
        <template #label>Montant</template>
      </InputNumber>

      <ButtonSubmit :loading="saveRequest.isLoading.value" />

      <pre>
        {{ saveRequest }}
      </pre>
    </div>
  </form>
  <FormError :error="saveRequest.error.value" />
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import InputText from '@/components/ui/InputText.vue'
import InputNumber from '@/components/ui/InputNumber.vue'
import ButtonSubmit from '@/components/ui/ButtonSubmit.vue'
import FormError from '@/components/ui/FormError.vue'
import { envelopesService } from '@/services/envelopes'
import type { TablesInsert } from '@/types/supabase.types'
import { extractErrorMessage } from '@/utils/helpers'

interface FormValues {
  name: string
  amount: number
}

const formValues = reactive<FormValues>(initFormValues())

const saveRequest = useAsync()
console.log('saveRequest', saveRequest)

function initFormValues() {
  return {
    name: '',
    amount: 0,
  }
}

function prepareValuesForSaving(formValues: FormValues) {
  const values: TablesInsert<'envelopes'> = {
    name: formValues.name,
    amount: formValues.amount,
  }
  return values
}

async function handleSubmit() {
  const envelope = prepareValuesForSaving(formValues)
  const data = await saveRequest.execute(() => envelopesService.create(envelope))
  console.log(data)
}

function useAsync() {
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function execute<T>(promiseFn: () => Promise<T>) {
    let data: T | null = null
    isLoading.value = true
    error.value = null
    try {
      data = await promiseFn()
    } catch (err) {
      error.value = extractErrorMessage(err)
    } finally {
      isLoading.value = false
    }
    return data
  }

  return {
    isLoading,
    error,
    execute,
  }
}
</script>
