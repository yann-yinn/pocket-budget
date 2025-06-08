<template>
  <form @submit.prevent="handleSubmit" class="bg-white shadow-md rounded-lg p-6">
    <div class="space-y-4">
      <div>
        <label for="debutMois" class="block text-sm font-medium text-gray-700 mb-1"
          >Le mois commence le</label
        >
        <select
          id="debutMois"
          v-model="formValues.debutMois"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option v-for="day in 31" :key="day" :value="day.toString()">
            {{ day }}
          </option>
        </select>
      </div>

      <ButtonSubmit :loading="loading">Enregistrer les paramètres</ButtonSubmit>
    </div>
  </form>
  <div v-if="error" class="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
    {{ error }}
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '../../utils/supabase'
import ButtonSubmit from '../ui/ButtonSubmit.vue'

interface FormValues {
  debutMois: string
}

const formValues = ref<FormValues>({
  debutMois: '1',
})

const loading = ref(false)
const error = ref('')
const successMessage = ref<string | null>(null)

const fetchSettings = async () => {
  try {
    const { data, error: supabaseError } = await supabase
      .from('settings')
      .select('*')
      .eq('name', 'debutMois')
      .single()

    if (supabaseError) throw supabaseError

    if (data) {
      formValues.value.debutMois = data.value
    }
  } catch (err) {
    console.error('Erreur lors du chargement des paramètres:', err)
    error.value = 'Une erreur est survenue lors du chargement des paramètres'
  }
}

const handleSubmit = async () => {
  try {
    loading.value = true
    error.value = ''

    const { error: supabaseError } = await supabase
      .from('settings')
      .upsert({ name: 'debutMois', value: formValues.value.debutMois }, { onConflict: 'name' })

    if (supabaseError) throw supabaseError

    successMessage.value = 'Paramètres sauvegardés avec succès'
    setTimeout(() => {
      successMessage.value = null
    }, 3000)
  } catch (err) {
    console.error('Erreur lors de la sauvegarde des paramètres:', err)
    error.value = 'Erreur lors de la sauvegarde des paramètres'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchSettings()
})
</script>
