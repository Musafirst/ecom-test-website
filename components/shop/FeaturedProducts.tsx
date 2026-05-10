'use client'

import { motion } from 'framer-motion'
import { ProductCard } from '@/components/product/ProductCard'
import { featuredProducts } from '@/lib/products'

export function FeaturedProducts() {
  return (
    <section id="perfumes" className="bg-transparent px-3 py-10 sm:px-4 lg:py-16">
      <div className="mx-auto max-w-[1560px]">
        <motion.div
          className="mb-5 sm:mb-7"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-jamm-gold">Fragrance collection</p>
              <h2 className="font-sans text-2xl font-semibold text-jamm-dark sm:text-4xl">
                Featured Products
              </h2>
            </div>
            <a
              href="#collections"
              className="inline-flex items-center gap-1.5 font-sans text-sm font-medium text-jamm-dark/50 transition-colors duration-200 hover:text-jamm-gold"
            >
              View all collections
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5" aria-hidden>
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
          <div className="mt-5 h-px bg-gradient-to-r from-jamm-gold/40 via-jamm-gold/15 to-transparent" />
        </motion.div>

        <motion.div
          className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.09 } },
          }}
        >
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
