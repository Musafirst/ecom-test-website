import Image from 'next/image'
import Link from 'next/link'
import { BorderBeam } from '@/components/ui/border-beam'
import { site } from '@/lib/site'

const shopLinks = [
  { label: 'Shop', href: '/shop' },
  { label: 'About', href: '/shop/about' },
  { label: 'Contact', href: '/shop/contact' },
]

const serviceLinks = [
  { label: 'Jamm Cargo', href: '/jamm-cargo' },
  { label: 'Jamm Fleet', href: '/jamm-fleet' },
]

const legalLinks = [
  { label: 'Shipping Policy', href: '/shop/shipping-policy' },
  { label: 'Refund Policy', href: '/shop/refund-policy' },
  { label: 'Privacy Policy', href: '/shop/privacy-policy' },
  { label: 'Terms of Service', href: '/shop/terms-of-service' },
]

export function Footer() {
  return (
    <footer className="bg-transparent px-3 pb-4 sm:px-4">
      <div className="relative mx-auto max-w-[1560px] overflow-hidden rounded-[18px] border border-jamm-gold/35 bg-[#EDE8DC] shadow-[0_18px_50px_rgba(12,11,9,0.07)] sm:rounded-[22px]">
        <BorderBeam size={480} duration={14} borderWidth={2.5} colorFrom="#C4973A" colorTo="#F8E7A6" delay={2} />

        <div className="grid grid-cols-1 gap-8 px-5 py-8 sm:px-8 md:grid-cols-[260px_1fr_1fr_1fr] md:items-start md:gap-8 md:py-12 lg:py-14">
          {/* Brand */}
          <div className="flex flex-col">
            <Link href="/shop" className="inline-flex flex-shrink-0 items-center">
              <Image
                src="/brand_assets/logos/jamm-trade-exact-transparent.webp"
                alt="Jamm Trade"
                width={1536}
                height={1024}
                className="h-[88px] w-auto flex-shrink-0 object-contain sm:h-[102px] md:h-[118px]"
              />
            </Link>
            <p className="mt-2 max-w-[200px] font-sans text-xs leading-relaxed text-jamm-dark/48">
              Rare fragrances and curated essentials for those who know the difference.
            </p>
          </div>

          {/* Shop links */}
          <nav aria-label="Shop navigation" className="flex flex-col gap-2 md:pt-1">
            <p className="mb-1 font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-jamm-dark/45">Shop</p>
            {shopLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="font-sans text-sm font-medium text-jamm-dark/55 transition-colors duration-200 hover:text-jamm-gold"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Services links */}
          <nav aria-label="Services navigation" className="flex flex-col gap-2 md:pt-1">
            <p className="mb-1 font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-jamm-dark/45">Services</p>
            {serviceLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="font-sans text-sm font-medium text-jamm-dark/55 transition-colors duration-200 hover:text-jamm-gold"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Legal links */}
          <nav aria-label="Legal navigation" className="flex flex-col gap-2 md:pt-1">
            <p className="mb-1 font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-jamm-dark/45">Policies</p>
            {legalLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="font-sans text-sm font-medium text-jamm-dark/55 transition-colors duration-200 hover:text-jamm-gold"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Retailer disclaimer */}
        <div className="border-t border-jamm-gold/15 px-5 py-4 sm:px-8">
          <p className="max-w-3xl font-sans text-[11px] leading-relaxed text-jamm-dark/42">
            Jamm Trade LLC is an independent retailer. We are not officially affiliated with or endorsed by the brands displayed on this site unless explicitly stated. All brand names and trademarks belong to their respective owners.
          </p>
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-between border-t border-jamm-gold/18 px-5 py-4 sm:px-8">
          <p className="font-sans text-xs text-jamm-dark/38">
            &copy; {new Date().getFullYear()} {site.name} LLC. All rights reserved.
          </p>
          <div className="flex items-center gap-3.5">
            <a
              href="#"
              aria-label="Jamm Trade on Instagram"
              className="text-jamm-dark/38 transition-colors duration-200 hover:text-jamm-gold"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-4 w-4" aria-hidden>
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeLinecap="round" />
              </svg>
            </a>
            <a
              href="#"
              aria-label="Jamm Trade on TikTok"
              className="text-jamm-dark/38 transition-colors duration-200 hover:text-jamm-gold"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-[15px] w-[15px]" aria-hidden>
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
