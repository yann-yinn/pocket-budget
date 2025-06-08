import { supabase } from '@/utils/supabase'
import type { TablesInsert, Tables } from '@/types/supabase.types'

type Expense = Tables<'expenses'>
type ExpenseInsert = TablesInsert<'expenses'>

export const expensesService = {
  async getAll() {
    const { data, error } = await supabase
      .from('expenses')
      .select(`
        *,
        envelope:envelopes (
          id,
          name,
          amount
        )
      `)
      .order('date', { ascending: false })

    if (error) throw error
    return data as (Expense & { envelope: Pick<Tables<'envelopes'>, 'id' | 'name' | 'amount'> })[]
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('expenses')
      .select(`
        *,
        envelope:envelopes (
          id,
          name,
          amount
        )
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data as Expense & { envelope: Pick<Tables<'envelopes'>, 'id' | 'name' | 'amount'> }
  },

  async create(expense: ExpenseInsert) {
    const { data, error } = await supabase
      .from('expenses')
      .insert(expense)
      .select()
      .single()

    if (error) throw error
    return data as Expense
  },

  async update(id: string, expense: Partial<ExpenseInsert>) {
    const { data, error } = await supabase
      .from('expenses')
      .update(expense)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as Expense
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async getByEnvelopeId(envelopeId: string) {
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('envelope_id', envelopeId)
      .order('date', { ascending: false })

    if (error) throw error
    return data as Expense[]
  },

  async getByPeriod(startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from('expenses')
      .select(`
        *,
        envelope:envelopes (
          id,
          name,
          amount
        )
      `)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false })

    if (error) throw error
    return data as (Expense & { envelope: Pick<Tables<'envelopes'>, 'id' | 'name' | 'amount'> })[]
  }
}
