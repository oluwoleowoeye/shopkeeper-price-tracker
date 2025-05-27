export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      prices: {
        Row: {
          id: number
          created_at: string
          item_name: string
          supplier: string
          price: number
          date: string
          shopkeeper_id: string
        }
        Insert: {
          id?: number
          created_at?: string
          item_name: string
          supplier: string
          price: number
          date?: string
          shopkeeper_id?: string
        }
        Update: {
          id?: number
          created_at?: string
          item_name?: string
          supplier?: string
          price?: number
          date?: string
          shopkeeper_id?: string
        }
      }
    }
  }
}

export type PriceEntry = Database['public']['Tables']['prices']['Row'];
export type NewPriceEntry = Omit<Database['public']['Tables']['prices']['Insert'], 'date' | 'shopkeeper_id'>;