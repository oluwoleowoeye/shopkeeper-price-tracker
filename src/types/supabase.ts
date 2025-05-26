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
        }
        Insert: {
          id?: number
          created_at?: string
          item_name: string
          supplier: string
          price: number
        }
        Update: {
          id?: number
          created_at?: string
          item_name?: string
          supplier?: string
          price?: number
        }
      }
    }
  }
}

export type PriceEntry = Database['public']['Tables']['prices']['Row'];
export type NewPriceEntry = Database['public']['Tables']['prices']['Insert'];