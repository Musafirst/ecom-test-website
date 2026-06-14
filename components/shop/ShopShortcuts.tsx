'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { categoryDetails, collectionDetails } from '@/lib/products'
import { useLocale } from '@/components/i18n/LocaleProvider'

interface ShopShortcutsProps {
  collectionCounts?: Record<'oud' | 'amber' | 'daily', string>
}

export function ShopShortcuts({ collectionCounts }: ShopShortcutsProps) {
  const { t } = useLocale()
  const counts = collectionCounts ?? {
    oud: collectionDetails.oud.count,
    amber: collectionDetails.amber.count,
    daily: collectionDetails.daily.count,
  }

  const shortcuts = [
    {
      label: t('shortcut.perfumes'),
      detail: t('shortcut.perfumes.detail'),
      href: '/shop/category/perfumes',
    },
    {
      label: t('shortcut.oud'),
      detail: counts.oud,
      href: '/shop/collection/oud',
    },
    {
      label: t('shortcut.amber'),
      detail: counts.amber,
      href: '/shop/collection/amber',
    },
    {
      label: t('shortcut.daily'),
      detail: counts.daily,
      href: '/shop/collection/daily',
    },
    {
      label: t('shortcut.electronics'),
      detail: categoryDetails.electronics.name,
      href: '/shop/category/electronics',
    },
    {
      label: t('shortcut.clothing'),
      detail: categoryDetails.clothing.name,
      href: '/shop/collection/clothing',
    },
  ]

  return (
    <section className="bg-transparent px-[var(--jamm-pad)] pb-8 pt-[clamp(22px,3.5vw,34px)]">
      <motion.div
        className="mx-auto max-w-[1240px]"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="no-scrollbar flex snap-x gap-3.5 overflow-x-auto pb-2 lg:grid lg:grid-cols-6 lg:overflow-visible lg:pb-0">
          {shortcuts.map((item) => {
            const inner = (
              <>
                <span className="min-w-0 truncate font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-jamm-gold-deep">
                  {item.detail}
                </span>
                <span className="mt-3 grid grid-cols-[minmax(0,1fr)_28px] items-center gap-3 font-serif text-[1.7rem] font-semibold leading-none text-jamm-dark">
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
                key={item.href}
                href={item.href}
                className="group flex min-w-[min(72vw,260px)] snap-start flex-col justify-between rounded-[16px] border border-jamm-dark/10 bg-[#FBF8F2] px-5 py-5 shadow-[0_1px_2px_rgba(20,15,5,0.05),0_14px_34px_-22px_rgba(20,15,5,0.35)] transition duration-300 hover:-translate-y-1 hover:border-jamm-gold/50 sm:min-w-[220px] lg:min-w-0"
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
