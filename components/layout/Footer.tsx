'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { businessInfo } from '@/lib/businessInfo'
import { site } from '@/lib/site'
import { LanguageSelector, useLocale } from '@/components/i18n/LocaleProvider'

const serviceLinks = [
  { label: 'Jamm Cargo', href: '/jamm-cargo' },
  { label: 'Jamm Fleet', href: '/jamm-fleet' },
]

const footerLocation = 'Darby, Pennsylvania'

export function Footer() {
  const { t } = useLocale()
  const [activeBusinessInfo, setActiveBusinessInfo] = useState(businessInfo)
  const localizedShopLinks = [
    { label: t('footer.shop'), href: '/shop' },
    { label: t('nav.guides'), href: '/shop/guides' },
    { label: t('footer.about'), href: '/shop/about' },
    { label: t('nav.contact'), href: '/shop/contact' },
  ]
  const localizedLegalLinks = [
    { label: t('footer.shipping'), href: '/shop/shipping-policy' },
    { label: t('footer.refund'), href: '/shop/refund-policy' },
    { label: t('footer.privacy'), href: '/shop/privacy-policy' },
    { label: t('footer.terms'), href: '/shop/terms-of-service' },
  ]

  useEffect(() => {
    let isMounted = true

    fetch('/api/shopify/business-info')
      .then((response) => response.ok ? response.json() : null)
      .then((data: typeof businessInfo | null) => {
        if (!isMounted || !data) return
        setActiveBusinessInfo(data)
      })
      .catch(() => undefined)

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <footer className="mt-[clamp(40px,6vw,70px)] border-t-[1.5px] border-transparent bg-[linear-gradient(#15130e,#15130e)_padding-box,linear-gradient(135deg,#e0c074_0%,#c4973a_40%,#8b6914_64%,#e8d09a_100%)_border-box] px-[var(--jamm-pad)] text-jamm-cream">
      <div className="relative mx-auto max-w-[1240px] overflow-hidden">
        <div className="grid grid-cols-1 gap-[clamp(30px,5vw,56px)] py-[clamp(44px,6vw,72px)] md:grid-cols-[1.4fr_1fr_1fr_1fr] md:items-start">
          {/* Brand */}
          <div className="flex flex-col">
            <Link href="/shop" className="inline-flex flex-shrink-0 items-center gap-3">
              <Image
                src="/brand_assets/logos/jamm-trade-logo-badge.png"
                alt=""
                width={1254}
                height={1254}
                className="h-[52px] w-[52px] flex-shrink-0 rounded-full object-contain shadow-[0_2px_10px_rgba(12,11,9,0.18)] ring-1 ring-jamm-gold/35"
                aria-hidden="true"
              />
              <span className="flex flex-col leading-none">
                <span className="font-serif text-[23px] font-semibold uppercase tracking-[0.14em] text-jamm-cream">
                  JAMM TRADE
                </span>
                <span className="mt-1 font-sans text-[7px] font-semibold uppercase tracking-[0.32em] text-jamm-cream/62">
                  From Essentials to Enterprise
                </span>
              </span>
            </Link>
            <p className="mt-5 max-w-[40ch] font-sans text-base leading-relaxed text-jamm-cream/62">
              {t('footer.tagline')}
            </p>
            <div className="mt-5 space-y-1 font-sans text-sm leading-relaxed text-jamm-cream/62">
              <p className="font-semibold text-jamm-cream">{activeBusinessInfo.name}</p>
              <p>{footerLocation}</p>
              <a href={`mailto:${activeBusinessInfo.supportEmail}`} className="transition-colors hover:text-jamm-gold-light">
                {activeBusinessInfo.supportEmail}
              </a>
            </div>
          </div>

          {/* Shop links — desktop original */}
          <nav aria-label="Shop navigation" className="hidden flex-col gap-2 md:flex md:pt-1">
            <p className="mb-3 font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-jamm-cream">{t('footer.shop')}</p>
            {localizedShopLinks.map((link) => (
              <Link key={link.label} href={link.href} className="font-sans text-sm font-medium text-jamm-cream/62 transition-colors duration-200 hover:text-jamm-gold-light">{link.label}</Link>
            ))}
          </nav>
          {/* Shop links — mobile accordion */}
          <details className="footer-accordion group border-t border-jamm-gold/15 md:hidden">
            <summary className="flex cursor-pointer select-none list-none items-center justify-between py-3 [&::-webkit-details-marker]:hidden">
              <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-jamm-cream">{t('footer.shop')}</span>
              <svg className="h-3.5 w-3.5 flex-shrink-0 text-jamm-gold-light transition-transform duration-200 group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </summary>
            <div className="flex flex-col gap-2 pb-3 pt-1">
              {localizedShopLinks.map((link) => (
                <Link key={link.label} href={link.href} className="font-sans text-sm font-medium text-jamm-cream/62 transition-colors duration-200 hover:text-jamm-gold-light">{link.label}</Link>
              ))}
            </div>
          </details>

          {/* Services links — desktop original */}
          <nav aria-label="Services navigation" className="hidden flex-col gap-2 md:flex md:pt-1">
            <p className="mb-3 font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-jamm-cream">{t('footer.services')}</p>
            {serviceLinks.map((link) => (
              <Link key={link.label} href={link.href} className="font-sans text-sm font-medium text-jamm-cream/62 transition-colors duration-200 hover:text-jamm-gold-light">{link.label}</Link>
            ))}
          </nav>
          {/* Services links — mobile accordion */}
          <details className="footer-accordion group border-t border-jamm-gold/15 md:hidden">
            <summary className="flex cursor-pointer select-none list-none items-center justify-between py-3 [&::-webkit-details-marker]:hidden">
              <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-jamm-cream">{t('footer.services')}</span>
              <svg className="h-3.5 w-3.5 flex-shrink-0 text-jamm-gold-light transition-transform duration-200 group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </summary>
            <div className="flex flex-col gap-2 pb-3 pt-1">
              {serviceLinks.map((link) => (
                <Link key={link.label} href={link.href} className="font-sans text-sm font-medium text-jamm-cream/62 transition-colors duration-200 hover:text-jamm-gold-light">{link.label}</Link>
              ))}
            </div>
          </details>

          {/* Legal links — desktop original */}
          <nav aria-label="Legal navigation" className="hidden flex-col gap-2 md:flex md:pt-1">
            <p className="mb-3 font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-jamm-cream">{t('footer.policies')}</p>
            {localizedLegalLinks.map((link) => (
              <Link key={link.label} href={link.href} className="font-sans text-sm font-medium text-jamm-cream/62 transition-colors duration-200 hover:text-jamm-gold-light">{link.label}</Link>
            ))}
          </nav>
          {/* Legal links — mobile accordion */}
          <details className="footer-accordion group border-t border-jamm-gold/15 md:hidden">
            <summary className="flex cursor-pointer select-none list-none items-center justify-between py-3 [&::-webkit-details-marker]:hidden">
              <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-jamm-cream">{t('footer.policies')}</span>
              <svg className="h-3.5 w-3.5 flex-shrink-0 text-jamm-gold-light transition-transform duration-200 group-open:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </summary>
            <div className="flex flex-col gap-2 pb-3 pt-1">
              {localizedLegalLinks.map((link) => (
                <Link key={link.label} href={link.href} className="font-sans text-sm font-medium text-jamm-cream/62 transition-colors duration-200 hover:text-jamm-gold-light">{link.label}</Link>
              ))}
            </div>
          </details>
        </div>

        {/* Retailer disclaimer */}
        <div className="border-t border-jamm-gold-light/15 py-6">
          <p className="max-w-[70ch] font-sans text-[13px] leading-relaxed text-jamm-cream/62">
            {t('footer.disclaimer')}
          </p>
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-between border-t border-jamm-gold-light/15 py-4">
          <p className="font-sans text-xs text-jamm-cream/62">
            &copy; {new Date().getFullYear()} {site.name} LLC. {t('footer.rights')}
          </p>
          <LanguageSelector />
        </div>
      </div>
    </footer>
  )
}
