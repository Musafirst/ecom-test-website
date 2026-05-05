import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for Jamm Trade.',
}

export default function PrivacyPolicyPage() {
  return (
    <section className="bg-white px-3 py-10 text-jamm-dark sm:px-4 lg:py-16">
      <div className="mx-auto max-w-[900px] rounded-[24px] bg-[#f6f6f6] px-6 py-12 sm:px-10">
        <p className="mb-3 font-sans text-sm text-jamm-muted">Shop policy</p>
        <h1 className="mb-6 font-sans text-4xl font-medium tracking-[-0.03em] sm:text-6xl">
          Privacy Policy
        </h1>
        <div className="space-y-5 font-sans text-base leading-relaxed text-jamm-dark/65">
          <p>
            Jamm Trade respects customer privacy. A full policy will be published before online checkout launches.
          </p>
          <p>
            For privacy questions, contact us directly.
          </p>
        </div>
        <Link
          href="mailto:contact@jammtrade.com"
          className="mt-8 inline-flex rounded-full bg-jamm-dark px-5 py-3 font-sans text-sm font-medium text-white transition-colors duration-200 hover:bg-jamm-gold hover:text-jamm-dark"
        >
          Contact
        </Link>
      </div>
    </section>
  )
}
