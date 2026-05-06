'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ProductBadge } from '@/components/product/ProductBadge'
import { PriceDisplay } from '@/components/product/PriceDisplay'
import { ProductPhoto } from '@/components/ui/ProductPhoto'
import type { JammProduct } from '@/types/product'

interface ProductCardProps {
  product: JammProduct
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.article
      className="group relative w-full"
      variants={{
        hidden: { opacity: 0, y: 22 },
        visible: { opacity: 1, y: 0 },
      }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={`/shop/product/${product.handle}`}
        className="block outline-none focus-visible:ring-2 focus-visible:ring-jamm-gold focus-visible:ring-offset-4 focus-visible:ring-offset-jamm-cream"
      >
        <div className="relative overflow-hidden rounded-[18px] bg-[#EDE8DC]">
          {product.badge && (
            <div className="absolute right-4 top-4 z-10">
              <ProductBadge type={product.badge} />
            </div>
          )}

          <ProductPhoto
            src={product.image}
            alt={product.imageAlt}
            aspectRatio="3/4"
            className="transition-transform duration-700 group-hover:scale-[1.035]"
          />

          <div className="absolute inset-x-0 bottom-0 flex items-end justify-center bg-gradient-to-t from-black/50 via-black/10 to-transparent p-4 opacity-100 transition-opacity duration-300 sm:opacity-0 sm:group-hover:opacity-100">
            <span className="rounded-full border border-jamm-gold/70 bg-jamm-dark/80 px-5 py-3 font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-jamm-gold backdrop-blur-sm sm:px-4 sm:py-2 sm:text-[10px] sm:tracking-[0.18em]">
              View Product
            </span>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-4 px-1">
          <p className="font-sans text-base font-medium leading-tight text-jamm-dark sm:text-sm">{product.title}</p>
          <PriceDisplay price={product.price} compareAtPrice={product.compareAtPrice} onLight />
        </div>
      </Link>
    </motion.article>
  )
}
