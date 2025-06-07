<template>
  <div class="max-w-md mx-auto">
    <h1 class="text-2xl font-bold text-gray-900 mb-6 text-center">Ajouter une dépense</h1>
    <form @submit.prevent="handleSubmit" class="bg-white shadow-md rounded-lg p-6">
      <div class="space-y-4">
        <div>
          <label for="amount" class="block text-sm font-medium text-gray-700 mb-1">Montant</label>
          <input
            type="number"
            step="0.01"
            id="amount"
            v-model="form.amount"
            placeholder="Montant"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label for="date" class="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input
            type="date"
            id="date"
            v-model="form.date"
            placeholder="Date"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
        >
          Ajouter la dépense
        </button>
      </div>
    </form>
    <div class="debug mt-4 p-4 bg-gray-100 rounded-md">
      <pre class="text-sm">{{ form }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = reactive({
  amount: '',
  date: new Date().toISOString().split('T')[0],
})

const handleSubmit = async () => {
  try {
    // TODO: Implémenter la logique d'ajout de dépense
    console.log('Dépense à ajouter:', form)
    // Redirection vers la page d'accueil après l'ajout
    router.push('/')
  } catch (error) {
    console.error("Erreur lors de l'ajout de la dépense:", error)
  }
}
</script>
