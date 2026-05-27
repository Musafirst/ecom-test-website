import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { rateLimit, getClientIP } from '@/lib/rateLimit'

const MAX_BODY_BYTES = 10_240
const RATE_LIMIT     = 5
const RATE_WINDOW_MS = 15 * 60_000

export async function POST(req: NextRequest) {
  const ip = getClientIP(req)
  const { allowed, retryAfterSec } = rateLimit(`jamm-fleet:${ip}`, RATE_LIMIT, RATE_WINDOW_MS)

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
      full_name, email, phone, state, city,
      license_status, platform_interest,
      desired_start_date, rental_duration,
      insurance_status, notes, consent_accepted,
    } = body

    if (!full_name || typeof full_name !== 'string' || full_name.trim().length < 2) {
      return NextResponse.json({ error: 'Full name is required.' }, { status: 400 })
    }
    const rawEmail = typeof email === 'string' ? email.trim() : ''
    if (!rawEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(rawEmail)) {
      return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 })
    }
    if (!phone || typeof phone !== 'string' || phone.trim().length < 7) {
      return NextResponse.json({ error: 'A valid phone number is required.' }, { status: 400 })
    }
    if (!state || typeof state !== 'string' || state.trim().length < 2) {
      return NextResponse.json({ error: 'State is required.' }, { status: 400 })
    }
    if (!city || typeof city !== 'string' || city.trim().length < 2) {
      return NextResponse.json({ error: 'City is required.' }, { status: 400 })
    }
    if (!license_status || typeof license_status !== 'string') {
      return NextResponse.json({ error: "Driver's license status is required." }, { status: 400 })
    }
    if (!consent_accepted) {
      return NextResponse.json({ error: 'You must agree to be contacted to submit this form.' }, { status: 400 })
    }

    const str  = (v: unknown) => (typeof v === 'string' && v.trim() ? v.trim() : null)
    const platformStr = Array.isArray(platform_interest) ? platform_interest.join(', ') : str(platform_interest)

    const { error } = await supabase.from('jamm_fleet_leads').insert({
      full_name:          String(full_name).trim(),
      email:              rawEmail.toLowerCase(),
      phone:              String(phone).trim(),
      state:              String(state).trim(),
      city:               String(city).trim(),
      license_status:     String(license_status).trim(),
      platform_interest:  platformStr,
      desired_start_date: str(desired_start_date),
      rental_duration:    str(rental_duration),
      insurance_status:   str(insurance_status),
      notes:              str(notes),
      consent_accepted:   true,
    })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[/api/jamm-fleet]', err)
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 })
  }
}
