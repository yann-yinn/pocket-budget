<template>
  <form @submit.prevent="handleSubmit" class="bg-white shadow-md rounded-lg p-6">
    <div class="space-y-4">
      <InputText v-model="formValues.name" required placeholder="Nom de l'enveloppe">
        <template #label>Nom de l'enveloppe</template>
      </InputText>

      <InputNumber v-model="formValues.amount" required :min="0" :step="0.01" placeholder="Montant">
        <template #label>Montant</template>
      </InputNumber>

      <ButtonSubmit :loading="isLoading" />
    </div>
  </form>
  <FormError :error="error" />
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../../utils/supabase'
import InputText from '../ui/InputText.vue'
import InputNumber from '../ui/InputNumber.vue'
import ButtonSubmit from '../ui/ButtonSubmit.vue'
import FormError from '../ui/FormError.vue'
import type { TablesInsert } from '@/types/supabase.types'

interface FormValues {
  name: string
  amount: string
}

const router = useRouter()
const isLoading = ref(false)
const error = ref('')

const formValues = reactive<FormValues>({
  name: '',
  amount: '',
})

function prepareValuesForSave(formValues: FormValues) {
  const values = {
    name: formValues.name,
    amount: parseFloat(formValues.amount),
  }
  return values
}

async function insertEnvelope(values: TablesInsert<'envelopes'>) {
  const result = await supabase.from('envelopes').insert([values]).select()
  return result
}

const handleSubmit = async () => {
  const values = prepareValuesForSave(formValues)
  try {
    error.value = ''
    isLoading.value = true

    const result = await insertEnvelope(values)

    console.log('result', result)
    if (result.error) throw error

    if (result.data && result.data.length > 0) {
      console.log('Enveloppe créée:', result.data[0])
      router.push('/')
    } else {
      throw new Error('Aucune donnée retournée')
    }
  } catch (err) {
    console.error("Erreur lors de l'ajout de l'enveloppe:", err)
    error.value = "Une erreur est survenue lors de l'enregistrement de l'enveloppe"
  } finally {
    isLoading.value = false
  }
}
</script>
