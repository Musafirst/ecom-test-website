'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ProductPhoto } from '@/components/ui/ProductPhoto'
import { checkoutUrlStorageKey, type CartItem, readCart, syncShopifyCart, writeCart } from '@/lib/cart'
import type { JammProduct } from '@/types/product'

interface CheckoutCartProps {
  products: JammProduct[]
}

export function CheckoutCart({ products }: CheckoutCartProps) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [syncing, setSyncing] = useState(false)
  const [cartError, setCartError] = useState<string | null>(null)

  useEffect(() => {
    setCart(readCart())
  }, [])

  useEffect(() => {
    if (cart.length === 0) return

    let ignore = false
    async function syncVisibleCart() {
      try {
        setSyncing(true)
        setCartError(null)
        const checkoutUrl = await syncShopifyCart(cart)
        if (!ignore) setShopifyCheckoutUrl(checkoutUrl)
      } catch {
        if (!ignore) setCartError('Shopify checkout could not be synced. Please try again before checkout.')
      } finally {
        if (!ignore) setSyncing(false)
      }
    }

    void syncVisibleCart()
    return () => {
      ignore = true
    }
  }, [cart])

  const lineItems = useMemo(() => {
    return cart
      .map((item) => {
        const product = products.find((candidate) => candidate.handle === item.handle)
        return product ? { product, quantity: item.quantity } : null
      })
      .filter((item): item is { product: JammProduct; quantity: number } => Boolean(item))
  }, [cart, products])

  const subtotal = lineItems.reduce((total, item) => total + item.product.price * item.quantity, 0)

  const [shopifyCheckoutUrl, setShopifyCheckoutUrl] = useState<string | null>(null)

  useEffect(() => {
    setShopifyCheckoutUrl(window.localStorage.getItem(checkoutUrlStorageKey))
  }, [cart])

  function updateQuantity(handle: string, quantity: number) {
    const nextCart = quantity < 1
      ? cart.filter((item) => item.handle !== handle)
      : cart.map((item) => item.handle === handle ? { ...item, quantity } : item)

    setCart(nextCart)
    writeCart(nextCart)
    setCartError(null)

    if (nextCart.length === 0) {
      window.localStorage.removeItem(checkoutUrlStorageKey)
    }
  }

  if (lineItems.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-[24px] border border-jamm-gold/25 bg-[#EDE8DC] px-8 py-16 text-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-jamm-gold/30 bg-white/50">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-7 w-7 text-jamm-gold" aria-hidden>
            <path d="M6 7h13l-1.2 8.2a2 2 0 0 1-2 1.8H8.4a2 2 0 0 1-2-1.7L5 4H3" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="9" cy="20" r="1" />
            <circle cx="17" cy="20" r="1" />
          </svg>
        </div>
        <p className="mb-2 font-serif text-2xl font-light text-jamm-dark">Your cart is empty</p>
        <p className="mb-8 max-w-xs font-sans text-sm leading-relaxed text-jamm-muted">
          Add something from the shop to get started.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center justify-center rounded-full bg-jamm-dark px-8 py-4 font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-white transition-colors duration-300 hover:bg-jamm-gold hover:text-jamm-dark"
        >
          Browse Products
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_380px]">
      <div className="space-y-4">
        {lineItems.map(({ product, quantity }) => (
          <article
            key={product.handle}
            className="grid grid-cols-[88px_minmax(0,1fr)] gap-3 rounded-[18px] border border-jamm-gold/25 bg-[#EDE8DC] p-3 sm:grid-cols-[132px_minmax(0,1fr)] sm:gap-4 sm:rounded-[20px] sm:p-4"
          >
            <ProductPhoto
              src={product.image}
              alt={product.imageAlt}
              aspectRatio="1/1"
              imageClassName="object-contain p-3 mix-blend-multiply"
              sizes="132px"
            />
            <div className="flex min-w-0 flex-col">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="mb-1 font-sans text-[10px] font-medium uppercase tracking-[0.16em] text-jamm-muted">
                    {product.categoryLabel}
                  </p>
                  <Link
                    href={`/shop/product/${product.handle}`}
                    className="line-clamp-2 break-words font-sans text-sm font-medium leading-tight text-jamm-dark transition-colors duration-200 hover:text-jamm-gold sm:text-lg"
                  >
                    {product.title}
                  </Link>
                  <p className="mt-1.5 font-sans text-sm text-jamm-muted">${product.price.toFixed(2)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => updateQuantity(product.handle, 0)}
                  className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-jamm-dark/30 transition-[background-color,color,transform] duration-150 active:scale-[0.9] hover:bg-red-50 hover:text-red-400"
                  aria-label={`Remove ${product.title} from cart`}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5" aria-hidden>
                    <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
              <div className="mt-auto flex items-center gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => updateQuantity(product.handle, quantity - 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-black/15 font-sans text-sm text-jamm-dark transition-[border-color,color,transform] duration-150 active:scale-[0.92] hover:border-jamm-gold hover:text-jamm-gold"
                  aria-label={`Decrease ${product.title} quantity`}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="h-3 w-3" aria-hidden>
                    <path d="M5 12h14" strokeLinecap="round" />
                  </svg>
                </button>
                <span className="min-w-6 text-center font-sans text-sm font-semibold text-jamm-dark">{quantity}</span>
                <button
                  type="button"
                  onClick={() => updateQuantity(product.handle, quantity + 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-black/15 font-sans text-sm text-jamm-dark transition-[border-color,color,transform] duration-150 active:scale-[0.92] hover:border-jamm-gold hover:text-jamm-gold"
                  aria-label={`Increase ${product.title} quantity`}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="h-3 w-3" aria-hidden>
                    <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <aside className="h-fit rounded-[24px] border border-jamm-gold/30 bg-[#EDE8DC] p-6 lg:p-8">
        <h2 className="font-sans text-xl font-semibold tracking-[-0.02em] text-jamm-dark">Order Summary</h2>
        <div className="mt-5 space-y-3 border-y border-black/10 py-5">
          {lineItems.map(({ product, quantity }) => (
            <div key={product.handle} className="flex items-start justify-between gap-4 font-sans text-sm text-jamm-muted">
              <span className="leading-snug">{quantity} x {product.title}</span>
              <span className="flex-shrink-0 font-medium text-jamm-dark">${(product.price * quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between border-b border-black/8 pb-4 font-sans text-base font-semibold text-jamm-dark">
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <p className="mt-3 font-sans text-xs text-jamm-muted">
          Tax &amp; shipping calculated at checkout.
        </p>
        {shopifyCheckoutUrl ? (
          <a
            href={shopifyCheckoutUrl}
            className={`mt-5 inline-flex w-full items-center justify-center rounded-full bg-jamm-dark px-8 py-4 font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-white shadow-[0_12px_28px_rgba(12,11,9,0.18)] transition-[background-color,color] duration-200 hover:bg-jamm-gold hover:text-jamm-dark ${syncing ? 'pointer-events-none opacity-70' : ''}`}
          >
            {syncing ? 'Syncing Cart' : 'Proceed to Checkout'}
          </a>
        ) : (
          <button
            type="button"
            disabled
            className="mt-5 inline-flex w-full cursor-not-allowed items-center justify-center rounded-full bg-jamm-dark/55 px-8 py-4 font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-white shadow-[0_12px_28px_rgba(12,11,9,0.12)]"
          >
            {syncing ? 'Syncing Cart' : 'Preparing Secure Checkout'}
          </button>
        )}
        {cartError && (
          <p className="mt-3 font-sans text-xs font-medium text-red-700" role="alert">
            {cartError}
          </p>
        )}
        <p className="mt-4 font-sans text-[11px] leading-relaxed text-jamm-dark/38">
          {shopifyCheckoutUrl ? 'You will be redirected to secure Shopify checkout.' : 'Secure checkout appears after the cart syncs with Shopify.'}
        </p>
      </aside>
    </div>
  )
}
