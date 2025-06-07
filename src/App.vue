<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/add-expense">Ajouter une dépense</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>
