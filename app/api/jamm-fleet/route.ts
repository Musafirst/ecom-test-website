import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { rateLimit, getClientIP } from '@/lib/rateLimit'
import { parseFleetLead } from '@/lib/apiValidation'
import { incrementMetric, logError, recordApiResult } from '@/lib/observability'

const MAX_BODY_BYTES = 10_240
const RATE_LIMIT     = 5
const RATE_WINDOW_MS = 15 * 60_000

export async function POST(req: NextRequest) {
  const startedAt = Date.now()
  const respond = (body: Record<string, unknown>, status = 200) => {
    recordApiResult('/api/jamm-fleet', status, startedAt)
    return NextResponse.json(body, { status })
  }
  const ip = getClientIP(req)
  const { allowed, retryAfterSec } = rateLimit(`jamm-fleet:${ip}`, RATE_LIMIT, RATE_WINDOW_MS)

  if (!allowed) {
    recordApiResult('/api/jamm-fleet', 429, startedAt)
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(retryAfterSec) } },
    )
  }

  const contentLength = Number(req.headers.get('content-length') ?? 0)
  if (contentLength > MAX_BODY_BYTES) {
    return respond({ error: 'Request too large.' }, 413)
  }

  try {
    const parsed = parseFleetLead(await req.json())
    if ('error' in parsed) return respond({ error: parsed.error }, 400)
    const supabase = getSupabase()
    const { error } = await supabase.from('jamm_fleet_leads').insert(parsed.data)

    if (error) throw error

    incrementMetric('lead_submissions_total', { form: 'fleet', result: 'accepted' })
    return respond({ success: true })
  } catch (err) {
    incrementMetric('lead_submissions_total', { form: 'fleet', result: 'error' })
    logError('lead.fleet_failed', err)
    return respond({ error: 'Server error. Please try again.' }, 500)
  }
}
