import Image from 'next/image'
import Link from 'next/link'
import { BorderBeam } from '@/components/ui/border-beam'

const footerLinks = [
  { label: 'Shop', href: '/shop' },
  { label: 'Contact', href: 'mailto:contact@jammtrade.com' },
  { label: 'Shipping & Returns', href: '/shop/shipping-returns' },
  { label: 'Privacy Policy', href: '/shop/privacy-policy' },
]

export function Footer() {
  return (
    <footer className="bg-[#FAF7F2] px-3 pb-4 sm:px-4">
      <div className="relative mx-auto max-w-[1560px] overflow-hidden rounded-[22px] border border-jamm-gold/35 bg-[#EDE8DC] px-6 py-10 md:py-16">
        <BorderBeam size={480} duration={14} borderWidth={2.5} colorFrom="#C4973A" colorTo="#F8E7A6" delay={2} />
        <div className="flex w-full flex-col items-center justify-between gap-6 md:flex-row md:gap-8">
          <Link href="/shop" className="flex flex-shrink-0 items-center">
            <Image
              src="/brand_assets/logos/jamm-trade-exact-transparent.png"
              alt="Jamm Trade"
              width={1536}
              height={1024}
              className="h-[128px] w-auto flex-shrink-0 object-contain md:h-[170px] lg:h-[195px]"
            />
          </Link>

          <nav className="flex flex-col items-center justify-center gap-3 md:flex-row md:flex-wrap md:gap-x-6 md:gap-y-3">
            {footerLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="font-sans text-sm text-jamm-dark/50 transition-colors duration-200 hover:text-jamm-gold"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <p className="font-sans text-sm text-jamm-dark/35">
            &copy; {new Date().getFullYear()} Jamm Trade
          </p>
        </div>
      </div>
    </footer>
  )
}
