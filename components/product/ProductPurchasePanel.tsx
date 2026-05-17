'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { addShopifyItem, mergeCartItem, readCart, writeCart } from '@/lib/cart'
import type { JammProduct } from '@/types/product'

interface ProductPurchasePanelProps {
  product: JammProduct
}

export function ProductPurchasePanel({ product }: ProductPurchasePanelProps) {
  const [added, setAdded] = useState(false)
  const [adding, setAdding] = useState(false)
  const [cartError, setCartError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [qty, setQty] = useState(1)

  async function addToCart() {
    if (adding || product.availableForSale === false) return false

    setAdding(true)
    setCartError(null)
    try {
      if (product.variantId) {
        await addShopifyItem(product.variantId, qty)
      }
      writeCart(mergeCartItem(readCart(), product, qty))
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
    if (adding || product.availableForSale === false) return

    const didAdd = await addToCart()
    if (!didAdd) return

    const checkoutUrl = window.localStorage.getItem('jamm-trade-checkout-url')
    if (checkoutUrl) {
      window.location.href = checkoutUrl
    }
  }

  return (
    <div className="mt-6 space-y-3 border-t border-jamm-gold/15 pt-5 sm:mt-8 sm:pt-6">
      <div className="flex items-center justify-between gap-3">
        <span className="font-sans text-[10px] font-medium uppercase tracking-[0.16em] text-jamm-muted">Qty</span>
        <div className="flex items-center overflow-hidden rounded-md border border-jamm-gold/30 bg-white/70 shadow-[0_10px_24px_rgba(12,11,9,0.04)]">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="flex h-10 w-10 items-center justify-center text-jamm-dark/50 transition-[background-color,color] duration-100 active:scale-[0.92] hover:bg-jamm-gold/12 hover:text-jamm-dark"
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
            className="flex h-10 w-10 items-center justify-center text-jamm-dark/50 transition-[background-color,color] duration-100 active:scale-[0.92] hover:bg-jamm-gold/12 hover:text-jamm-dark"
            aria-label="Increase quantity"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="h-3.5 w-3.5" aria-hidden>
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex gap-2.5 sm:gap-3">
        <motion.button
          type="button"
          onClick={addToCart}
          disabled={adding || product.availableForSale === false}
          whileTap={{ scale: 0.97 }}
          className={`inline-flex min-h-14 flex-1 items-center justify-center rounded-md px-5 py-4 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] shadow-[0_16px_36px_rgba(196,151,58,0.16)] transition-[transform,background-color,opacity] duration-150 sm:px-8 ${
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
              {product.availableForSale === false ? 'Out of Stock' : added ? 'Added to Cart' : adding ? 'Adding' : 'Add to Cart'}
            </motion.span>
          </AnimatePresence>
        </motion.button>

        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={() => setSaved((s) => !s)}
          aria-label={saved ? 'Remove from saved' : 'Save product'}
          className={`inline-flex h-14 w-14 items-center justify-center rounded-md border shadow-[0_14px_32px_rgba(12,11,9,0.06)] transition-[transform,background-color,color,border-color] duration-150 ${
            saved
              ? 'border-jamm-gold bg-jamm-gold/15 text-jamm-gold'
              : 'border-jamm-gold/45 bg-white/60 text-jamm-gold hover:bg-jamm-gold hover:text-jamm-dark'
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
        disabled={adding || product.availableForSale === false}
        className="inline-flex min-h-14 w-full items-center justify-center rounded-md border border-jamm-dark/20 bg-white/45 px-8 py-4 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-jamm-dark shadow-[0_14px_30px_rgba(12,11,9,0.08)] transition-[transform,background-color,color,border-color,opacity] duration-150 hover:border-jamm-gold hover:bg-jamm-dark hover:text-white disabled:cursor-not-allowed disabled:opacity-55"
      >
        Buy Now
      </motion.button>
    </div>
  )
}
