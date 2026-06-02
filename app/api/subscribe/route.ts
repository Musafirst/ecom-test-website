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
import { incrementMetric, logError, recordApiResult } from '@/lib/observability'

const CODE           = process.env.NEXT_PUBLIC_WELCOME_DISCOUNT_CODE?.trim()
const MAX_BODY_BYTES = 1_024          // 1 KB — an email fits in ~100 bytes
const RATE_LIMIT     = 5             // requests
const RATE_WINDOW_MS = 15 * 60_000  // 15 minutes

export async function POST(req: NextRequest) {
  const startedAt = Date.now()
  const respond = (body: Record<string, unknown>, status = 200) => {
    recordApiResult('/api/subscribe', status, startedAt)
    return NextResponse.json(body, { status })
  }

  if (!CODE) {
    return respond({ error: 'This promotion is not currently available.' }, 503)
  }

  // ── Rate limiting ──────────────────────────────────────────────────────
  const ip     = getClientIP(req)
  const { allowed, retryAfterSec } = rateLimit(`subscribe:${ip}`, RATE_LIMIT, RATE_WINDOW_MS)

  if (!allowed) {
    recordApiResult('/api/subscribe', 429, startedAt)
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
    return respond({ error: 'Request too large.' }, 413)
  }

  try {
    const body = await req.json() as { email?: unknown }

    const normalised = cleanEmail(body.email)
    if (!normalised) {
      return respond({ error: 'Invalid email address.' }, 400)
    }

    const supabase = getSupabase()

    // Check if already claimed
    const { data: existing } = await supabase
      .from('discount_claims')
      .select('id')
      .eq('email', normalised)
      .maybeSingle()

    if (existing) {
      incrementMetric('lead_submissions_total', { form: 'discount', result: 'duplicate' })
      return respond({ code: CODE, alreadyClaimed: true })
    }

    // New — save and return code
    const { error } = await supabase
      .from('discount_claims')
      .insert({ email: normalised, code: CODE })

    if (error) throw error

    incrementMetric('lead_submissions_total', { form: 'discount', result: 'accepted' })
    return respond({ code: CODE, alreadyClaimed: false })
  } catch (err) {
    incrementMetric('lead_submissions_total', { form: 'discount', result: 'error' })
    logError('lead.discount_failed', err)
    return respond({ error: 'Server error. Please try again.' }, 500)
  }
}
