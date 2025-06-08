<template>
  <form @submit.prevent="handleSubmit" class="bg-white shadow-md rounded-lg p-6">
    <div class="space-y-4">
      <InputText v-model="formValues.name" required placeholder="Nom de l'enveloppe">
        <template #label>Nom de l'enveloppe</template>
      </InputText>

      <InputNumber v-model="formValues.amount" required :min="0" :step="0.01" placeholder="Montant">
        <template #label>Montant</template>
      </InputNumber>

      <ButtonSubmit :loading="insertRequestState === RequestState.Pending" />
    </div>
  </form>
  <FormError :error="error" />
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import InputText from '../ui/InputText.vue'
import InputNumber from '../ui/InputNumber.vue'
import ButtonSubmit from '../ui/ButtonSubmit.vue'
import FormError from '../ui/FormError.vue'
import { insertEnvelope } from '@/services/envelopes'

interface FormValues {
  name: string
  amount: string
}

enum RequestState {
  Idle = 'idle',
  Pending = 'pending',
  Success = 'success',
  Error = 'error',
}

const error = ref('')
const insertRequestState = ref<RequestState>(RequestState.Idle)

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

const handleSubmit = async () => {
  const values = prepareValuesForSave(formValues)
  try {
    insertRequestState.value = RequestState.Pending
    error.value = ''

    const result = await insertEnvelope(values)

    if (result.data && result.data.length > 0) {
      const newEnvelope = result.data[0]
      console.log('Enveloppe créée:', newEnvelope)
      insertRequestState.value = RequestState.Success
    } else {
      throw new Error('Aucune donnée retournée')
    }
  } catch (err) {
    insertRequestState.value = RequestState.Error
    console.error("Erreur lors de l'ajout de l'enveloppe:", err)
    error.value = "Une erreur est survenue lors de l'enregistrement de l'enveloppe"
  }
}
</script>
