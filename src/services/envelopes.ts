import { supabase } from '../utils/supabase'
import type { TablesInsert, Tables } from '@/types/supabase.types'

export async function insertEnvelope(values: TablesInsert<'envelopes'>) {
  const result = await supabase
    .from('envelopes')
    .insert([values])
    .select<'envelopes', Tables<'envelopes'>>()
  if (result.error) throw result.error
  return result
}
