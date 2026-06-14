'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ProductCard } from '@/components/product/ProductCard'
import { useLocale } from '@/components/i18n/LocaleProvider'
import type { JammProduct } from '@/types/product'

interface FeaturedProductsProps {
  products: JammProduct[]
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  const { t } = useLocale()
  const prefersReducedMotion = useReducedMotion()

  return (
    <section id="perfumes" className="bg-transparent px-[var(--jamm-pad)] py-[clamp(48px,8vw,86px)]">
      <div className="mx-auto max-w-[1240px]">
        <motion.div
          className="mb-[clamp(26px,4vw,40px)]"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="mb-0 font-sans text-[11px] font-bold uppercase tracking-[0.24em] text-jamm-gold-deep">{t('featured.kicker')}</p>
              <h2 className="mt-2 font-serif text-[clamp(2.3rem,6vw,3.5rem)] font-semibold leading-[1.02] tracking-[-0.005em] text-jamm-dark">
                {t('featured.title')}
              </h2>
            </div>
            <a
              href="/shop#collections"
              className="inline-flex items-center gap-1.5 font-sans text-sm font-medium text-jamm-dark/50 transition-[color] duration-150 hover:text-jamm-gold"
            >
              {t('featured.viewAll')}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5" aria-hidden>
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
          <div className="mt-6 h-px bg-[linear-gradient(90deg,#c4973a_0_60px,rgba(28,22,10,0.12)_60px)] lg:hidden" />
        </motion.div>

        <motion.div
          className="grid grid-cols-2 gap-[clamp(14px,3vw,26px)] lg:grid-cols-4"
          initial={prefersReducedMotion ? 'visible' : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.07 } },
          }}
        >
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full rounded-lg border border-jamm-gold/20 bg-[#EDE8DC] px-6 py-12 text-center">
              <p className="font-sans text-lg font-semibold text-jamm-dark">{t('featured.unavailable')}</p>
              <p className="mt-2 font-sans text-sm text-jamm-muted">{t('featured.checkBack')}</p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
