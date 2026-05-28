'use client'

import { useState } from 'react'

type FormState = 'idle' | 'submitting' | 'success' | 'error'

const PLATFORMS = ['Uber', 'DoorDash', 'Grubhub', 'Lyft', 'Personal Rental', 'Other']

interface FormData {
  full_name: string
  email: string
  phone: string
  state: string
  city: string
  license_status: string
  platform_interest: string[]
  desired_start_date: string
  rental_duration: string
  insurance_status: string
  notes: string
  consent_accepted: boolean
}

const inputClass =
  'h-11 w-full rounded-md border border-jamm-gold/25 bg-white/80 px-3.5 font-sans text-base md:text-sm text-jamm-dark placeholder-jamm-dark/35 outline-none transition-colors focus:border-jamm-gold/60 focus:bg-white focus:ring-2 focus:ring-jamm-gold/10'

const textareaClass =
  'w-full resize-none rounded-md border border-jamm-gold/25 bg-white/80 px-3.5 py-2.5 font-sans text-base md:text-sm text-jamm-dark placeholder-jamm-dark/35 outline-none transition-colors focus:border-jamm-gold/60 focus:bg-white focus:ring-2 focus:ring-jamm-gold/10'

const labelClass =
  'block font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-jamm-dark/60 mb-1.5'

export function JammFleetApplicationForm() {
  const [form, setForm] = useState<FormData>({
    full_name: '',
    email: '',
    phone: '',
    state: '',
    city: '',
    license_status: '',
    platform_interest: [],
    desired_start_date: '',
    rental_duration: '',
    insurance_status: '',
    notes: '',
    consent_accepted: false,
  })
  const [formState, setFormState] = useState<FormState>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      if (name === 'consent_accepted') {
        setForm((prev) => ({ ...prev, consent_accepted: checked }))
      } else if (name === 'platform_interest') {
        setForm((prev) => ({
          ...prev,
          platform_interest: checked
            ? [...prev.platform_interest, value]
            : prev.platform_interest.filter((p) => p !== value),
        }))
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormState('submitting')
    setErrorMsg('')

    try {
      const res = await fetch('/api/jamm-fleet', {
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
        <h3 className="font-serif text-2xl font-light text-jamm-dark sm:text-3xl">Inquiry Received</h3>
        <p className="mx-auto mt-3 max-w-md font-sans text-sm leading-relaxed text-jamm-dark/60">
          Thank you, <strong>{form.full_name.split(' ')[0]}</strong>. We have received your vehicle rental inquiry. Our team will review your information and contact you at{' '}
          <strong className="text-jamm-dark">{form.email}</strong> to discuss availability, pricing, requirements, and next steps.
        </p>
        <p className="mx-auto mt-3 max-w-md font-sans text-xs leading-relaxed text-jamm-dark/45">
          Vehicle availability is limited and assigned on a first-come, first-confirmed basis.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div>
        <label htmlFor="fleet-full-name" className={labelClass}>
          Full Name <span className="text-jamm-gold">*</span>
        </label>
        <input
          id="fleet-full-name"
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
          <label htmlFor="fleet-email" className={labelClass}>
            Email Address <span className="text-jamm-gold">*</span>
          </label>
          <input
            id="fleet-email"
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
          <label htmlFor="fleet-phone" className={labelClass}>
            Phone Number <span className="text-jamm-gold">*</span>
          </label>
          <input
            id="fleet-phone"
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            placeholder="+1 (555) 000-0000"
            className={inputClass}
            autoComplete="tel"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="fleet-state" className={labelClass}>
            State <span className="text-jamm-gold">*</span>
          </label>
          <select
            id="fleet-state"
            name="state"
            value={form.state}
            onChange={handleChange}
            required
            className={`${inputClass} cursor-pointer`}
          >
            <option value="">Select state...</option>
            <option value="Pennsylvania (PA)">Pennsylvania (PA)</option>
            <option value="New Jersey (NJ)">New Jersey (NJ)</option>
            <option value="Delaware (DE)">Delaware (DE)</option>
            <option value="Maryland (MD)">Maryland (MD)</option>
            <option value="Other nearby state">Other nearby state</option>
          </select>
        </div>
        <div>
          <label htmlFor="fleet-city" className={labelClass}>
            City <span className="text-jamm-gold">*</span>
          </label>
          <input
            id="fleet-city"
            type="text"
            name="city"
            value={form.city}
            onChange={handleChange}
            required
            placeholder="Your city"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="fleet-license" className={labelClass}>
          Driver&apos;s License Status <span className="text-jamm-gold">*</span>
        </label>
        <select
          id="fleet-license"
          name="license_status"
          value={form.license_status}
          onChange={handleChange}
          required
          className={`${inputClass} cursor-pointer`}
        >
          <option value="">Select license status...</option>
          <option value="Valid — standard">Valid — standard license</option>
          <option value="Valid — commercial">Valid — commercial license (CDL)</option>
          <option value="Expired">Expired</option>
          <option value="Suspended">Suspended</option>
          <option value="No license">No license yet</option>
        </select>
      </div>

      <div>
        <p className={`${labelClass} mb-3`}>Platform of Interest</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {PLATFORMS.map((platform) => (
            <label key={platform} className="flex cursor-pointer items-center gap-2.5 rounded-md border border-jamm-gold/20 bg-white/60 px-3 py-2.5 transition-colors hover:border-jamm-gold/50">
              <input
                type="checkbox"
                name="platform_interest"
                value={platform}
                checked={form.platform_interest.includes(platform)}
                onChange={handleChange}
                className="h-5 w-5 flex-shrink-0 cursor-pointer accent-jamm-gold"
              />
              <span className="font-sans text-xs font-medium text-jamm-dark">{platform}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="fleet-start-date" className={labelClass}>Desired Start Date</label>
          <input
            id="fleet-start-date"
            type="date"
            name="desired_start_date"
            value={form.desired_start_date}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="fleet-duration" className={labelClass}>Rental Duration</label>
          <select
            id="fleet-duration"
            name="rental_duration"
            value={form.rental_duration}
            onChange={handleChange}
            className={`${inputClass} cursor-pointer`}
          >
            <option value="">Select duration...</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
            <option value="3+ months">3+ months</option>
            <option value="Flexible">Flexible</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="fleet-insurance" className={labelClass}>Do you have your own auto insurance?</label>
        <select
          id="fleet-insurance"
          name="insurance_status"
          value={form.insurance_status}
          onChange={handleChange}
          className={`${inputClass} cursor-pointer`}
        >
          <option value="">Select...</option>
          <option value="Yes">Yes, I have coverage</option>
          <option value="No">No</option>
          <option value="Not sure">Not sure / will need guidance</option>
        </select>
      </div>

      <div>
        <label htmlFor="fleet-notes" className={labelClass}>Additional Notes</label>
        <textarea
          id="fleet-notes"
          name="notes"
          value={form.notes}
          onChange={handleChange}
          rows={3}
          placeholder="Any questions, specific vehicle preferences, or other details we should know"
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
            By submitting this form, you agree to be contacted by Jamm Trade regarding your vehicle rental inquiry. Your information will not be shared with third parties outside of the rental process. View our{' '}
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
        {formState === 'submitting' ? 'Submitting…' : 'Submit Rental Inquiry'}
      </button>
    </form>
  )
}
