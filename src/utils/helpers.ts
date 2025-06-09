/**
 * Extrait un message d'erreur lisible à partir de n'importe quelle valeur "throw".
 * Garantit toujours une string, sans jamais throw à son tour.
 */
export function extractErrorMessage(err: unknown): string {
  if (import.meta.env.DEV) {
    console.log('extractErrorMessage', err)
  }
  // 1. Cas typique : une vraie instance de Error (Error, TypeError, etc.)
  if (err instanceof Error) {
    return err.message || err.toString()
  }

  // 2. Cas courant : une string brute (souvent throw "Oops")
  if (typeof err === 'string') {
    return err
  }

  // 3. Cas : objet avec champ 'message' de type string
  if (
    typeof err === 'object' &&
    err !== null &&
    'message' in err &&
    typeof (err as any).message === 'string'
  ) {
    return (err as any).message
  }

  // 4. Cas : une promesse jetée (rare, mais possible)
  if (typeof err === 'object' && err !== null && typeof (err as any).then === 'function') {
    return '[Promise was thrown as an error]'
  }

  // 5. Cas : un Symbol
  if (typeof err === 'symbol') {
    return err.toString()
  }

  // 6. Cas : n'importe quel objet serialisable
  try {
    const json = JSON.stringify(err)
    if (json !== '{}') return json
  } catch {
    // JSON.stringify peut throw (objets cycliques)
  }

  // 7. Fallback universel (très rarement utile)
  try {
    return String(err)
  } catch {
    return '[Unknown error of unstringifiable type]'
  }
}

export function isHttpErrorStatus(status: number): boolean {
  // Convertit le code en chaîne, puis regarde si le premier caractère est '4' ou '5'
  const firstDigit = status.toString()[0]
  return firstDigit === '4' || firstDigit === '5'
}
