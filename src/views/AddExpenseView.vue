<template>
  <div class="max-w-md mx-auto">
    <h1 class="text-2xl font-bold text-gray-900 mb-6 text-center">Ajouter une dépense</h1>
    <form @submit.prevent="handleSubmit" class="bg-white shadow-md rounded-lg p-6">
      <div class="space-y-4">
        <div>
          <label for="title" class="block text-sm font-medium text-gray-700 mb-1">Titre</label>
          <input
            type="text"
            id="title"
            v-model="expense.title"
            required
            placeholder="Ex: Courses alimentaires"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label for="amount" class="block text-sm font-medium text-gray-700 mb-1">Montant</label>
          <input
            type="number"
            id="amount"
            v-model="expense.amount"
            required
            min="0"
            step="0.01"
            placeholder="0.00"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label for="date" class="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input
            type="date"
            id="date"
            v-model="expense.date"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label for="category" class="block text-sm font-medium text-gray-700 mb-1"
            >Catégorie</label
          >
          <select
            id="category"
            v-model="expense.category"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Sélectionnez une catégorie</option>
            <option value="alimentation">Alimentation</option>
            <option value="transport">Transport</option>
            <option value="logement">Logement</option>
            <option value="loisirs">Loisirs</option>
            <option value="autre">Autre</option>
          </select>
        </div>

        <div>
          <label for="description" class="block text-sm font-medium text-gray-700 mb-1"
            >Description</label
          >
          <textarea
            id="description"
            v-model="expense.description"
            placeholder="Description de la dépense (optionnel)"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px] resize-y"
          ></textarea>
        </div>

        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
        >
          Ajouter la dépense
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const expense = ref({
  title: '',
  amount: '',
  date: new Date().toISOString().split('T')[0],
  category: '',
  description: '',
})

const handleSubmit = async () => {
  try {
    // TODO: Implémenter la logique d'ajout de dépense
    console.log('Dépense à ajouter:', expense.value)
    // Redirection vers la page d'accueil après l'ajout
    router.push('/')
  } catch (error) {
    console.error("Erreur lors de l'ajout de la dépense:", error)
  }
}
</script>
