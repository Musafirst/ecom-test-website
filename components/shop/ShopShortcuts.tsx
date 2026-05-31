'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { categoryDetails, collectionDetails } from '@/lib/products'

interface ShopShortcutsProps {
  collectionCounts?: Record<'oud' | 'amber' | 'daily', string>
}

export function ShopShortcuts({ collectionCounts }: ShopShortcutsProps) {
  const counts = collectionCounts ?? {
    oud: collectionDetails.oud.count,
    amber: collectionDetails.amber.count,
    daily: collectionDetails.daily.count,
  }

  const shortcuts = [
    {
      label: 'Perfumes',
      detail: 'Oud · Amber · Daily',
      href: '/shop/category/perfumes',
    },
    {
      label: 'Oud',
      detail: counts.oud,
      href: '/shop/collection/oud',
    },
    {
      label: 'Amber',
      detail: counts.amber,
      href: '/shop/collection/amber',
    },
    {
      label: 'Daily',
      detail: counts.daily,
      href: '/shop/collection/daily',
    },
    {
      label: 'Electronics',
      detail: categoryDetails.electronics.name,
      href: '/shop/category/electronics',
    },
    {
      label: 'Clothing',
      detail: categoryDetails.clothing.name,
      href: '/shop/collection/clothing',
    },
  ]

  return (
    <section className="bg-transparent px-3 pb-4 sm:px-4 lg:pb-6">
      <motion.div
        className="mx-auto max-w-[1560px]"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="no-scrollbar flex snap-x gap-2.5 overflow-x-auto pb-2 lg:grid lg:grid-cols-6 lg:overflow-visible lg:pb-0">
          {shortcuts.map((item) => {
            const inner = (
              <>
                <span className="min-w-0 truncate font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-jamm-gold">
                  {item.detail}
                </span>
                <span className="mt-2 grid grid-cols-[minmax(0,1fr)_28px] items-center gap-3 font-sans text-base font-semibold text-jamm-dark">
                  <span className="min-w-0 truncate">{item.label}</span>
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-jamm-dark/6 text-jamm-dark/55 transition-colors group-hover:bg-jamm-gold group-hover:text-jamm-dark">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-3.5 w-3.5" aria-hidden="true">
                      <path d="M7 17L17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </span>
              </>
            )
            return (
              <Link
                key={item.label}
                href={item.href}
                className="group flex min-w-[142px] snap-start flex-col justify-between rounded-lg border border-jamm-gold/25 bg-[#FAF7F2]/82 px-4 py-3 shadow-[0_12px_28px_rgba(12,11,9,0.05)] backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:border-jamm-gold/65 hover:bg-[#EDE8DC] hover:shadow-[0_18px_42px_rgba(12,11,9,0.09)] sm:min-w-[170px] lg:min-w-0"
              >
                {inner}
              </Link>
            )
          })}
        </div>
      </motion.div>
    </section>
  )
}
