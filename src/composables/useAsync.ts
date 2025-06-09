import { extractErrorMessage } from '@/utils/helpers'
import { ref } from 'vue'

export default function useAsync() {
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function execute<T>(promiseFn: () => Promise<T>) {
    let data: T | null = null
    loading.value = true
    error.value = null
    try {
      data = await promiseFn()
    } catch (err) {
      error.value = extractErrorMessage(err)
    } finally {
      loading.value = false
    }
    return data
  }

  return {
    loading,
    error,
    execute,
  }
}