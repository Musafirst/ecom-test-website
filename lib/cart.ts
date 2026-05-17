'use client'

import type { JammProduct } from '@/types/product'

export interface CartItem {
  handle: string
  quantity: number
  variantId?: string
}

export const cartStorageKey = 'jamm-trade-cart'
export const checkoutUrlStorageKey = 'jamm-trade-checkout-url'

export function readCart(): CartItem[] {
  try {
    const storedCart = window.localStorage.getItem(cartStorageKey)
    return storedCart ? (JSON.parse(storedCart) as CartItem[]) : []
  } catch {
    return []
  }
}

export function writeCart(cart: CartItem[]) {
  window.localStorage.setItem(cartStorageKey, JSON.stringify(cart))
  window.dispatchEvent(new Event('cart-updated'))
}

export function mergeCartItem(cart: CartItem[], product: JammProduct, quantity: number) {
  const nextCart = [...cart]
  const existingItem = nextCart.find((item) => item.handle === product.handle)

  if (existingItem) {
    existingItem.quantity += quantity
    existingItem.variantId = product.variantId
  } else {
    nextCart.push({ handle: product.handle, quantity, variantId: product.variantId })
  }

  return nextCart
}

export async function addShopifyItem(variantId: string, quantity: number) {
  const response = await fetch('/api/shopify/cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ variantId, quantity }),
  })
  const data = await response.json().catch(() => null)

  if (!response.ok || !data?.cart?.checkoutUrl) {
    throw new Error(data?.error ?? 'Unable to update Shopify cart.')
  }

  window.localStorage.setItem(checkoutUrlStorageKey, data.cart.checkoutUrl)
  return data.cart.checkoutUrl as string
}

export async function syncShopifyCart(cart: CartItem[]) {
  const lines = cart
    .filter((item) => item.variantId && item.quantity > 0)
    .map((item) => ({ variantId: item.variantId, quantity: item.quantity }))

  if (lines.length === 0) {
    window.localStorage.removeItem(checkoutUrlStorageKey)
    return null
  }

  const response = await fetch('/api/shopify/cart', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lines }),
  })
  const data = await response.json().catch(() => null)

  if (!response.ok || !data?.cart?.checkoutUrl) {
    throw new Error(data?.error ?? 'Unable to sync Shopify cart.')
  }

  window.localStorage.setItem(checkoutUrlStorageKey, data.cart.checkoutUrl)
  return data.cart.checkoutUrl as string
}
