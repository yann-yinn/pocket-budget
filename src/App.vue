<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-white shadow-sm">
      <nav class="px-4 py-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <RouterLink
              to="/"
              class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              active-class="bg-gray-100 text-gray-900"
            >
              Accueil
            </RouterLink>
            <RouterLink
              to="/add-expense"
              class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              active-class="bg-gray-100 text-gray-900"
            >
              Ajouter une dépense
            </RouterLink>
          </div>
        </div>
      </nav>
    </header>

    <main class="container mx-auto px-4 py-6">
      <RouterView />
    </main>
  </div>
</template>
