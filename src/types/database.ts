export interface Envelope {
  id: number
  name: string
  amount: number
  created_at: string
  archived: boolean
}

export interface Expense {
  id: string
  created_at: string
  date: string
  amount: number
  envelope_id: string
}

export interface Database {
  public: {
    Tables: {
      envelopes: {
        Row: Envelope
        Insert: Omit<Envelope, 'id' | 'created_at'>
        Update: Partial<Omit<Envelope, 'id' | 'created_at'>>
      }
      expenses: {
        Row: Expense
        Insert: Omit<Expense, 'id' | 'created_at'>
        Update: Partial<Omit<Expense, 'id' | 'created_at'>>
      }
    }
  }
}

// 1️⃣ Tous les noms de tables disponibles dans ta base
export type TableName = keyof Database['public']['Tables']

// 2️⃣ Type générique pour accéder à une table spécifique
export type Table<T extends TableName> = Database['public']['Tables'][T]

export type Insert<T extends TableName> = Table<T>['Insert']
export type Update<T extends TableName> = Table<T>['Update']
export type Row<T extends TableName> = Table<T>['Row']
