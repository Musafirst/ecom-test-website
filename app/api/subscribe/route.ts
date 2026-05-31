/**
 * POST /api/subscribe
 * Checks if an email already claimed the welcome discount.
 * If not, saves it and returns the code.
 *
 * Security:
 *  - Rate limited: 5 attempts per IP per 15 minutes
 *  - Body size capped at 1 KB
 *  - Email normalised and validated before DB write
 */

import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { rateLimit, getClientIP } from '@/lib/rateLimit'
import { cleanEmail } from '@/lib/validation'

const CODE           = 'WELCOME20'
const MAX_BODY_BYTES = 1_024          // 1 KB — an email fits in ~100 bytes
const RATE_LIMIT     = 5             // requests
const RATE_WINDOW_MS = 15 * 60_000  // 15 minutes

export async function POST(req: NextRequest) {
  // ── Rate limiting ──────────────────────────────────────────────────────
  const ip     = getClientIP(req)
  const { allowed, retryAfterSec } = rateLimit(`subscribe:${ip}`, RATE_LIMIT, RATE_WINDOW_MS)

  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: { 'Retry-After': String(retryAfterSec) },
      },
    )
  }

  // ── Body size guard ────────────────────────────────────────────────────
  const contentLength = Number(req.headers.get('content-length') ?? 0)
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'Request too large.' }, { status: 413 })
  }

  try {
    const body = await req.json() as { email?: unknown }

    const normalised = cleanEmail(body.email)
    if (!normalised) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
    }

    const supabase = getSupabase()

    // Check if already claimed
    const { data: existing } = await supabase
      .from('discount_claims')
      .select('id, code')
      .eq('email', normalised)
      .maybeSingle()

    if (existing) {
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
