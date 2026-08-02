import type { JammProduct } from '@/types/product'

// Conversion tracking for TikTok Pixel + GA4. Both platforms join ad clicks to
// catalog items on one key: TikTok `content_id` and GA4 `item_id` must equal
// the item ID in the Shopify product feed. Shopify's sales-channel feeds key
// items by the numeric Shopify product ID (not SKU, not handle), and the
// Shopify-hosted checkout pixel reports the same numeric IDs, so upper-funnel
// events fired here and the CompletePayment event fired by Shopify agree.
// SKUs are unusable for this: inconsistent formats and not guaranteed unique.

export interface AnalyticsItem {
  /** Feed-matching item ID — see contentId(). */
  id: string
  handle: string
  title: string
  price: number
  quantity: number
  currencyCode?: string
  categoryLabel?: string
}

const shopifyProductGidPattern = /^gid:\/\/shopify\/Product\/(\d+)$/

/**
 * The ID sent to TikTok as content_id and to GA4 as item_id.
 * Numeric Shopify product ID when available (matches Shopify-generated
 * product feeds and the checkout pixel), otherwise the handle, which is
 * unique and stable — never the SKU.
 */
export function contentId(product: Pick<JammProduct, 'id' | 'handle'>): string {
  const gidMatch = shopifyProductGidPattern.exec(product.id ?? '')
  return gidMatch ? gidMatch[1] : product.handle
}

export function analyticsItemFromProduct(
  product: JammProduct,
  quantity = 1,
  priceOverride?: number,
): AnalyticsItem {
  return {
    id: contentId(product),
    handle: product.handle,
    title: product.title,
    price: priceOverride ?? product.price,
    quantity,
    currencyCode: product.currencyCode,
    categoryLabel: product.categoryLabel,
  }
}

function totalValue(items: AnalyticsItem[]) {
  return Number(items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2))
}

function currencyOf(items: AnalyticsItem[]) {
  return items.find((item) => item.currencyCode)?.currencyCode ?? 'USD'
}

// Payload builders are pure so tests can verify the exact shapes both
// platforms receive without a browser environment.

export function buildTikTokPayload(items: AnalyticsItem[]) {
  return {
    contents: items.map((item) => ({
      content_id: item.id,
      content_type: 'product',
      content_name: item.title,
      price: item.price,
      quantity: item.quantity,
    })),
    value: totalValue(items),
    currency: currencyOf(items),
  }
}

export function buildGa4Payload(items: AnalyticsItem[]) {
  return {
    currency: currencyOf(items),
    value: totalValue(items),
    items: items.map((item) => ({
      item_id: item.id,
      item_name: item.title,
      price: item.price,
      quantity: item.quantity,
      ...(item.categoryLabel ? { item_category: item.categoryLabel } : {}),
    })),
  }
}

type TikTokQueue = {
  track: (event: string, payload?: Record<string, unknown>) => void
  page: () => void
}

declare global {
  interface Window {
    ttq?: TikTokQueue
    gtag?: (...args: unknown[]) => void
  }
}

// TikTok event names and their GA4 equivalents at the same funnel step.
type FunnelEvent =
  | { tiktok: 'ViewContent'; ga4: 'view_item' }
  | { tiktok: 'AddToCart'; ga4: 'add_to_cart' }
  | { tiktok: 'InitiateCheckout'; ga4: 'begin_checkout' }

function dispatch(event: FunnelEvent, items: AnalyticsItem[]) {
  if (typeof window === 'undefined' || items.length === 0) return

  try {
    window.ttq?.track(event.tiktok, buildTikTokPayload(items))
    window.gtag?.('event', event.ga4, buildGa4Payload(items))
  } catch {
    // Tracking must never break shopping. Blocked or missing pixels are fine.
  }
}

export function trackViewContent(item: AnalyticsItem) {
  dispatch({ tiktok: 'ViewContent', ga4: 'view_item' }, [item])
}

export function trackAddToCart(item: AnalyticsItem) {
  dispatch({ tiktok: 'AddToCart', ga4: 'add_to_cart' }, [item])
}

export function trackBeginCheckout(items: AnalyticsItem[]) {
  dispatch({ tiktok: 'InitiateCheckout', ga4: 'begin_checkout' }, items)
}
