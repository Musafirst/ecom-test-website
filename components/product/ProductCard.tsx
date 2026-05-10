'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ProductBadge } from '@/components/product/ProductBadge'
import { PriceDisplay } from '@/components/product/PriceDisplay'
import { BorderBeam } from '@/components/ui/border-beam'
import { ProductPhoto } from '@/components/ui/ProductPhoto'
import type { JammProduct } from '@/types/product'

interface ProductCardProps {
  product: JammProduct
}

export function ProductCard({ product }: ProductCardProps) {
  const isElectronics = product.category === 'electronics'
  const isPerfume = product.category === 'perfume'
  const electronicsImageClassName =
    product.handle === 'sony-wh-1000xm5'
      ? 'object-contain p-3 mix-blend-multiply'
      : product.subcategory === 'smartwatches'
        ? 'object-contain p-2 mix-blend-multiply'
        : 'object-contain p-4 mix-blend-multiply'
  const perfumeImageClassName = 'object-contain p-4 mix-blend-multiply contrast-[1.04] drop-shadow-[0_18px_24px_rgba(12,11,9,0.24)] sm:p-5'

  return (
    <motion.article
      className="group relative w-full"
      variants={{
        hidden: { opacity: 0, y: 22 },
        visible: { opacity: 1, y: 0 },
      }}
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={`/shop/product/${product.handle}`}
        className="block outline-none focus-visible:ring-2 focus-visible:ring-jamm-gold focus-visible:ring-offset-4 focus-visible:ring-offset-jamm-cream"
      >
        <div className="relative overflow-hidden rounded-[14px] border border-jamm-gold/35 bg-[#EDE8DC] shadow-[0_12px_30px_rgba(12,11,9,0.08)] transition duration-300 group-hover:border-jamm-gold/70 group-hover:shadow-[0_24px_60px_rgba(12,11,9,0.14)] sm:rounded-[18px]">
          <BorderBeam size={260} duration={11} borderWidth={2.5} colorFrom="#C4973A" colorTo="#F8E7A6" delay={product.id.length % 5} />
          {product.badge && (
            <div className="absolute right-4 top-4 z-10">
              <ProductBadge type={product.badge} />
            </div>
          )}

          <ProductPhoto
            src={product.image}
            alt={product.imageAlt}
            aspectRatio={isElectronics ? '4/3' : '3/4'}
            className="transition-transform duration-700 group-hover:scale-[1.035]"
            imageClassName={isElectronics ? electronicsImageClassName : isPerfume ? perfumeImageClassName : 'object-cover'}
          />

          <div className="absolute inset-x-0 bottom-0 flex items-end justify-center bg-gradient-to-t from-black/54 via-black/10 to-transparent p-2.5 opacity-100 transition-opacity duration-300 sm:p-4 sm:opacity-0 sm:group-hover:opacity-100">
            <span className="rounded-md border border-jamm-gold/70 bg-jamm-dark/86 px-3 py-2 font-sans text-[9px] font-semibold uppercase tracking-[0.12em] text-jamm-gold backdrop-blur-sm sm:px-4 sm:text-[10px]">
              View Product
            </span>
          </div>
        </div>

        <div className="mt-2.5 flex min-h-[78px] flex-col justify-between gap-2 px-0.5 sm:mt-3 sm:min-h-0 sm:flex-row sm:items-start sm:gap-4 sm:px-1">
          <div className="min-w-0">
            <p className="mb-1 font-sans text-[10px] font-medium uppercase tracking-[0.16em] text-jamm-muted">
              {product.categoryLabel}
            </p>
            <p className="line-clamp-2 font-sans text-sm font-semibold leading-tight text-jamm-dark sm:text-sm md:text-base lg:text-sm">{product.title}</p>
          </div>
          <PriceDisplay price={product.price} compareAtPrice={product.compareAtPrice} onLight />
        </div>
      </Link>
    </motion.article>
  )
}
