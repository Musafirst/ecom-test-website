import type { Metadata } from 'next'
import Link from 'next/link'
import { JammFleetApplicationForm } from '@/components/jamm-fleet/JammFleetApplicationForm'

export const metadata: Metadata = {
  title: 'Jamm Fleet — Vehicle Rental Inquiry',
  description:
    'Rent a vehicle through Jamm Fleet for personal use or gig platforms like Uber, DoorDash, Grubhub, and Lyft. Serving Pennsylvania, New Jersey, Delaware, and Maryland. Submit an inquiry to check availability.',
  alternates: { canonical: '/jamm-fleet' },
}

const platforms = ['Uber', 'DoorDash', 'Grubhub', 'Lyft', 'Personal Use']

const serviceAreas = [
  { state: 'Pennsylvania', abbr: 'PA' },
  { state: 'New Jersey', abbr: 'NJ' },
  { state: 'Delaware', abbr: 'DE' },
  { state: 'Maryland', abbr: 'MD' },
]

const steps = [
  { number: '1', title: 'Submit your inquiry', body: 'Fill in the form with your details, preferred platform, and rental timeline.' },
  { number: '2', title: 'We review availability', body: 'Our team reviews your inquiry and contacts you to discuss vehicle availability, pricing, and requirements.' },
  { number: '3', title: 'Get on the road', body: 'If everything works out, we finalize the arrangement and get you set up.' },
]

export default function JammFleetPage() {
  return (
    <section className="bg-transparent px-3 py-10 text-jamm-dark sm:px-4 lg:py-16">
      <div className="mx-auto max-w-[1100px] space-y-6">

        {/* Hero */}
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-lg border border-jamm-gold/25 bg-[#FBF8F2] p-6 shadow-[0_18px_50px_rgba(12,11,9,0.08)] sm:p-10">
            <p className="mb-3 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-jamm-gold">
              Jamm Fleet
            </p>
            <h1 className="[overflow-wrap:anywhere] font-serif text-[clamp(2rem,9vw,3rem)] font-light leading-[1.08] text-jamm-dark sm:text-5xl lg:text-6xl">
              Vehicle Rental for Gig Workers & Personal Use
            </h1>
            <p className="mt-4 font-sans text-sm leading-relaxed text-jamm-dark/82 sm:text-base">
              Jamm Fleet provides vehicle rental for individuals who want to drive for Uber, DoorDash, Grubhub, Lyft, or for personal use. We currently have a limited number of vehicles available in the Pennsylvania and tri-state area.
            </p>
            <p className="mt-3 font-sans text-sm leading-relaxed text-jamm-dark/85">
              Vehicle availability is limited. Submit an inquiry below and we will contact you to discuss availability, pricing, requirements, and next steps.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#inquiry-form"
                className="inline-flex min-h-11 max-w-full items-center justify-center rounded-md bg-jamm-dark px-4 py-3 text-center font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-white transition-colors duration-200 hover:bg-jamm-gold hover:text-jamm-dark min-[380px]:px-5 min-[380px]:tracking-[0.14em]"
              >
                Submit Inquiry
              </a>
              <Link
                href="/shop/contact"
                className="inline-flex min-h-11 max-w-full items-center justify-center rounded-md border border-jamm-gold/40 bg-transparent px-4 py-3 text-center font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-jamm-dark transition-colors duration-200 hover:border-jamm-gold hover:text-jamm-gold min-[380px]:px-5 min-[380px]:tracking-[0.14em]"
              >
                Contact Us
              </Link>
            </div>
          </div>

          {/* How it works */}
          <div className="rounded-lg border border-jamm-gold/25 bg-[#EDE8DC] p-6 shadow-[0_18px_50px_rgba(12,11,9,0.08)] sm:p-10">
            <p className="mb-5 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-jamm-gold">
              How it works
            </p>
            <ol className="space-y-5">
              {steps.map((step) => (
                <li key={step.number} className="flex gap-4">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-jamm-gold/40 bg-white font-sans text-[13px] font-semibold text-jamm-gold">
                    {step.number}
                  </div>
                  <div>
                    <h3 className="font-sans text-sm font-semibold text-jamm-dark">{step.title}</h3>
                    <p className="mt-1 font-sans text-xs leading-relaxed text-jamm-dark/85">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Service area + platforms */}
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-lg border border-jamm-gold/25 bg-[#FBF8F2] p-6 shadow-[0_18px_50px_rgba(12,11,9,0.08)]">
            <p className="mb-3 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-jamm-gold">
              Service Area
            </p>
            <h2 className="mb-4 font-serif text-xl font-light text-jamm-dark sm:text-2xl">
              PA, NJ, DE & MD
            </h2>
            <div className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-2">
              {serviceAreas.map(({ state, abbr }) => (
                <div key={abbr} className="flex min-w-0 items-center gap-2.5 rounded-md border border-jamm-gold/15 bg-[#EDE8DC] px-3 py-2.5">
                  <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-jamm-gold/30 bg-white font-sans text-[10px] font-bold text-jamm-gold">
                    {abbr}
                  </span>
                  <span className="min-w-0 [overflow-wrap:anywhere] font-sans text-xs font-medium leading-snug text-jamm-dark">{state}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 font-sans text-xs text-jamm-dark/85">
              Located near the PA/NJ/DE/MD region? We may be able to accommodate nearby states — include your city in the inquiry.
            </p>
          </div>

          <div className="rounded-lg border border-jamm-gold/25 bg-[#FBF8F2] p-6 shadow-[0_18px_50px_rgba(12,11,9,0.08)]">
            <p className="mb-3 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-jamm-gold">
              Supported Platforms
            </p>
            <h2 className="mb-4 font-serif text-xl font-light text-jamm-dark sm:text-2xl">
              Drive with any gig platform
            </h2>
            <div className="flex flex-wrap gap-2">
              {platforms.map((p) => (
                <span
                  key={p}
                  className="max-w-full [overflow-wrap:anywhere] rounded-full border border-jamm-gold/30 bg-[#EDE8DC] px-3.5 py-1.5 font-sans text-xs font-medium leading-snug text-jamm-dark"
                >
                  {p}
                </span>
              ))}
            </div>
            <p className="mt-4 font-sans text-xs text-jamm-dark/85">
              Vehicle requirements vary by platform. We will review requirements together during the inquiry process.
            </p>
          </div>
        </div>

        {/* Application form */}
        <div id="inquiry-form" className="rounded-lg border border-jamm-gold/25 bg-[#FBF8F2] p-6 shadow-[0_18px_50px_rgba(12,11,9,0.08)] sm:p-10">
          <p className="mb-3 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-jamm-gold">
            Rental Inquiry
          </p>
          <h2 className="mb-2 font-serif text-2xl font-light text-jamm-dark sm:text-3xl">
            Submit a vehicle rental inquiry
          </h2>
          <p className="mb-7 font-sans text-sm leading-relaxed text-jamm-dark/88">
            Fields marked <span className="text-jamm-gold">*</span> are required. Vehicle availability is limited and assigned on a first-come, first-confirmed basis. After submitting, our team will contact you to discuss availability, pricing, requirements, and next steps.
          </p>
          <JammFleetApplicationForm />
        </div>

        {/* Disclaimer */}
        <p className="px-1 font-sans text-xs leading-relaxed text-jamm-dark/85">
          Jamm Fleet is a vehicle rental service operated by Jamm Trade LLC. Submitting an inquiry does not guarantee vehicle availability or rental approval. All rentals are subject to driver qualification, availability, and agreement to rental terms. Jamm Trade LLC is not affiliated with, endorsed by, or a partner of Uber, DoorDash, Grubhub, or Lyft. Platform driver requirements are set independently by those companies.
        </p>

      </div>
    </section>
  )
}
