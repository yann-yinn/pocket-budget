<template>
  <form @submit.prevent="handleSubmit" class="bg-white shadow-md rounded-lg p-6">
    <div class="space-y-4">
      <div>
        <InputText id="name" v-model="formValues.name" placeholder="Nom de l'envelope">
          <template #label>Nom de l'envelope</template>
        </InputText>
      </div>

      <div>
        <InputNumber v-model="formValues.amount" :step="0.01">
          <template #label>Montant</template>
        </InputNumber>
      </div>

      <button
        type="submit"
        class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
        :disabled="isLoading"
      >
        {{ isLoading ? 'Enregistrement...' : 'Sauvegarder' }}
      </button>
    </div>
    <div v-if="error" class="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
      {{ error }}
    </div>
    <div class="debug mt-4 p-4 bg-gray-100 rounded-md">
      <pre class="text-sm">{{ formValues }}</pre>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../utils/supabase'
import type { Envelope } from '../types/database'
import InputText from './Form/InputText.vue'
import InputNumber from './Form/InputNumber.vue'

const props = defineProps<{
  envelope: Envelope
}>()

interface Form {
  name: string
  amount: string
}

const router = useRouter()
const isLoading = ref(false)
const error = ref('')

initForm(props.envelope)

const formValues = reactive<Form>(initForm(props.envelope))

function initForm(envelope: Envelope) {
  const formValues = {
    name: envelope.name ? envelope.name : '',
    amount: envelope.amount ? envelope.amount.toString() : '',
  }
  return formValues
}

const handleSubmit = async () => {
  try {
    isLoading.value = true
    error.value = ''

    const { data, error: supabaseError } = await supabase
      .from('envelopes')
      .insert([
        {
          name: formValues.name,
          amount: parseFloat(formValues.amount),
          created_at: new Date().toISOString(),
        },
      ])
      .select()

    if (supabaseError) throw supabaseError

    if (data && data.length > 0) {
      console.log('Enveloppe créée:', data[0])
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
