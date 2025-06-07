export interface Envelope {
  id: number
  name: string
  amount: number
  created_at: string
}

export interface Database {
  public: {
    Tables: {
      envelopes: {
        Row: Envelope
        Insert: Omit<Envelope, 'id' | 'created_at'>
        Update: Partial<Omit<Envelope, 'id' | 'created_at'>>
      }
    }
  }
}
