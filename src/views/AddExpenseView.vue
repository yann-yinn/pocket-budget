<template>
  <div class="add-expense">
    <h1>Ajouter une dépense</h1>
    <form @submit.prevent="handleSubmit">
      <input type="text" name="amount" placeholder="Montant" v-model="amount" />
      <input type="date" name="date" placeholder="Date" v-model="date" />
      <input type="submit" value="Sauver" />
    </form>
    <div class="debug">
      <p>amount: {{ amount }}</p>
      <p>date: {{ date }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const amount = ref(0)
const date = ref('')

function handleSubmit(event: Event) {
  event.preventDefault()
  alert('submit')
}
</script>
