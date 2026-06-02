import { describe, expect, it } from 'vitest'
import { maxCartBodyBytes, parseCartLine, requestIsTooLarge } from '@/lib/cartValidation'

describe('cart validation', () => {
  it('accepts a bounded Shopify variant line', () => {
    expect(parseCartLine({
      variantId: 'gid://shopify/ProductVariant/123456789',
      quantity: 2,
    })).toEqual({
      variantId: 'gid://shopify/ProductVariant/123456789',
      quantity: 2,
    })
  })

  it('rejects malformed ids and abusive quantities', () => {
    expect(parseCartLine({ variantId: '123', quantity: 1 })).toBeNull()
    expect(parseCartLine({ variantId: 'gid://shopify/ProductVariant/1', quantity: 100 })).toBeNull()
    expect(parseCartLine({ variantId: 'gid://shopify/ProductVariant/1', quantity: 1.5 })).toBeNull()
  })

  it('rejects oversized bodies before JSON parsing', () => {
    const request = new Request('https://www.jammtrade.com/api/shopify/cart', {
      headers: { 'content-length': String(maxCartBodyBytes + 1) },
    })

    expect(requestIsTooLarge(request)).toBe(true)
  })
})
