'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ProductBadge } from '@/components/product/ProductBadge'
import { PriceDisplay } from '@/components/product/PriceDisplay'
import { BorderBeam } from '@/components/ui/border-beam'
import { ProductPhoto } from '@/components/ui/ProductPhoto'
import { useLocale } from '@/components/i18n/LocaleProvider'
import { addShopifyItem, mergeCartItem, readCart, writeCart } from '@/lib/cart'
import type { JammProduct } from '@/types/product'

interface ProductCardProps {
  product: JammProduct
}

export function ProductCard({ product }: ProductCardProps) {
  const { t } = useLocale()
  const [added, setAdded] = useState(false)
  const [adding, setAdding] = useState(false)
  const isElectronics = product.category === 'electronics'
  const isPerfume = product.category === 'perfume'
  const isClothing = product.category === 'clothing'
  const canAddToCart = Boolean(product.variantId && product.availableForSale !== false)
  const electronicsImageClassName = 'object-contain mix-blend-multiply'
  const perfumeImageClassName = 'object-contain p-4 mix-blend-multiply contrast-[1.04] drop-shadow-[0_18px_24px_rgba(12,11,9,0.24)] sm:p-5'
  const clothingImageClassName = 'object-contain p-3 mix-blend-multiply drop-shadow-[0_16px_22px_rgba(12,11,9,0.16)] sm:p-5'

  return (
    <motion.article
      className="group relative w-full"
      variants={{
        hidden: { opacity: 0, y: 22 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={`/shop/product/${product.handle}`}
        className="block outline-none focus-visible:ring-2 focus-visible:ring-jamm-gold focus-visible:ring-offset-4 focus-visible:ring-offset-jamm-cream"
      >
        <div className="relative overflow-hidden rounded-[16px] border border-jamm-dark/10 bg-[#FBF8F2] shadow-[0_1px_2px_rgba(20,15,5,0.05),0_14px_34px_-22px_rgba(20,15,5,0.35)] transition-[border-color,box-shadow,transform] duration-300 group-hover:-translate-y-1 group-hover:border-jamm-gold/45">
          <BorderBeam size={260} duration={11} borderWidth={2.5} colorFrom="#C4973A" colorTo="#F8E7A6" delay={product.id.length % 5} />
          {product.badge && (
            <div className="absolute right-4 top-4 z-10">
              <ProductBadge type={product.badge} />
            </div>
          )}

          <ProductPhoto
            src={product.image}
            alt={product.imageAlt}
            aspectRatio="1/1"
            className="transition-transform duration-500 ease-out group-hover:scale-[1.035]"
            imageClassName={isElectronics ? electronicsImageClassName : isPerfume ? perfumeImageClassName : isClothing ? clothingImageClassName : 'object-cover'}
          />

          <div className="absolute inset-x-0 bottom-0 flex items-end justify-center bg-gradient-to-t from-black/35 via-black/10 to-transparent p-4 opacity-100 transition-opacity duration-300 sm:opacity-0 sm:group-hover:opacity-100">
            <span className="rounded-[9px] border border-jamm-gold-deep/55 bg-[#FAF7F2]/45 px-4 py-2 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-jamm-gold-deep backdrop-blur-sm">
              {t('product.view')}
            </span>
          </div>
        </div>

        <div className="mt-3 flex min-h-[78px] flex-col justify-between gap-2 px-0.5 sm:min-h-0 sm:flex-row sm:items-start sm:gap-4 sm:px-1">
          <div className="min-w-0">
            <p className="mb-1 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-jamm-gold-deep">
              {product.categoryLabel}
            </p>
            <p className="line-clamp-2 break-words font-sans text-sm font-semibold leading-tight text-jamm-dark md:text-base">{product.title}</p>
          </div>
          <PriceDisplay price={product.price} compareAtPrice={product.compareAtPrice} onLight />
        </div>
      </Link>

      {product.variantId && (
        <motion.button
          type="button"
          disabled={!canAddToCart || adding}
          whileTap={{ scale: 0.97 }}
          onClick={async () => {
            if (!canAddToCart || adding) return

            setAdding(true)
            try {
              await addShopifyItem(product.variantId!, 1)
              writeCart(mergeCartItem(readCart(), product, 1))
              setAdded(true)
              window.setTimeout(() => setAdded(false), 2200)
            } catch {
              setAdded(false)
            } finally {
              setAdding(false)
            }
          }}
          className="mt-3 inline-flex min-h-[44px] w-full items-center justify-center rounded-[11px] border border-jamm-gold/35 bg-jamm-dark px-3 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-jamm-cream shadow-[0_12px_28px_rgba(12,11,9,0.08)] transition-[transform,background-color,color,opacity] duration-150 active:scale-[0.98] hover:-translate-y-0.5 hover:bg-jamm-gold hover:text-jamm-dark disabled:cursor-not-allowed disabled:opacity-55"
        >
          {product.availableForSale === false ? t('product.outOfStock') : added ? t('product.added') : adding ? t('product.adding') : t('product.addToCart')}
        </motion.button>
      )}
    </motion.article>
  )
}
