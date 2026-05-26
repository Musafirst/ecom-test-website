/**
 * POST /api/webhooks/shopify/orders
 * Receives Shopify order/paid webhooks and saves them to Supabase for 7-year retention.
 *
 * Set up in Shopify admin:
 * Settings → Notifications → Webhooks → Create webhook
 *   Event: Order payment
 *   Format: JSON
 *   URL: https://jammtrade.com/api/webhooks/shopify/orders
 *
 * Copy the "Your webhook signing secret" and set it as SHOPIFY_WEBHOOK_SECRET in Vercel.
 */

import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { supabase } from '@/lib/supabase'

const WEBHOOK_SECRET = process.env.SHOPIFY_WEBHOOK_SECRET ?? ''

/** Verify Shopify HMAC signature */
async function verifyShopifyWebhook(req: NextRequest, rawBody: string): Promise<boolean> {
  if (!WEBHOOK_SECRET) return true // skip verification if secret not set yet (dev only)

  const hmac = req.headers.get('x-shopify-hmac-sha256') ?? ''
  const digest = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(rawBody, 'utf8')
    .digest('base64')

  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(hmac))
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()

    const valid = await verifyShopifyWebhook(req, rawBody)
    if (!valid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
    }

    const order = JSON.parse(rawBody) as Record<string, unknown>

    const shopifyCreatedAt = order.created_at
      ? new Date(order.created_at as string)
      : new Date()

    // expires 7 years from order date (legal retention)
    const expiresAt = new Date(shopifyCreatedAt)
    expiresAt.setFullYear(expiresAt.getFullYear() + 7)

    const customer  = (order.customer  ?? {}) as Record<string, unknown>
    const shipping  = (order.shipping_address ?? null) as Record<string, unknown> | null
    const lineItems = (order.line_items ?? []) as unknown[]

    const row = {
      shopify_order_id:     String(order.id),
      shopify_order_number: order.order_number ? String(order.order_number) : null,
      customer_email:       (order.email ?? customer.email ?? null) as string | null,
      customer_first_name:  (customer.first_name ?? null) as string | null,
      customer_last_name:   (customer.last_name  ?? null) as string | null,
      line_items:           lineItems,
      subtotal_price:       order.subtotal_price   ? parseFloat(order.subtotal_price as string)   : null,
      total_shipping:       order.total_shipping_price_set
        ? parseFloat(((order.total_shipping_price_set as Record<string, Record<string, string>>).shop_money?.amount) ?? '0')
        : null,
      total_tax:            order.total_tax        ? parseFloat(order.total_tax as string)        : null,
      total_price:          order.total_price      ? parseFloat(order.total_price as string)      : null,
      currency:             (order.currency ?? null) as string | null,
      financial_status:     (order.financial_status    ?? null) as string | null,
      fulfillment_status:   (order.fulfillment_status  ?? null) as string | null,
      shipping_address:     shipping,
      shopify_created_at:   shopifyCreatedAt.toISOString(),
      expires_at:           expiresAt.toISOString(),
    }

    const { error } = await supabase
      .from('orders')
      .upsert(row, { onConflict: 'shopify_order_id' })

    if (error) throw error

    console.log(`[webhook] Order ${row.shopify_order_number} saved for ${row.customer_email}`)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[/api/webhooks/shopify/orders]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
