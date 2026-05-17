'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import type { JammProduct } from '@/types/product'

interface ProductPurchasePanelProps {
  product: JammProduct
}

interface CartItem {
  handle: string
  quantity: number
  variantId?: string
}

const cartStorageKey = 'jamm-trade-cart'

function readCart(): CartItem[] {
  try {
    const storedCart = window.localStorage.getItem(cartStorageKey)
    return storedCart ? (JSON.parse(storedCart) as CartItem[]) : []
  } catch {
    return []
  }
}

function writeCart(cart: CartItem[]) {
  window.localStorage.setItem(cartStorageKey, JSON.stringify(cart))
  window.dispatchEvent(new Event('cart-updated'))
}

export function ProductPurchasePanel({ product }: ProductPurchasePanelProps) {
  const [added, setAdded] = useState(false)
  const [adding, setAdding] = useState(false)
  const [saved, setSaved] = useState(false)
  const [qty, setQty] = useState(1)

  async function addToCart() {
    if (adding || product.availableForSale === false) return

    setAdding(true)
    try {
      const cart = readCart()
      const existingItem = cart.find((item) => item.handle === product.handle)
      if (existingItem) {
        existingItem.quantity += qty
        existingItem.variantId = product.variantId
      } else {
        cart.push({ handle: product.handle, quantity: qty, variantId: product.variantId })
      }
      writeCart(cart)

      // Shopify is the real checkout source. localStorage keeps the cart page
      // responsive and preserves fallback/demo behavior if Shopify is unavailable.
      if (product.variantId) {
        const response = await fetch('/api/shopify/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ variantId: product.variantId, quantity: qty }),
        })
        const data = await response.json().catch(() => null)

        if (data?.cart?.checkoutUrl) {
          window.localStorage.setItem('jamm-trade-checkout-url', data.cart.checkoutUrl)
        }
      }
    } catch {
      // Keep the UI from getting stuck if localStorage or Shopify is unavailable.
    } finally {
      setAdding(false)
    }

    setAdded(true)
    setTimeout(() => setAdded(false), 3000)
  }

  return (
    <div className="mt-6 space-y-3 border-t border-jamm-gold/15 pt-5 sm:mt-8 sm:pt-6">
      <div className="flex items-center justify-between gap-3">
        <span className="font-sans text-[10px] font-medium uppercase tracking-[0.16em] text-jamm-muted">Qty</span>
        <div className="flex items-center overflow-hidden rounded-md border border-jamm-gold/30 bg-white/70 shadow-[0_10px_24px_rgba(12,11,9,0.04)]">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="flex h-10 w-10 items-center justify-center text-jamm-dark/50 transition-colors hover:bg-jamm-gold/12 hover:text-jamm-dark"
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
            className="flex h-10 w-10 items-center justify-center text-jamm-dark/50 transition-colors hover:bg-jamm-gold/12 hover:text-jamm-dark"
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
          className={`inline-flex min-h-14 flex-1 items-center justify-center rounded-md px-5 py-4 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] shadow-[0_16px_36px_rgba(196,151,58,0.16)] transition duration-300 hover:-translate-y-0.5 sm:px-8 ${
            added ? 'bg-jamm-gold text-jamm-dark' : 'bg-jamm-gold/28 text-jamm-dark hover:bg-jamm-gold'
          } disabled:cursor-not-allowed disabled:opacity-55`}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={added ? 'added' : 'add'}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.16 }}
            >
              {product.availableForSale === false ? 'Out of Stock' : added ? 'Added to Cart' : adding ? 'Adding' : 'Add to Cart'}
            </motion.span>
          </AnimatePresence>
        </motion.button>

        <motion.button
          type="button"
          whileTap={{ scale: 0.95 }}
          onClick={() => setSaved((s) => !s)}
          aria-label={saved ? 'Remove from saved' : 'Save product'}
          className={`inline-flex h-14 w-14 items-center justify-center rounded-md border shadow-[0_14px_32px_rgba(12,11,9,0.06)] transition duration-300 hover:-translate-y-0.5 ${
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

      <motion.div whileTap={{ scale: 0.98 }}>
        <Link
          href="/shop/checkout"
          className="inline-flex min-h-14 w-full items-center justify-center rounded-md bg-jamm-dark px-8 py-4 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-white shadow-[0_18px_38px_rgba(12,11,9,0.16)] transition duration-300 hover:-translate-y-0.5 hover:bg-jamm-gold hover:text-jamm-dark"
        >
          Buy Now
        </Link>
      </motion.div>
    </div>
  )
}
