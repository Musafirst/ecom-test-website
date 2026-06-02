import { cleanEmail, cleanText } from '@/lib/validation'

type ValidationResult<T> = { data: T; error?: never } | { data?: never; error: string }

export type CargoLead = {
  full_name: string
  email: string
  phone: string | null
  origin_location: string | null
  destination_country: string
  destination_city: string | null
  item_type: string
  estimated_weight: string | null
  preferred_timeline: string | null
  notes: string | null
  consent_accepted: true
}

export type FleetLead = {
  full_name: string
  email: string
  phone: string
  state: string
  city: string
  license_status: string
  platform_interest: string | null
  desired_start_date: string | null
  rental_duration: string | null
  insurance_status: string | null
  notes: string | null
  consent_accepted: true
}

function asRecord(value: unknown) {
  return value && typeof value === 'object' ? value as Record<string, unknown> : {}
}

export function parseCargoLead(value: unknown): ValidationResult<CargoLead> {
  const body = asRecord(value)
  const fullName = cleanText(body.full_name, 120)
  const email = cleanEmail(body.email)
  const destinationCountry = cleanText(body.destination_country, 100)
  const itemType = cleanText(body.item_type, 1_000)

  if (!fullName || fullName.length < 2) return { error: 'Full name is required.' }
  if (!email) return { error: 'A valid email address is required.' }
  if (!destinationCountry || destinationCountry.length < 2) return { error: 'Destination country is required.' }
  if (!itemType || itemType.length < 2) return { error: 'Please describe the items to ship.' }
  if (body.consent_accepted !== true) return { error: 'You must agree to be contacted to submit this form.' }

  return {
    data: {
      full_name: fullName,
      email,
      phone: cleanText(body.phone, 40),
      origin_location: cleanText(body.origin_location, 160),
      destination_country: destinationCountry,
      destination_city: cleanText(body.destination_city, 120),
      item_type: itemType,
      estimated_weight: cleanText(body.estimated_weight, 120),
      preferred_timeline: cleanText(body.preferred_timeline, 120),
      notes: cleanText(body.notes, 2_000),
      consent_accepted: true,
    },
  }
}
export function parseFleetLead(value: unknown): ValidationResult<FleetLead> {
  const body = asRecord(value)
  const fullName = cleanText(body.full_name, 120)
  const email = cleanEmail(body.email)
  const phone = cleanText(body.phone, 40)
  const state = cleanText(body.state, 80)
  const city = cleanText(body.city, 120)
  const licenseStatus = cleanText(body.license_status, 80)

  if (!fullName || fullName.length < 2) return { error: 'Full name is required.' }
  if (!email) return { error: 'A valid email address is required.' }
  if (!phone || phone.length < 7) return { error: 'A valid phone number is required.' }
  if (!state || state.length < 2) return { error: 'State is required.' }
  if (!city || city.length < 2) return { error: 'City is required.' }
  if (!licenseStatus) return { error: "Driver's license status is required." }
  if (body.consent_accepted !== true) return { error: 'You must agree to be contacted to submit this form.' }

  const platforms = Array.isArray(body.platform_interest)
    ? body.platform_interest.map((entry) => cleanText(entry, 80)).filter(Boolean).slice(0, 10).join(', ')
    : cleanText(body.platform_interest, 500)

  return {
    data: {
      full_name: fullName,
      email,
      phone,
      state,
      city,
      license_status: licenseStatus,
      platform_interest: platforms || null,
      desired_start_date: cleanText(body.desired_start_date, 40),
      rental_duration: cleanText(body.rental_duration, 120),
      insurance_status: cleanText(body.insurance_status, 80),
      notes: cleanText(body.notes, 2_000),
      consent_accepted: true,
    },
  }
}
