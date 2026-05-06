'use client'

import { motion } from 'framer-motion'
import { ProductCard } from '@/components/product/ProductCard'
import { featuredProducts } from '@/lib/products'

export function FeaturedProducts() {
  return (
    <section id="perfumes" className="bg-[#FAF7F2] px-3 py-12 sm:px-4 lg:py-16">
      <div className="mx-auto max-w-[1560px]">
        <motion.div
          className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <div>
            <p className="mb-2 font-sans text-sm text-jamm-gold">Fragrance collection</p>
            <h2 className="font-sans text-3xl font-medium tracking-[-0.02em] text-jamm-dark sm:text-4xl">
              Featured Products
            </h2>
          </div>
          <a
            href="#collections"
            className="font-sans text-sm font-medium text-jamm-dark/50 underline underline-offset-4 transition-colors duration-200 hover:text-jamm-gold"
          >
            View all collections
          </a>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
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
