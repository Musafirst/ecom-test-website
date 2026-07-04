'use client'

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { addShopifyItem, checkoutUrlStorageKey, isSafeCheckoutUrl, mergeCartItem, readCart, writeCart } from '@/lib/cart'
import type { JammProduct, JammProductVariant } from '@/types/product'

interface ProductPurchasePanelProps {
  product: JammProduct
  compact?: boolean
}

function findVariant(variants: JammProductVariant[], selection: Record<string, string>) {
  return variants.find((variant) =>
    variant.selectedOptions.every((option) => selection[option.name] === option.value),
  )
}

export function ProductPurchasePanel({ product, compact = false }: ProductPurchasePanelProps) {
  const [added, setAdded] = useState(false)
  const [adding, setAdding] = useState(false)
  const [cartError, setCartError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [qty, setQty] = useState(1)

  const variants = useMemo(() => product.variants ?? [], [product.variants])
  const hasOptions = variants.length > 1 && (product.options?.length ?? 0) > 0

  const defaultVariant = useMemo(
    () => variants.find((variant) => variant.availableForSale) ?? variants[0],
    [variants],
  )
  const [selection, setSelection] = useState<Record<string, string>>(() =>
    Object.fromEntries((defaultVariant?.selectedOptions ?? []).map((option) => [option.name, option.value])),
  )

  const selectedVariant = hasOptions ? findVariant(variants, selection) : defaultVariant
  const displayPrice = selectedVariant?.price ?? product.price
  const displayCompareAt = selectedVariant?.compareAtPrice
  const available = selectedVariant
    ? selectedVariant.availableForSale
    : product.availableForSale !== false
  const cartVariantId = selectedVariant?.id ?? product.variantId

  async function addToCart() {
    if (adding || !available || !cartVariantId) return false

    setAdding(true)
    setCartError(null)
    try {
      await addShopifyItem(cartVariantId, qty)
      writeCart(mergeCartItem(readCart(), { ...product, variantId: cartVariantId }, qty))
      setAdded(true)
      setTimeout(() => setAdded(false), 3000)
      return true
    } catch {
      setAdded(false)
      setCartError('Cart could not be updated. Please try again.')
      return false
    } finally {
      setAdding(false)
    }
  }

  async function buyNow() {
    if (adding || !available) return

    const didAdd = await addToCart()
    if (!didAdd) return

    const checkoutUrl = window.localStorage.getItem(checkoutUrlStorageKey)
    if (isSafeCheckoutUrl(checkoutUrl)) {
      window.location.href = checkoutUrl
    } else {
      window.location.href = '/shop/checkout'
    }
  }

  return (
    <div>
      <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1 sm:mt-7">
        <span className="font-serif text-3xl font-medium text-jamm-dark sm:text-4xl">
          ${displayPrice.toFixed(2)}
        </span>
        {displayCompareAt && displayCompareAt > displayPrice && (
          <span className="font-sans text-base text-jamm-dark/35 line-through">
            ${displayCompareAt.toFixed(2)}
          </span>
        )}
      </div>

      <p className="mt-2 font-sans text-[11px] font-medium uppercase tracking-[0.14em] text-jamm-muted sm:mt-3 sm:text-xs sm:tracking-[0.16em]">
        {available ? 'In stock' : hasOptions && !selectedVariant ? 'Select options' : 'Out of stock'}
      </p>

      {hasOptions && (
        <div className="mt-4 space-y-4 border-t border-jamm-gold/15 pt-4 sm:mt-6 sm:pt-5">
          {(product.options ?? []).map((option) => (
            <div key={option.name}>
              <p className="mb-2 font-sans text-sm font-semibold text-jamm-dark">
                {option.name}
                {selection[option.name] && (
                  <span className="ml-2 font-normal text-jamm-muted">{selection[option.name]}</span>
                )}
              </p>
              <div className="flex flex-wrap gap-2">
                {option.values.map((value) => {
                  const isSelected = selection[option.name] === value
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setSelection((current) => ({ ...current, [option.name]: value }))}
                      aria-pressed={isSelected}
                      className={`min-h-10 rounded-md border px-3.5 py-2 font-sans text-xs font-medium transition-colors duration-150 ${
                        isSelected
                          ? 'border-jamm-gold bg-jamm-gold/15 text-jamm-dark'
                          : 'border-jamm-gold/25 bg-white text-jamm-muted hover:border-jamm-gold/60 hover:text-jamm-dark'
                      }`}
                    >
                      {value}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className={`${compact ? 'mt-4 space-y-2.5 pt-4' : 'mt-6 space-y-3 pt-5'} border-t border-jamm-gold/15 sm:mt-8 sm:space-y-3 sm:pt-6`}>
        <div className="flex items-center justify-between gap-3">
          <span className="font-sans text-[10px] font-medium uppercase tracking-[0.16em] text-jamm-muted">Qty</span>
          <div className="flex items-center overflow-hidden rounded-md border border-jamm-gold/30 bg-white shadow-[0_10px_24px_rgba(12,11,9,0.04)]">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className={`${compact ? 'h-10 w-10' : 'h-11 w-11'} flex items-center justify-center text-jamm-dark/50 transition-[background-color,color] duration-100 active:scale-[0.92] hover:bg-jamm-gold/12 hover:text-jamm-dark sm:h-11 sm:w-11`}
              aria-label="Decrease quantity"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="h-3.5 w-3.5" aria-hidden>
                <path d="M5 12h14" strokeLinecap="round" />
              </svg>
            </button>
            <span className="w-9 select-none text-center font-sans text-sm font-semibold text-jamm-dark">
              {qty}
            </span>
            <button
              type="button"
              onClick={() => setQty((q) => Math.min(10, q + 1))}
              className={`${compact ? 'h-10 w-10' : 'h-11 w-11'} flex items-center justify-center text-jamm-dark/50 transition-[background-color,color] duration-100 active:scale-[0.92] hover:bg-jamm-gold/12 hover:text-jamm-dark sm:h-11 sm:w-11`}
              aria-label="Increase quantity"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="h-3.5 w-3.5" aria-hidden>
                <path d="M12 5v14M5 12h14" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        <div className={`${compact ? 'grid-cols-[minmax(0,1fr)_48px]' : 'grid-cols-[minmax(0,1fr)_56px]'} grid gap-2.5 sm:grid-cols-[minmax(0,1fr)_56px] sm:gap-3`}>
          <motion.button
            type="button"
            onClick={addToCart}
            disabled={adding || !available}
            whileTap={{ scale: 0.97 }}
            className={`inline-flex ${compact ? 'min-h-12 py-3' : 'min-h-14 py-4'} min-w-0 items-center justify-center rounded-md px-4 text-center font-sans text-[11px] font-semibold uppercase tracking-[0.12em] shadow-[0_16px_36px_rgba(196,151,58,0.16)] transition-[transform,background-color,opacity] duration-150 min-[390px]:tracking-[0.14em] sm:min-h-14 sm:px-8 sm:py-4 ${
              added ? 'bg-jamm-gold text-jamm-dark' : 'bg-jamm-gold text-jamm-dark hover:bg-jamm-gold/82'
            } disabled:cursor-not-allowed disabled:opacity-55`}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={added ? 'added' : 'add'}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.11 }}
              >
                {!available ? 'Out of Stock' : added ? 'Added to Cart' : adding ? 'Adding' : 'Add to Cart'}
              </motion.span>
            </AnimatePresence>
          </motion.button>

          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={() => setSaved((s) => !s)}
            aria-label={saved ? 'Remove from saved' : 'Save product'}
            className={`inline-flex ${compact ? 'h-12 w-12' : 'h-14 w-14'} items-center justify-center rounded-md border shadow-[0_14px_32px_rgba(12,11,9,0.06)] transition-[transform,background-color,color,border-color] duration-150 sm:h-14 sm:w-14 ${
              saved
                ? 'border-jamm-gold bg-jamm-gold/15 text-jamm-gold'
                : 'border-jamm-gold/45 bg-white text-jamm-gold hover:bg-jamm-gold hover:text-jamm-dark'
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              fill={saved ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-4 w-4"
              aria-hidden
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.button>
        </div>

        {cartError && (
          <p className="font-sans text-xs font-medium text-red-700" role="alert">
            {cartError}
          </p>
        )}

        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          onClick={buyNow}
          disabled={adding || !available}
          className={`inline-flex ${compact ? 'min-h-12 py-3' : 'min-h-14 py-4'} w-full items-center justify-center rounded-md border border-jamm-dark/20 bg-white px-8 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-jamm-dark shadow-[0_14px_30px_rgba(12,11,9,0.08)] transition-[transform,background-color,color,border-color,opacity] duration-150 hover:border-jamm-gold hover:bg-jamm-dark hover:text-white disabled:cursor-not-allowed disabled:opacity-55 sm:min-h-14 sm:py-4`}
        >
          Buy Now
        </motion.button>
      </div>
    </div>
  )
}
