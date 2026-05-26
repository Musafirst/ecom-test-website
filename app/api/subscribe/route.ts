/**
 * POST /api/subscribe
 * Checks if an email already claimed the welcome discount.
 * If not, saves it and returns the code.
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

const CODE = 'WELCOME20'

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json() as { email?: string }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
    }

    const normalised = email.toLowerCase().trim()

    // Check if already claimed
    const { data: existing } = await supabase
      .from('discount_claims')
      .select('id, code')
      .eq('email', normalised)
      .maybeSingle()

    if (existing) {
      // Already in DB — return the code anyway (Shopify enforces 1 use)
      return NextResponse.json({ code: existing.code, alreadyClaimed: true })
    }

    // New — save and return code
    const { error } = await supabase
      .from('discount_claims')
      .insert({ email: normalised, code: CODE })

    if (error) throw error

    return NextResponse.json({ code: CODE, alreadyClaimed: false })
  } catch (err) {
    console.error('[/api/subscribe]', err)
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 })
  }
}
