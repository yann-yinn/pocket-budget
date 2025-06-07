<template>
  <div class="bg-white shadow-md rounded-lg p-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold text-gray-900">Enveloppes budgétaires</h2>
      <RouterLink
        to="/add-envelope"
        class="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fill-rule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clip-rule="evenodd"
          />
        </svg>
        Créer une enveloppe
      </RouterLink>
    </div>
    <div v-if="loading" class="text-center py-4">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
    </div>
    <div v-else-if="error" class="p-4 bg-red-100 text-red-700 rounded-md">
      {{ error }}
    </div>
    <div v-else-if="envelopes.length === 0" class="text-center py-4 text-gray-500">
      Aucune enveloppe créée
    </div>
    <ul v-else class="divide-y divide-gray-200">
      <li v-for="envelope in envelopes" :key="envelope.id" class="py-4">
        <div class="flex justify-between items-center">
          <div>
            <h3 class="text-lg font-medium text-gray-900">{{ envelope.name }}</h3>
            <p class="text-sm text-gray-500">Créée le {{ formatDate(envelope.created_at) }}</p>
          </div>
          <div class="flex items-center space-x-4">
            <p class="text-lg font-semibold text-gray-900">{{ formatAmount(envelope.amount) }}</p>
            <RouterLink
              :to="`/edit-envelope/${envelope.id}`"
              class="text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md p-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
                />
              </svg>
            </RouterLink>
            <button
              @click="openDeleteModal(envelope)"
              class="text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-md p-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </li>
    </ul>

    <ConfirmModal
      v-model="showDeleteModal"
      title="Archiver l'enveloppe"
      :message="deleteMessage"
      :is-valid="confirmationText === envelopeToDelete?.name"
      @confirm="archiveEnvelope"
    >
      <input
        v-model="confirmationText"
        type="text"
        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
        :placeholder="envelopeToDelete?.name"
      />
    </ConfirmModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { supabase } from '../utils/supabase'
import type { Envelope } from '../types/database'
import ConfirmModal from './ui/ConfirmModal.vue'

const envelopes = ref<Envelope[]>([])
const loading = ref(true)
const error = ref('')
const showDeleteModal = ref(false)
const envelopeToDelete = ref<Envelope | null>(null)
const confirmationText = ref('')

const deleteMessage = computed(() => {
  if (!envelopeToDelete.value) return ''
  return `Pour archiver l'enveloppe "${envelopeToDelete.value.name}", veuillez taper son nom exactement comme il apparaît.`
})

const fetchEnvelopes = async () => {
  try {
    loading.value = true
    error.value = ''

    const { data, error: supabaseError } = await supabase
      .from('envelopes')
      .select('*')
      .or('archived.is.null,archived.eq.false')
      .order('created_at', { ascending: false })

    if (supabaseError) throw supabaseError

    envelopes.value = data || []
  } catch (err) {
    console.error('Erreur lors du chargement des enveloppes:', err)
    error.value = 'Une erreur est survenue lors du chargement des enveloppes'
  } finally {
    loading.value = false
  }
}

const openDeleteModal = (envelope: Envelope) => {
  envelopeToDelete.value = envelope
  confirmationText.value = ''
  showDeleteModal.value = true
}

const archiveEnvelope = async () => {
  if (!envelopeToDelete.value) return

  try {
    const { error: supabaseError } = await supabase
      .from('envelopes')
      .update({ archived: true })
      .eq('id', envelopeToDelete.value.id)

    if (supabaseError) throw supabaseError

    // Mettre à jour la liste locale
    envelopes.value = envelopes.value.filter((e) => e.id !== envelopeToDelete.value?.id)
    showDeleteModal.value = false
    envelopeToDelete.value = null
    confirmationText.value = ''
  } catch (err) {
    console.error("Erreur lors de l'archivage de l'enveloppe:", err)
    error.value = "Une erreur est survenue lors de l'archivage de l'enveloppe"
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

const formatAmount = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)
}

onMounted(() => {
  fetchEnvelopes()
})
</script>
