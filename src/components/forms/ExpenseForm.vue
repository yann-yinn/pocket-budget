<template>
  <form @submit.prevent="handleSubmit" class="bg-white shadow-md rounded-lg p-6">
    <div class="space-y-4">
      <InputNumber v-model="formValues.amount" required :min="0" :step="0.01" placeholder="Montant">
        <template #label>Montant</template>
      </InputNumber>

      <div>
        <label for="date" class="block text-sm font-medium text-gray-700 mb-1">Date</label>
        <input
          type="date"
          id="date"
          v-model="formValues.date"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label for="envelope" class="block text-sm font-medium text-gray-700 mb-1">Enveloppe</label>
        <select
          id="envelope"
          v-model="formValues.envelope_id"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="" disabled>Sélectionner une enveloppe</option>
          <option v-for="envelope in envelopes" :key="envelope.id" :value="envelope.id">
            {{ envelope.name }}
          </option>
        </select>
      </div>

      <ButtonSubmit :loading="loading">Ajouter la dépense</ButtonSubmit>
    </div>
  </form>
  <div v-if="error" class="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
    {{ error }}
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../../utils/supabase'
import type { Envelope } from '../../types/database'
import InputNumber from '../ui/InputNumber.vue'
import ButtonSubmit from '../ui/ButtonSubmit.vue'

interface FormValues {
  amount: number
  date: string
  envelope_id: string
}

const router = useRouter()
const loading = ref(false)
const error = ref('')
const envelopes = ref<Envelope[]>([])

const formValues = ref<FormValues>({
  amount: 0,
  date: new Date().toISOString().split('T')[0],
  envelope_id: '',
})

const fetchEnvelopes = async () => {
  try {
    const { data, error: supabaseError } = await supabase
      .from('envelopes')
      .select('*')
      .or('archived.is.null,archived.eq.false')
      .order('name')

    if (supabaseError) throw supabaseError
    envelopes.value = data || []
  } catch (err) {
    console.error('Erreur lors du chargement des enveloppes:', err)
    error.value = 'Une erreur est survenue lors du chargement des enveloppes'
  }
}

const handleSubmit = async () => {
  try {
    loading.value = true
    error.value = ''

    const { error: supabaseError } = await supabase.from('expenses').insert({
      amount: formValues.value.amount,
      date: formValues.value.date,
      envelope_id: formValues.value.envelope_id,
    })

    if (supabaseError) throw supabaseError

    router.push('/expenses')
  } catch (err) {
    console.error("Erreur lors de l'ajout de la dépense:", err)
    error.value = "Une erreur est survenue lors de l'ajout de la dépense"
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchEnvelopes()
})
</script>
