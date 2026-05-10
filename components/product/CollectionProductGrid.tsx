'use client'

import { motion } from 'framer-motion'
import { ProductCard } from '@/components/product/ProductCard'
import type { JammProduct } from '@/types/product'

interface CollectionProductGridProps {
  products: JammProduct[]
}

export function CollectionProductGrid({ products }: CollectionProductGridProps) {
  return (
    <motion.div
      className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
      }}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </motion.div>
  )
}
