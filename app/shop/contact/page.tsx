import type { Metadata } from 'next'
import Link from 'next/link'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact Jamm Trade for order support, product questions, shipping, returns, and policy help.',
  alternates: {
    canonical: '/shop/contact',
  },
}

export default function ContactPage() {
  return (
    <section className="bg-transparent px-3 py-10 text-jamm-dark sm:px-4 lg:py-16">
      <div className="mx-auto grid max-w-[1100px] gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-lg border border-jamm-gold/20 bg-[#FAF7F2]/92 p-6 shadow-[0_18px_50px_rgba(12,11,9,0.06)] sm:p-10">
          <p className="mb-3 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-jamm-gold">
            Customer care
          </p>
          <h1 className="font-serif text-4xl font-light leading-tight text-jamm-dark sm:text-6xl">
            Contact Jamm Trade
          </h1>
          <p className="mt-4 font-sans text-sm leading-relaxed text-jamm-dark/68 sm:text-base">
            For order support, product questions, shipping, returns, or policy help, reach the Jamm Trade team directly.
          </p>
        </div>

        <div className="rounded-lg border border-jamm-gold/20 bg-[#EDE8DC] p-6 shadow-[0_18px_50px_rgba(12,11,9,0.06)] sm:p-10">
          <div className="space-y-6 font-sans text-sm leading-relaxed text-jamm-dark/68">
            <div>
              <h2 className="font-sans text-base font-semibold text-jamm-dark">Email</h2>
              <Link href={`mailto:${site.supportEmail}`} className="mt-2 inline-flex text-jamm-gold hover:text-jamm-gold-muted">
                {site.supportEmail}
              </Link>
            </div>
            <div>
              <h2 className="font-sans text-base font-semibold text-jamm-dark">Support Hours</h2>
              <p className="mt-2">Monday through Friday, 10:00 AM to 6:00 PM Eastern Time.</p>
            </div>
            <div>
              <h2 className="font-sans text-base font-semibold text-jamm-dark">Order Help</h2>
              <p className="mt-2">
                Include your order number, product name, delivery address, and clear photos if you are contacting us about a damaged or incorrect item.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
