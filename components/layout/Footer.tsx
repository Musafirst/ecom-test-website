import Image from 'next/image'
import Link from 'next/link'

const footerLinks = [
  { label: 'Shop', href: '/shop' },
  { label: 'Contact', href: 'mailto:contact@jammtrade.com' },
  { label: 'Shipping & Returns', href: '/shop/shipping-returns' },
  { label: 'Privacy Policy', href: '/shop/privacy-policy' },
]

export function Footer() {
  return (
    <footer className="bg-[#FAF7F2] px-3 pb-4 sm:px-4">
      <div className="mx-auto max-w-[1560px] rounded-[22px] border border-jamm-gold/20 bg-[#EDE8DC] px-6 py-16">
        <div className="flex w-full flex-col items-center justify-between gap-8 overflow-hidden md:flex-row">
          <Link href="/shop" className="flex flex-shrink-0 items-center overflow-hidden">
            <Image
              src="/brand_assets/logos/jamm-trade-exact-transparent.png"
              alt="Jamm Trade"
              width={1536}
              height={1024}
              className="h-20 w-auto flex-shrink-0 object-contain md:h-[170px] lg:h-[195px]"
            />
          </Link>

          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
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
