import type { Metadata } from 'next'
import Link from 'next/link'
import { JammCargoQuoteForm } from '@/components/jamm-cargo/JammCargoQuoteForm'

export const metadata: Metadata = {
  title: 'Jamm Cargo — Shipping Quote Request',
  description:
    'Request a shipping quote with Jamm Cargo. We ship products from the United States to Africa, Europe, and Asia. Submit your details and we will contact you with a personalized quote.',
  alternates: { canonical: '/jamm-cargo' },
}

const destinations = [
  {
    region: 'Africa',
    examples: 'Nigeria, Ghana, Senegal, Ivory Coast, Cameroon, and more',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5 text-jamm-gold" aria-hidden>
        <circle cx="12" cy="12" r="9" />
        <path d="M2 12h20M12 3a15.3 15.3 0 010 18M12 3a15.3 15.3 0 000 18" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    region: 'Europe',
    examples: 'France, UK, Germany, Italy, Spain, Belgium, and more',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5 text-jamm-gold" aria-hidden>
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 22V12h6v10" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    region: 'Asia',
    examples: 'Saudi Arabia, UAE, Qatar, Kuwait, and more',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5 text-jamm-gold" aria-hidden>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
]

const steps = [
  { number: '1', title: 'Submit your request', body: 'Fill in the form with your shipping details, destination, item type, and timeline.' },
  { number: '2', title: 'We review and quote', body: 'Our team reviews your request and contacts you with a personalized shipping quote.' },
  { number: '3', title: 'Confirm and ship', body: 'If you accept the quote, we coordinate with our shipping partners to arrange your shipment.' },
]

export default function JammCargoPage() {
  return (
    <section className="bg-transparent px-3 py-10 text-jamm-dark sm:px-4 lg:py-16">
      <div className="mx-auto max-w-[1100px] space-y-6">

        {/* Hero */}
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-lg border border-jamm-gold/25 bg-[#FBF8F2] p-6 shadow-[0_18px_50px_rgba(12,11,9,0.08)] sm:p-10">
            <p className="mb-3 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-jamm-gold">
              Jamm Cargo
            </p>
            <h1 className="font-serif text-4xl font-light leading-tight text-jamm-dark sm:text-5xl lg:text-6xl">
              Ship from the US to Africa, Europe & Asia
            </h1>
            <p className="mt-4 font-sans text-sm leading-relaxed text-jamm-dark/82 sm:text-base">
              Jamm Cargo is a quote-based shipping service. We work with trusted shipping partners to help you move products from the United States to destinations across Africa, Europe, and Asia.
            </p>
            <p className="mt-3 font-sans text-sm leading-relaxed text-jamm-dark/85">
              Submit your details below. We will review your request and contact you with a quote. If you accept, we proceed with our available partners.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href="#quote-form"
                className="inline-flex rounded-md bg-jamm-dark px-5 py-3 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition-colors duration-200 hover:bg-jamm-gold hover:text-jamm-dark"
              >
                Request a Quote
              </a>
              <Link
                href="/shop/contact"
                className="inline-flex rounded-md border border-jamm-gold/40 bg-transparent px-5 py-3 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-jamm-dark transition-colors duration-200 hover:border-jamm-gold hover:text-jamm-gold"
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

        {/* Service destinations */}
        <div className="rounded-lg border border-jamm-gold/25 bg-[#FBF8F2] p-6 shadow-[0_18px_50px_rgba(12,11,9,0.08)] sm:p-8">
          <p className="mb-3 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-jamm-gold">
            Destinations
          </p>
          <h2 className="mb-5 font-serif text-2xl font-light text-jamm-dark sm:text-3xl">
            Where we ship
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {destinations.map(({ region, examples, icon }) => (
              <div key={region} className="rounded-md border border-jamm-gold/15 bg-[#EDE8DC] p-5">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md border border-jamm-gold/25 bg-white">
                  {icon}
                </div>
                <h3 className="font-sans text-sm font-semibold text-jamm-dark">{region}</h3>
                <p className="mt-1.5 font-sans text-xs leading-relaxed text-jamm-dark/85">{examples}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 font-sans text-xs text-jamm-dark/85">
            Don&apos;t see your country listed? Submit a request anyway and we will let you know if we can accommodate your shipment.
          </p>
        </div>

        {/* Quote form */}
        <div id="quote-form" className="rounded-lg border border-jamm-gold/25 bg-[#FBF8F2] p-6 shadow-[0_18px_50px_rgba(12,11,9,0.08)] sm:p-10">
          <p className="mb-3 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-jamm-gold">
            Quote Request
          </p>
          <h2 className="mb-2 font-serif text-2xl font-light text-jamm-dark sm:text-3xl">
            Request a shipping quote
          </h2>
          <p className="mb-7 font-sans text-sm leading-relaxed text-jamm-dark/88">
            Fields marked <span className="text-jamm-gold">*</span> are required. After submitting, our team will review your request and contact you with a quote. If you accept, we coordinate the shipment with our available partners.
          </p>
          <JammCargoQuoteForm />
        </div>

        {/* Disclaimer */}
        <p className="px-1 font-sans text-xs leading-relaxed text-jamm-dark/85">
          Jamm Cargo is a quote-request and coordination service operated by Jamm Trade LLC. Pricing, availability, and transit times depend on the specific shipment and partners available at the time of request. Jamm Trade is not responsible for customs delays, duties, or import restrictions at the destination country. All quotes are subject to confirmation.
        </p>

      </div>
    </section>
  )
}
