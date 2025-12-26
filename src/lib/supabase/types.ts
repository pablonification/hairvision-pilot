import type { AnalysisResult, CustomerDisplaySection } from '@/types'
import type { CostBreakdown } from '@/lib/gemini/pricing'

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
          cost_breakdown: Json | null
          current_section: string
          created_at: string
          updated_at: string
          expires_at: string
        }
        Insert: {
          id?: string
          session_code: string
          analysis_result?: Json | null
          cost_breakdown?: Json | null
          current_section?: string
          created_at?: string
          updated_at?: string
          expires_at?: string
        }
        Update: {
          id?: string
          session_code?: string
          analysis_result?: Json | null
          cost_breakdown?: Json | null
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

export interface Session extends Omit<SessionRow, 'analysis_result' | 'cost_breakdown' | 'current_section'> {
  analysis_result: AnalysisResult | null
  cost_breakdown: CostBreakdown | null
  current_section: CustomerDisplaySection
}

export type SessionInsert = Database['public']['Tables']['sessions']['Insert']
export type SessionUpdate = Database['public']['Tables']['sessions']['Update']
