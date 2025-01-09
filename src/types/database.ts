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
      breweries: {
        Row: {
          id: string
          external_id: string
          name: string
          created_at: string
          owner_id: string | null
        }
        Insert: {
          id?: string
          external_id: string
          name: string
          created_at?: string
          owner_id?: string | null
        }
        Update: {
          id?: string
          external_id?: string
          name?: string
          created_at?: string
          owner_id?: string | null
        }
      }
      events: {
        Row: {
          id: string
          brewery_id: string
          title: string
          description: string | null
          start_time: string
          end_time: string
          image_url: string | null
          created_at: string
          updated_at: string
          status: 'draft' | 'published' | 'cancelled'
        }
        Insert: {
          id?: string
          brewery_id: string
          title: string
          description?: string | null
          start_time: string
          end_time: string
          image_url?: string | null
          created_at?: string
          updated_at?: string
          status?: 'draft' | 'published' | 'cancelled'
        }
        Update: {
          id?: string
          brewery_id?: string
          title?: string
          description?: string | null
          start_time?: string
          end_time?: string
          image_url?: string | null
          created_at?: string
          updated_at?: string
          status?: 'draft' | 'published' | 'cancelled'
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}