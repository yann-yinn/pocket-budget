import { supabase } from '@/utils/supabase'
import type { TablesInsert, Tables } from '@/types/supabase.types'
import { isHttpErrorStatus } from '@/utils/helpers'

type Envelope = Tables<'envelopes'>
type EnvelopeInsert = TablesInsert<'envelopes'>

export const envelopesService = {
  async getAll() {
    const { data, error } = await supabase
      .from('envelopes')
      .select('*')
      .eq('archived', false)
      .order('name')

    if (error) throw error
    return data as Envelope[]
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('envelopes')
      .select(`
        *,
        expenses:expenses (
          id,
          amount,
          date
        )
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data as Envelope & { expenses: Pick<Tables<'expenses'>, 'id' | 'amount' | 'date'>[] }
  },

  async create(envelope: EnvelopeInsert) {
    const result = await supabase
      .from('envelopes')
      .insert(envelope)
      .select()
      .single()
    if (isHttpErrorStatus(result.status)) {
      throw "Supabase: Erreur lors de l'appel du serveur, code HTTP: " + result.status + result.statusText
    }
    if (result.error) throw result.error;
    return result.data as Envelope
  },

  async update(id: string, envelope: Partial<EnvelopeInsert>) {
    const { data, error } = await supabase
      .from('envelopes')
      .update(envelope)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Envelope
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('envelopes')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async getWithSpent(period?: { startDate: string; endDate: string }) {
    const query = supabase
      .from('envelopes')
      .select(`
        *,
        expenses:expenses (
          id,
          amount,
          date
        )
      `)
      .order('name')

    if (period) {
      query
        .gte('expenses.date', period.startDate)
        .lte('expenses.date', period.endDate)
    }

    const { data, error } = await query

    if (error) throw error
    return data as (Envelope & { expenses: Pick<Tables<'expenses'>, 'id' | 'amount' | 'date'>[] })[]
  }
}
