import { NextRequest, NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { rateLimit, getClientIP } from '@/lib/rateLimit'
import { cleanEmail, cleanText } from '@/lib/validation'

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

    const fullName = cleanText(full_name, 120)
    const rawEmail = cleanEmail(email)
    const destinationCountry = cleanText(destination_country, 100)
    const itemType = cleanText(item_type, 1_000)

    if (!fullName || fullName.length < 2) {
      return NextResponse.json({ error: 'Full name is required.' }, { status: 400 })
    }
    if (!rawEmail) {
      return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 })
    }
    if (!destinationCountry || destinationCountry.length < 2) {
      return NextResponse.json({ error: 'Destination country is required.' }, { status: 400 })
    }
    if (!itemType || itemType.length < 2) {
      return NextResponse.json({ error: 'Please describe the items to ship.' }, { status: 400 })
    }
    if (consent_accepted !== true) {
      return NextResponse.json({ error: 'You must agree to be contacted to submit this form.' }, { status: 400 })
    }

    const supabase = getSupabase()
    const { error } = await supabase.from('jamm_cargo_leads').insert({
      full_name:           fullName,
      email:               rawEmail,
      phone:               cleanText(phone, 40),
      origin_location:     cleanText(origin_location, 160),
      destination_country: destinationCountry,
      destination_city:    cleanText(destination_city, 120),
      item_type:           itemType,
      estimated_weight:    cleanText(estimated_weight, 120),
      preferred_timeline:  cleanText(preferred_timeline, 120),
      notes:               cleanText(notes, 2_000),
      consent_accepted:    true,
    })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[/api/jamm-cargo]', err)
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 })
  }
}
