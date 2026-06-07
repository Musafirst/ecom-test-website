'use client'

import Image from 'next/image'
import Link from 'next/link'
import { BorderBeam } from '@/components/ui/border-beam'
import { businessInfo } from '@/lib/businessInfo'
import { site } from '@/lib/site'
import { LanguageSelector, useLocale } from '@/components/i18n/LocaleProvider'

const serviceLinks = [
  { label: 'Jamm Cargo', href: '/jamm-cargo' },
  { label: 'Jamm Fleet', href: '/jamm-fleet' },
]

export function Footer() {
  const { t } = useLocale()
  const localizedShopLinks = [
    { label: t('footer.shop'), href: '/shop' },
    { label: t('footer.about'), href: '/shop/about' },
    { label: t('nav.contact'), href: '/shop/contact' },
  ]
  const localizedLegalLinks = [
    { label: t('footer.shipping'), href: '/shop/shipping-policy' },
    { label: t('footer.refund'), href: '/shop/refund-policy' },
    { label: t('footer.privacy'), href: '/shop/privacy-policy' },
    { label: t('footer.terms'), href: '/shop/terms-of-service' },
  ]

  return (
    <footer className="bg-transparent px-3 pb-4 sm:px-4">
      <div className="relative mx-auto max-w-[1560px] overflow-hidden rounded-[18px] border border-jamm-gold/35 bg-[#EDE8DC] shadow-[0_18px_50px_rgba(12,11,9,0.07)] sm:rounded-[22px]">
        <BorderBeam size={480} duration={14} borderWidth={2.5} colorFrom="#C4973A" colorTo="#F8E7A6" delay={2} />

        <div className="grid grid-cols-1 gap-0 px-5 py-8 sm:px-8 md:grid-cols-[260px_1fr_1fr_1fr] md:items-start md:gap-8 md:py-12 lg:py-14">
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
              {t('footer.tagline')}
            </p>
            <div className="mt-4 space-y-1 font-sans text-xs leading-relaxed text-jamm-dark/52">
              <p className="font-semibold text-jamm-dark/62">{businessInfo.name}</p>
              <p>{businessInfo.publicLocation}</p>
              <a href={`mailto:${businessInfo.supportEmail}`} className="transition-colors hover:text-jamm-gold">
                {businessInfo.supportEmail}
              </a>
            </div>
          </div>

          {/* Shop links — desktop original */}
          <nav aria-label="Shop navigation" className="hidden flex-col gap-2 md:flex md:pt-1">
            <p className="mb-1 font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-jamm-dark/45">{t('footer.shop')}</p>
            {localizedShopLinks.map((link) => (
              <Link key={link.label} href={link.href} className="font-sans text-sm font-medium text-jamm-dark/55 transition-colors duration-200 hover:text-jamm-gold">{link.label}</Link>
            ))}
          </nav>
          {/* Shop links — mobile accordion */}
          <details className="footer-accordion group border-t border-jamm-gold/15 md:hidden">
            <summary className="flex cursor-pointer select-none list-none items-center justify-between py-3 [&::-webkit-details-marker]:hidden">
              <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-jamm-dark/45">{t('footer.shop')}</span>
              <svg className="h-3.5 w-3.5 flex-shrink-0 text-jamm-dark/35 transition-transform duration-200 group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </summary>
            <div className="flex flex-col gap-2 pb-3 pt-1">
              {localizedShopLinks.map((link) => (
                <Link key={link.label} href={link.href} className="font-sans text-sm font-medium text-jamm-dark/55 transition-colors duration-200 hover:text-jamm-gold">{link.label}</Link>
              ))}
            </div>
          </details>

          {/* Services links — desktop original */}
          <nav aria-label="Services navigation" className="hidden flex-col gap-2 md:flex md:pt-1">
            <p className="mb-1 font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-jamm-dark/45">{t('footer.services')}</p>
            {serviceLinks.map((link) => (
              <Link key={link.label} href={link.href} className="font-sans text-sm font-medium text-jamm-dark/55 transition-colors duration-200 hover:text-jamm-gold">{link.label}</Link>
            ))}
          </nav>
          {/* Services links — mobile accordion */}
          <details className="footer-accordion group border-t border-jamm-gold/15 md:hidden">
            <summary className="flex cursor-pointer select-none list-none items-center justify-between py-3 [&::-webkit-details-marker]:hidden">
              <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-jamm-dark/45">{t('footer.services')}</span>
              <svg className="h-3.5 w-3.5 flex-shrink-0 text-jamm-dark/35 transition-transform duration-200 group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </summary>
            <div className="flex flex-col gap-2 pb-3 pt-1">
              {serviceLinks.map((link) => (
                <Link key={link.label} href={link.href} className="font-sans text-sm font-medium text-jamm-dark/55 transition-colors duration-200 hover:text-jamm-gold">{link.label}</Link>
              ))}
            </div>
          </details>

          {/* Legal links — desktop original */}
          <nav aria-label="Legal navigation" className="hidden flex-col gap-2 md:flex md:pt-1">
            <p className="mb-1 font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-jamm-dark/45">{t('footer.policies')}</p>
            {localizedLegalLinks.map((link) => (
              <Link key={link.label} href={link.href} className="font-sans text-sm font-medium text-jamm-dark/55 transition-colors duration-200 hover:text-jamm-gold">{link.label}</Link>
            ))}
          </nav>
          {/* Legal links — mobile accordion */}
          <details className="footer-accordion group border-t border-jamm-gold/15 md:hidden">
            <summary className="flex cursor-pointer select-none list-none items-center justify-between py-3 [&::-webkit-details-marker]:hidden">
              <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-jamm-dark/45">{t('footer.policies')}</span>
              <svg className="h-3.5 w-3.5 flex-shrink-0 text-jamm-dark/35 transition-transform duration-200 group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </summary>
            <div className="flex flex-col gap-2 pb-3 pt-1">
              {localizedLegalLinks.map((link) => (
                <Link key={link.label} href={link.href} className="font-sans text-sm font-medium text-jamm-dark/55 transition-colors duration-200 hover:text-jamm-gold">{link.label}</Link>
              ))}
            </div>
          </details>
        </div>

        {/* Retailer disclaimer */}
        <div className="border-t border-jamm-gold/15 px-5 py-4 sm:px-8">
          <p className="max-w-3xl font-sans text-[11px] leading-relaxed text-jamm-dark/42">
            {t('footer.disclaimer')}
          </p>
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-between border-t border-jamm-gold/18 px-5 py-4 sm:px-8">
          <p className="font-sans text-xs text-jamm-dark/38">
            &copy; {new Date().getFullYear()} {site.name} LLC. {t('footer.rights')}
          </p>
          <LanguageSelector />
        </div>
      </div>
    </footer>
  )
}
