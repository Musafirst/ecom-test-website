'use client'

import { useState } from 'react'
import Link from 'next/link'

interface ShopShortcutsProps {
  collectionCounts: { oud: string; amber: string; daily: string }
}

const arrow = (
  <svg className="qcard__arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M7 17 17 7M9 7h8v8" />
  </svg>
)

export function ShopShortcuts({ collectionCounts }: ShopShortcutsProps) {
  const [allOpen, setAllOpen] = useState(false)

  const cards = [
    { name: 'Perfumes', eyebrow: 'Oud · Amber · Daily', href: '/shop/category/perfumes' },
    { name: 'Oud', eyebrow: collectionCounts.oud, href: '/shop/collection/oud' },
    { name: 'Electronics', eyebrow: 'Audio · Tech', href: '/shop/category/electronics' },
    { name: 'Clothing', eyebrow: 'Wear the mark', href: '/shop/category/clothing' },
  ]

  // The complete catalog map. Quieter categories (like Health & Wellness) live
  // only here so the homepage itself stays focused on the core lines.
  const allCategories = [
    { name: 'Perfumes', eyebrow: 'Oud · Amber · Daily', href: '/shop/category/perfumes' },
    { name: 'Oud', eyebrow: collectionCounts.oud, href: '/shop/collection/oud' },
    { name: 'Amber', eyebrow: collectionCounts.amber, href: '/shop/collection/amber' },
    { name: 'Daily', eyebrow: collectionCounts.daily, href: '/shop/collection/daily' },
    { name: 'Electronics', eyebrow: 'Audio · Tech', href: '/shop/category/electronics' },
    { name: 'Clothing', eyebrow: 'Wear the mark', href: '/shop/category/clothing' },
    { name: 'Health & Wellness', eyebrow: 'Supplements', href: '/shop/category/health' },
  ]

  return (
    <section className="quicklinks">
      <div className="container">
        <div className="quicklinks__scroll">
          {cards.map((card) => (
            <Link className="qcard" href={card.href} key={card.name}>
              <span className="qcard__eyebrow">{card.eyebrow}</span>
              <span className="qcard__row">
                <span className="qcard__name">{card.name}</span>
                {arrow}
              </span>
            </Link>
          ))}
        </div>

        <div className="allcats">
          <button
            type="button"
            className="allcats__toggle"
            aria-expanded={allOpen}
            aria-controls="all-categories"
            onClick={() => setAllOpen((open) => !open)}
          >
            All Categories
            <svg className="allcats__chev" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {allOpen && (
            <div className="allcats__grid" id="all-categories">
              {allCategories.map((cat) => (
                <Link className="qcard" href={cat.href} key={cat.name}>
                  <span className="qcard__eyebrow">{cat.eyebrow}</span>
                  <span className="qcard__row">
                    <span className="qcard__name">{cat.name}</span>
                    {arrow}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
