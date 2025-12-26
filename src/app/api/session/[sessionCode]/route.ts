import { NextRequest, NextResponse } from 'next/server'
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client'
import type { CustomerDisplaySection } from '@/types'

interface RouteParams {
  params: Promise<{ sessionCode: string }>
}

const VALID_SECTIONS: CustomerDisplaySection[] = [
  'loading',
  'scan_complete',
  'profile_analysis',
  'compatibility_matrix',
  'recommendation_1',
  'recommendation_2',
  'products',
]

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { sessionCode } = await params

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 503 }
    )
  }

  let body: { current_section: CustomerDisplaySection }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { current_section } = body

  if (!current_section || !VALID_SECTIONS.includes(current_section)) {
    return NextResponse.json(
      { error: 'Invalid section', validSections: VALID_SECTIONS },
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .from('sessions')
    .update({ current_section })
    .eq('session_code', sessionCode.toUpperCase())
    .select('id, session_code, current_section')
    .single()

  if (error) {
    return NextResponse.json(
      { error: 'Session not found or update failed' },
      { status: 404 }
    )
  }

  return NextResponse.json({ success: true, data })
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { sessionCode } = await params

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: 'Database not configured' },
      { status: 503 }
    )
  }

  const { data, error } = await supabase
    .from('sessions')
    .select('id, session_code, current_section, created_at')
    .eq('session_code', sessionCode.toUpperCase())
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 })
  }

  return NextResponse.json({ success: true, data })
}
