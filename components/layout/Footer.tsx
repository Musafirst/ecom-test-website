'use client'

import { useState } from 'react'
import Link from 'next/link'
import { LanguageSelector } from '@/components/i18n/LocaleProvider'

const columns = [
  {
    title: 'Shop',
    links: [
      { label: 'Fragrance', href: '/shop/category/perfumes' },
      { label: 'Oud', href: '/shop/collection/oud' },
      { label: 'Amber', href: '/shop/collection/amber' },
      { label: 'Clothing', href: '/shop/category/clothing' },
      { label: 'Electronics', href: '/shop/category/electronics' },
    ],
  },
  {
    title: 'Services',
    links: [
      { label: 'Jamm Fleet', href: '/jamm-fleet' },
      { label: 'Jamm Cargo', href: '/jamm-cargo' },
      { label: 'Fragrance Guides', href: '/shop/guides' },
    ],
  },
  {
    title: 'Policies & Support',
    links: [
      { label: 'Contact Support', href: '/shop/contact' },
      { label: 'Shipping & Returns', href: '/shop/shipping-returns' },
      { label: 'Privacy Policy', href: '/shop/privacy-policy' },
      { label: 'Terms of Service', href: '/shop/terms-of-service' },
      { label: 'Refund Policy', href: '/shop/refund-policy' },
    ],
  },
]

export function Footer() {
  const [open, setOpen] = useState<string | null>(null)

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__top">
          <div className="footer__brand">
            <div className="footer__logo">
              <img className="brand__mark" src="/design/logo-badge.png" alt="Jamm Trade lotus emblem" width={46} height={46} />
              <span className="brand__type">
                <span className="brand__name">JAMM TRADE</span>
                <span className="brand__tag">From Essentials to Enterprise</span>
              </span>
            </div>
            <p className="footer__desc">Rare fragrances and curated essentials for those who know the difference.</p>
            <div className="footer__contact">
              <strong>Jamm Trade LLC</strong>
              <span>Darby, Pennsylvania</span>
              <span>contact@jammtrade.com</span>
              <span><a href="tel:+14845216277" className="transition-colors hover:text-[#e8d09a]">(484) 521-6277</a></span>
            </div>
          </div>

          <div className="footer__cols">
            {columns.map((col) => (
              <div className={`fcol${open === col.title ? ' is-open' : ''}`} key={col.title}>
                <button className="fcol__head" onClick={() => setOpen((cur) => (cur === col.title ? null : col.title))}>
                  {col.title}
                  <svg className="chev" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
                </button>
                <div className="fcol__list">
                  <div>
                    {col.links.map((link) => (
                      <Link key={link.label} href={link.href}>{link.label}</Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="footer__legal">
          {/* Accepted payment methods, mirroring Shopify checkout's configuration. */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 pb-1">
            <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-[#b6ac96]">We accept</span>
            {['Visa', 'Mastercard', 'American Express', 'Discover', 'Diners Club', 'Shop Pay', 'Apple Pay', 'Google Pay'].map((method) => (
              <span
                key={method}
                className="rounded border border-[#e8d09a]/25 px-2 py-1 font-sans text-[10px] font-medium text-[#efe9dc]/80"
              >
                {method}
              </span>
            ))}
          </div>
          <p className="footer__disclaimer">Jamm Trade LLC is an independent retailer. We are not officially affiliated with or endorsed by the brands displayed on this site unless explicitly stated. All brand names and trademarks belong to their respective owners.</p>
          <div className="footer__bottom">
            <span className="footer__copy">© 2026 Jamm Trade LLC. All rights reserved.</span>
            <LanguageSelector />
          </div>
        </div>
      </div>
    </footer>
  )
}
