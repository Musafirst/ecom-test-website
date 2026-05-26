import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Jamm Trade',
  description: 'Jamm Trade is a US-based curated store offering authentic fragrances, electronics, and essentials.',
  alternates: {
    canonical: '/shop/about',
  },
}

const values = [
  {
    heading: 'Authentic Products',
    body: 'Every item sold by Jamm Trade is sourced and verified for authenticity. We do not sell counterfeits or grey-market goods.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5 text-jamm-gold" aria-hidden="true">
        <path d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 14.4l-4.8 2.5.9-5.4L4.2 7.7l5.4-.8z" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    heading: 'Curated with Intention',
    body: 'We select each product carefully — rare fragrances, reliable electronics, and everyday essentials chosen for quality and value.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5 text-jamm-gold" aria-hidden="true">
        <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
      </svg>
    ),
  },
  {
    heading: 'Transparent Business',
    body: 'Our policies, pricing, and contact details are clearly posted. We process all orders through secure Shopify checkout.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5 text-jamm-gold" aria-hidden="true">
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0110 0v4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    heading: 'US-Based & Shipping Worldwide',
    body: 'We ship from the United States with tracked delivery. Domestic orders arrive in 3–7 business days; international in 7–21.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5 text-jamm-gold" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M2 12h20M12 3a15.3 15.3 0 010 18M12 3a15.3 15.3 0 000 18" strokeLinecap="round" />
      </svg>
    ),
  },
]

const businessInfo = [
  { label: 'Business name', value: 'Jamm Trade' },
  { label: 'Location', value: 'United States' },
  { label: 'Email', value: 'contact@jammtrade.com', href: 'mailto:contact@jammtrade.com' },
  { label: 'Support hours', value: 'Monday – Friday, 10:00 AM – 6:00 PM ET' },
  { label: 'Checkout', value: 'Secure Shopify checkout' },
]

export default function AboutPage() {
  return (
    <section className="bg-transparent px-3 py-10 text-jamm-dark sm:px-4 lg:py-16">
      <div className="mx-auto max-w-[1100px] space-y-6">

        {/* Hero card */}
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-lg border border-jamm-gold/20 bg-[#FAF7F2]/92 p-6 shadow-[0_18px_50px_rgba(12,11,9,0.06)] sm:p-10">
            <p className="mb-3 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-jamm-gold">
              About us
            </p>
            <h1 className="font-serif text-4xl font-light leading-tight text-jamm-dark sm:text-6xl">
              Jamm Trade
            </h1>
            <p className="mt-4 font-sans text-sm leading-relaxed text-jamm-dark/68 sm:text-base">
              Jamm Trade is a US-based curated store offering authentic fragrances, consumer electronics, and everyday essentials. We source products with care and ship directly to customers across the United States and internationally.
            </p>
            <p className="mt-3 font-sans text-sm leading-relaxed text-jamm-dark/68 sm:text-base">
              Every order is processed through secure Shopify checkout. Our policies are transparent, our products are authentic, and our team is reachable for any questions or concerns.
            </p>
          </div>

          {/* Business info card */}
          <div className="rounded-lg border border-jamm-gold/20 bg-[#EDE8DC] p-6 shadow-[0_18px_50px_rgba(12,11,9,0.06)] sm:p-10">
            <p className="mb-5 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-jamm-gold">
              Business information
            </p>
            <dl className="space-y-4">
              {businessInfo.map(({ label, value, href }) => (
                <div key={label}>
                  <dt className="font-sans text-[11px] font-semibold uppercase tracking-[0.15em] text-jamm-dark/45">
                    {label}
                  </dt>
                  <dd className="mt-1 font-sans text-sm text-jamm-dark">
                    {href ? (
                      <Link href={href} className="text-jamm-gold hover:underline">
                        {value}
                      </Link>
                    ) : (
                      value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* What we sell */}
        <div className="rounded-lg border border-jamm-gold/20 bg-[#FAF7F2]/92 p-6 shadow-[0_18px_50px_rgba(12,11,9,0.06)] sm:p-10">
          <p className="mb-3 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-jamm-gold">
            What we sell
          </p>
          <h2 className="font-serif text-2xl font-light text-jamm-dark sm:text-3xl">
            Fragrances, Electronics & Essentials
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              {
                category: 'Fragrances',
                description: 'Rare and everyday perfumes spanning Oud, Amber, and Daily collections — sourced for authenticity and character.',
              },
              {
                category: 'Electronics',
                description: 'Headphones, earbuds, smartwatches, and audio accessories from trusted brands.',
              },
              {
                category: 'Essentials',
                description: 'Curated everyday items chosen for quality, utility, and value.',
              },
            ].map(({ category, description }) => (
              <div key={category} className="rounded-md border border-jamm-gold/15 bg-[#EDE8DC] p-5">
                <h3 className="font-sans text-sm font-semibold text-jamm-dark">{category}</h3>
                <p className="mt-2 font-sans text-xs leading-relaxed text-jamm-dark/60">{description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Values grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          {values.map(({ heading, body, icon }) => (
            <div
              key={heading}
              className="flex gap-4 rounded-lg border border-jamm-gold/20 bg-[#FAF7F2]/92 p-6 shadow-[0_18px_50px_rgba(12,11,9,0.06)]"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md border border-jamm-gold/25 bg-white/35">
                {icon}
              </div>
              <div>
                <h3 className="font-sans text-sm font-semibold text-jamm-dark">{heading}</h3>
                <p className="mt-1.5 font-sans text-xs leading-relaxed text-jamm-dark/60">{body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href="/shop/contact"
            className="inline-flex rounded-md bg-jamm-dark px-5 py-3 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition-colors duration-200 hover:bg-jamm-gold hover:text-jamm-dark"
          >
            Contact us
          </Link>
          <Link
            href="/shop"
            className="inline-flex rounded-md border border-jamm-gold/40 bg-transparent px-5 py-3 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-jamm-dark transition-colors duration-200 hover:border-jamm-gold hover:text-jamm-gold"
          >
            Shop now
          </Link>
        </div>

      </div>
    </section>
  )
}
