'use client'

import { useState } from 'react'

type FormState = 'idle' | 'submitting' | 'success' | 'error'

interface FormData {
  full_name: string
  email: string
  phone: string
  origin_location: string
  destination_country: string
  destination_city: string
  item_type: string
  estimated_weight: string
  preferred_timeline: string
  notes: string
  consent_accepted: boolean
}

const inputClass =
  'h-11 w-full rounded-md border border-jamm-gold/25 bg-white/80 px-3.5 font-sans text-base md:text-sm text-jamm-dark placeholder-jamm-dark/35 outline-none transition-colors focus:border-jamm-gold/60 focus:bg-white focus:ring-2 focus:ring-jamm-gold/10'

const textareaClass =
  'w-full resize-none rounded-md border border-jamm-gold/25 bg-white/80 px-3.5 py-2.5 font-sans text-base md:text-sm text-jamm-dark placeholder-jamm-dark/35 outline-none transition-colors focus:border-jamm-gold/60 focus:bg-white focus:ring-2 focus:ring-jamm-gold/10'

const labelClass =
  'block font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-jamm-dark/60 mb-1.5'

export function JammCargoQuoteForm() {
  const [form, setForm] = useState<FormData>({
    full_name: '',
    email: '',
    phone: '',
    origin_location: '',
    destination_country: '',
    destination_city: '',
    item_type: '',
    estimated_weight: '',
    preferred_timeline: '',
    notes: '',
    consent_accepted: false,
  })
  const [formState, setFormState] = useState<FormState>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) {
    const { name, value, type } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormState('submitting')
    setErrorMsg('')

    try {
      const res = await fetch('/api/jamm-cargo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = (await res.json()) as { success?: boolean; error?: string }

      if (!res.ok) {
        setErrorMsg(data.error ?? 'Something went wrong. Please try again.')
        setFormState('error')
        return
      }

      setFormState('success')
    } catch {
      setErrorMsg('Network error. Please check your connection and try again.')
      setFormState('error')
    }
  }

  if (formState === 'success') {
    return (
      <div className="rounded-lg border border-jamm-gold/30 bg-[#FAF7F2]/92 p-8 text-center shadow-[0_18px_50px_rgba(12,11,9,0.06)] sm:p-12">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-jamm-gold/40 bg-jamm-gold/10">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-7 w-7 text-jamm-gold" aria-hidden>
            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="font-serif text-2xl font-light text-jamm-dark sm:text-3xl">Quote Request Received</h3>
        <p className="mx-auto mt-3 max-w-md font-sans text-sm leading-relaxed text-jamm-dark/60">
          Thank you, <strong>{form.full_name.split(' ')[0]}</strong>. We have received your shipping quote request. Our team will review the details and contact you at{' '}
          <strong className="text-jamm-dark">{form.email}</strong> with a quote.
        </p>
        <p className="mx-auto mt-3 max-w-md font-sans text-xs leading-relaxed text-jamm-dark/45">
          If you accept the quote, we will coordinate with our available shipping partners to arrange your shipment.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div>
        <label htmlFor="cargo-full-name" className={labelClass}>
          Full Name <span className="text-jamm-gold">*</span>
        </label>
        <input
          id="cargo-full-name"
          type="text"
          name="full_name"
          value={form.full_name}
          onChange={handleChange}
          required
          placeholder="Your full name"
          className={inputClass}
          autoComplete="name"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="cargo-email" className={labelClass}>
            Email Address <span className="text-jamm-gold">*</span>
          </label>
          <input
            id="cargo-email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="you@email.com"
            className={inputClass}
            autoComplete="email"
          />
        </div>
        <div>
          <label htmlFor="cargo-phone" className={labelClass}>Phone Number</label>
          <input
            id="cargo-phone"
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="+1 (555) 000-0000"
            className={inputClass}
            autoComplete="tel"
          />
        </div>
      </div>

      <div>
        <label htmlFor="cargo-origin" className={labelClass}>Origin Location (Shipping From)</label>
        <input
          id="cargo-origin"
          type="text"
          name="origin_location"
          value={form.origin_location}
          onChange={handleChange}
          placeholder="City, State — e.g. Philadelphia, PA (default: United States)"
          className={inputClass}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="cargo-dest-country" className={labelClass}>
            Destination Country <span className="text-jamm-gold">*</span>
          </label>
          <input
            id="cargo-dest-country"
            type="text"
            name="destination_country"
            value={form.destination_country}
            onChange={handleChange}
            required
            placeholder="e.g. Nigeria, France, UAE, Ghana"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="cargo-dest-city" className={labelClass}>Destination City / Region</label>
          <input
            id="cargo-dest-city"
            type="text"
            name="destination_city"
            value={form.destination_city}
            onChange={handleChange}
            placeholder="City or region (optional)"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="cargo-item-type" className={labelClass}>
          Type of Items to Ship <span className="text-jamm-gold">*</span>
        </label>
        <textarea
          id="cargo-item-type"
          name="item_type"
          value={form.item_type}
          onChange={handleChange}
          required
          rows={3}
          placeholder="Describe what you need to ship — e.g. electronics, clothing, personal effects, commercial goods, fragile items"
          className={textareaClass}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="cargo-weight" className={labelClass}>Estimated Weight or Quantity</label>
          <input
            id="cargo-weight"
            type="text"
            name="estimated_weight"
            value={form.estimated_weight}
            onChange={handleChange}
            placeholder="e.g. 5 lbs, 2 boxes, 1 pallet"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="cargo-timeline" className={labelClass}>Preferred Timeline</label>
          <select
            id="cargo-timeline"
            name="preferred_timeline"
            value={form.preferred_timeline}
            onChange={handleChange}
            className={`${inputClass} cursor-pointer`}
          >
            <option value="">Select timeline...</option>
            <option value="As soon as possible">As soon as possible</option>
            <option value="Within 1–2 weeks">Within 1–2 weeks</option>
            <option value="Within 1 month">Within 1 month</option>
            <option value="Flexible / No rush">Flexible / No rush</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="cargo-notes" className={labelClass}>Additional Notes</label>
        <textarea
          id="cargo-notes"
          name="notes"
          value={form.notes}
          onChange={handleChange}
          rows={3}
          placeholder="Special requirements, fragile items, customs questions, or anything else we should know"
          className={textareaClass}
        />
      </div>

      <div className="rounded-md border border-jamm-gold/20 bg-[#EDE8DC] p-4">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            name="consent_accepted"
            checked={form.consent_accepted}
            onChange={handleChange}
            required
            className="mt-0.5 h-5 w-5 flex-shrink-0 cursor-pointer accent-jamm-gold"
          />
          <span className="font-sans text-xs leading-relaxed text-jamm-dark/60">
            By submitting this form, you agree to be contacted by Jamm Trade regarding your shipping quote request. Your information will not be shared with third parties outside of the shipping process. View our{' '}
            <a href="/shop/privacy-policy" className="text-jamm-gold underline-offset-2 hover:underline">
              Privacy Policy
            </a>
            .
          </span>
        </label>
      </div>

      {formState === 'error' && errorMsg && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 font-sans text-sm text-red-700" role="alert">
          {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={formState === 'submitting' || !form.consent_accepted}
        className="inline-flex h-12 w-full items-center justify-center rounded-md bg-jamm-dark px-8 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition-colors duration-200 hover:bg-jamm-gold hover:text-jamm-dark disabled:cursor-not-allowed disabled:opacity-55"
      >
        {formState === 'submitting' ? 'Submitting…' : 'Request Shipping Quote'}
      </button>
    </form>
  )
}
