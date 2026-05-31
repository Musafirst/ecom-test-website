import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { rateLimit, getClientIP } from '@/lib/rateLimit'
import { cleanEmail, cleanText } from '@/lib/validation'

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

    const fullName = cleanText(full_name, 120)
    const rawEmail = cleanEmail(email)
    const cleanPhone = cleanText(phone, 40)
    const cleanState = cleanText(state, 80)
    const cleanCity = cleanText(city, 120)
    const cleanLicenseStatus = cleanText(license_status, 80)

    if (!fullName || fullName.length < 2) {
      return NextResponse.json({ error: 'Full name is required.' }, { status: 400 })
    }
    if (!rawEmail) {
      return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 })
    }
    if (!cleanPhone || cleanPhone.length < 7) {
      return NextResponse.json({ error: 'A valid phone number is required.' }, { status: 400 })
    }
    if (!cleanState || cleanState.length < 2) {
      return NextResponse.json({ error: 'State is required.' }, { status: 400 })
    }
    if (!cleanCity || cleanCity.length < 2) {
      return NextResponse.json({ error: 'City is required.' }, { status: 400 })
    }
    if (!cleanLicenseStatus) {
      return NextResponse.json({ error: "Driver's license status is required." }, { status: 400 })
    }
    if (consent_accepted !== true) {
      return NextResponse.json({ error: 'You must agree to be contacted to submit this form.' }, { status: 400 })
    }

    const platforms = Array.isArray(platform_interest)
      ? platform_interest.map((value) => cleanText(value, 80)).filter(Boolean).slice(0, 10).join(', ')
      : cleanText(platform_interest, 500)
    const supabase = getSupabase()
    const { error } = await supabase.from('jamm_fleet_leads').insert({
      full_name:          fullName,
      email:              rawEmail,
      phone:              cleanPhone,
      state:              cleanState,
      city:               cleanCity,
      license_status:     cleanLicenseStatus,
      platform_interest:  platforms || null,
      desired_start_date: cleanText(desired_start_date, 40),
      rental_duration:    cleanText(rental_duration, 120),
      insurance_status:   cleanText(insurance_status, 80),
      notes:              cleanText(notes, 2_000),
      consent_accepted:   true,
    })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[/api/jamm-fleet]', err)
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 })
  }
}
