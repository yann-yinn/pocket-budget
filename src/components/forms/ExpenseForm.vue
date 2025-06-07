<template>
  <form @submit.prevent="handleSubmit" class="bg-white shadow-md rounded-lg p-6">
    <div class="space-y-4">
      <InputText v-model="form.name" required placeholder="Nom de la dépense">
        <template #label>Nom de la dépense</template>
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
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../../utils/supabase'
import InputText from '../ui/InputText.vue'
import InputNumber from '../ui/InputNumber.vue'
import ButtonSubmit from '../ui/ButtonSubmit.vue'

interface Form {
  name: string
  amount: string
}

const router = useRouter()
const isLoading = ref(false)
const error = ref('')

const form = reactive<Form>({
  name: '',
  amount: '',
})

const handleSubmit = async () => {
  try {
    isLoading.value = true
    error.value = ''

    const { data, error: supabaseError } = await supabase
      .from('expenses')
      .insert([
        {
          name: form.name,
          amount: parseFloat(form.amount),
          created_at: new Date().toISOString(),
        },
      ])
      .select()

    if (supabaseError) throw supabaseError

    if (data && data.length > 0) {
      console.log('Dépense créée:', data[0])
      router.push('/')
    } else {
      throw new Error('Aucune donnée retournée')
    }
  } catch (err) {
    console.error("Erreur lors de l'ajout de la dépense:", err)
    error.value = "Une erreur est survenue lors de l'enregistrement de la dépense"
  } finally {
    isLoading.value = false
  }
}
</script>
