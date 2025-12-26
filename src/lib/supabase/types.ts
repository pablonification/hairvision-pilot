import type { AnalysisResult, CustomerDisplaySection } from '@/types'

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
      sessions: {
        Row: {
          id: string
          session_code: string
          analysis_result: Json | null
          current_section: string
          created_at: string
          updated_at: string
          expires_at: string
        }
        Insert: {
          id?: string
          session_code: string
          analysis_result?: Json | null
          current_section?: string
          created_at?: string
          updated_at?: string
          expires_at?: string
        }
        Update: {
          id?: string
          session_code?: string
          analysis_result?: Json | null
          current_section?: string
          created_at?: string
          updated_at?: string
          expires_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

type SessionRow = Database['public']['Tables']['sessions']['Row']

export interface Session extends Omit<SessionRow, 'analysis_result' | 'current_section'> {
  analysis_result: AnalysisResult | null
  current_section: CustomerDisplaySection
}

export type SessionInsert = Database['public']['Tables']['sessions']['Insert']
export type SessionUpdate = Database['public']['Tables']['sessions']['Update']
