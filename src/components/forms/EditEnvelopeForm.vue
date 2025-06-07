<template>
  <form @submit.prevent="handleSubmit" class="bg-white shadow-md rounded-lg p-6">
    <div class="space-y-4">
      <InputText v-model="form.name" required placeholder="Nom de l'enveloppe">
        <template #label>Nom de l'enveloppe</template>
      </InputText>

      <InputNumber v-model="form.amount" required :min="0" :step="0.01" placeholder="Montant">
        <template #label>Montant</template>
      </InputNumber>

      <ButtonSubmit :loading="isLoading" />
    </div>
  </form>
  <div v-if="error" class="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
    {{ error }}
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { supabase } from '../../utils/supabase'
import InputText from '../ui/InputText.vue'
import InputNumber from '../ui/InputNumber.vue'
import ButtonSubmit from '../ui/ButtonSubmit.vue'
import type { Envelope } from '../../types/database'

const router = useRouter()
const route = useRoute()
const isLoading = ref(false)
const error = ref('')

const form = reactive({
  name: '',
  amount: '',
})

const fetchEnvelope = async () => {
  try {
    const { data, error: supabaseError } = await supabase
      .from('envelopes')
      .select('*')
      .eq('id', route.params.id)
      .single()

    if (supabaseError) throw supabaseError

    if (data) {
      form.name = data.name
      form.amount = data.amount.toString()
    }
  } catch (err) {
    console.error("Erreur lors du chargement de l'enveloppe:", err)
    error.value = "Une erreur est survenue lors du chargement de l'enveloppe"
  }
}

const handleSubmit = async () => {
  try {
    isLoading.value = true
    error.value = ''

    const { data, error: supabaseError } = await supabase
      .from('envelopes')
      .update({
        name: form.name,
        amount: parseFloat(form.amount),
      })
      .eq('id', route.params.id)
      .select()

    if (supabaseError) throw supabaseError

    if (data && data.length > 0) {
      console.log('Enveloppe mise à jour:', data[0])
      router.push('/')
    } else {
      throw new Error('Aucune donnée retournée')
    }
  } catch (err) {
    console.error("Erreur lors de la mise à jour de l'enveloppe:", err)
    error.value = "Une erreur est survenue lors de la mise à jour de l'enveloppe"
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchEnvelope()
})
</script>
