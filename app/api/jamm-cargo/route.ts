import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { rateLimit, getClientIP } from '@/lib/rateLimit'

const MAX_BODY_BYTES = 10_240
const RATE_LIMIT     = 5
const RATE_WINDOW_MS = 15 * 60_000

export async function POST(req: NextRequest) {
  const ip = getClientIP(req)
  const { allowed, retryAfterSec } = rateLimit(`jamm-cargo:${ip}`, RATE_LIMIT, RATE_WINDOW_MS)

  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(retryAfterSec) } },
    )
  }

  const contentLength = Number(req.headers.get('content-length') ?? 0)
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'Request too large.' }, { status: 413 })
  }

  try {
    const body = await req.json() as Record<string, unknown>

    const {
      full_name, email, phone, origin_location,
      destination_country, destination_city,
      item_type, estimated_weight, preferred_timeline,
      notes, consent_accepted,
    } = body

    if (!full_name || typeof full_name !== 'string' || full_name.trim().length < 2) {
      return NextResponse.json({ error: 'Full name is required.' }, { status: 400 })
    }
    const rawEmail = typeof email === 'string' ? email.trim() : ''
    if (!rawEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(rawEmail)) {
      return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 })
    }
    if (!destination_country || typeof destination_country !== 'string' || destination_country.trim().length < 2) {
      return NextResponse.json({ error: 'Destination country is required.' }, { status: 400 })
    }
    if (!item_type || typeof item_type !== 'string' || item_type.trim().length < 2) {
      return NextResponse.json({ error: 'Please describe the items to ship.' }, { status: 400 })
    }
    if (!consent_accepted) {
      return NextResponse.json({ error: 'You must agree to be contacted to submit this form.' }, { status: 400 })
    }

    const str = (v: unknown) => (typeof v === 'string' && v.trim() ? v.trim() : null)

    const { error } = await supabase.from('jamm_cargo_leads').insert({
      full_name:           String(full_name).trim(),
      email:               rawEmail.toLowerCase(),
      phone:               str(phone),
      origin_location:     str(origin_location),
      destination_country: String(destination_country).trim(),
      destination_city:    str(destination_city),
      item_type:           String(item_type).trim(),
      estimated_weight:    str(estimated_weight),
      preferred_timeline:  str(preferred_timeline),
      notes:               str(notes),
      consent_accepted:    true,
    })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[/api/jamm-cargo]', err)
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 })
  }
}
