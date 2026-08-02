import { describe, expect, it } from 'vitest'
import {
  type AnalyticsItem,
  analyticsItemFromProduct,
  buildGa4Payload,
  buildTikTokPayload,
  contentId,
  trackAddToCart,
  trackBeginCheckout,
  trackViewContent,
} from '@/lib/analytics'
import type { JammProduct } from '@/types/product'

function makeProduct(overrides: Partial<JammProduct> = {}): JammProduct {
  return {
    id: 'gid://shopify/Product/8123456789',
    handle: 'shaghaf-oud-ahmar',
    title: 'Shaghaf Oud Ahmar',
    price: 43.99,
    currencyCode: 'USD',
    sku: 'Shaghaf Oud Ahmar',
    category: 'perfume',
    categoryLabel: 'Perfumes',
    tags: [],
    image: '/images/shaghaf.webp',
    imageAlt: 'Shaghaf Oud Ahmar bottle',
    ...overrides,
  }
}

describe('contentId', () => {
  it('uses the numeric Shopify product ID from a product gid', () => {
    expect(contentId(makeProduct())).toBe('8123456789')
  })

  it('falls back to the handle when the id is not a Shopify product gid', () => {
    expect(contentId(makeProduct({ id: 'local-demo-1' }))).toBe('shaghaf-oud-ahmar')
  })

  it('never uses the SKU, even when one exists', () => {
    const product = makeProduct({ id: 'local-demo-1', sku: 'PER 169' })
    expect(contentId(product)).toBe('shaghaf-oud-ahmar')
  })

  it('does not treat non-Product gids as product IDs', () => {
    const product = makeProduct({ id: 'gid://shopify/ProductVariant/999' })
    expect(contentId(product)).toBe('shaghaf-oud-ahmar')
  })
})

describe('analyticsItemFromProduct', () => {
  it('maps the product with the feed-matching id, default quantity 1', () => {
    expect(analyticsItemFromProduct(makeProduct())).toEqual({
      id: '8123456789',
      handle: 'shaghaf-oud-ahmar',
      title: 'Shaghaf Oud Ahmar',
      price: 43.99,
      quantity: 1,
      currencyCode: 'USD',
      categoryLabel: 'Perfumes',
    })
  })

  it('applies quantity and variant price overrides', () => {
    const item = analyticsItemFromProduct(makeProduct(), 3, 39.99)
    expect(item.quantity).toBe(3)
    expect(item.price).toBe(39.99)
  })
})

const items: AnalyticsItem[] = [
  { id: '8123456789', handle: 'shaghaf-oud-ahmar', title: 'Shaghaf Oud Ahmar', price: 43.99, quantity: 2, currencyCode: 'USD', categoryLabel: 'Perfumes' },
  { id: '8987654321', handle: 'dubai-night', title: 'Dubai Night', price: 24.5, quantity: 1 },
]

describe('buildTikTokPayload', () => {
  it('builds contents with content_id, summed value, and currency', () => {
    expect(buildTikTokPayload(items)).toEqual({
      contents: [
        { content_id: '8123456789', content_type: 'product', content_name: 'Shaghaf Oud Ahmar', price: 43.99, quantity: 2 },
        { content_id: '8987654321', content_type: 'product', content_name: 'Dubai Night', price: 24.5, quantity: 1 },
      ],
      value: 112.48,
      currency: 'USD',
    })
  })

  it('defaults currency to USD when no item carries one', () => {
    expect(buildTikTokPayload([items[1]]).currency).toBe('USD')
  })
})

describe('buildGa4Payload', () => {
  it('builds GA4 ecommerce items with item_id matching content_id', () => {
    const payload = buildGa4Payload(items)
    expect(payload).toEqual({
      currency: 'USD',
      value: 112.48,
      items: [
        { item_id: '8123456789', item_name: 'Shaghaf Oud Ahmar', price: 43.99, quantity: 2, item_category: 'Perfumes' },
        { item_id: '8987654321', item_name: 'Dubai Night', price: 24.5, quantity: 1 },
      ],
    })
    expect(payload.items[0].item_id).toBe(buildTikTokPayload(items).contents[0].content_id)
  })
})

describe('track functions outside a browser', () => {
  it('are safe no-ops without a window', () => {
    expect(() => {
      trackViewContent(items[0])
      trackAddToCart(items[0])
      trackBeginCheckout(items)
    }).not.toThrow()
  })
})
