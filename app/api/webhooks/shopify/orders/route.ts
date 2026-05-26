/**
 * POST /api/webhooks/shopify/orders
 * Receives Shopify order/paid webhooks and saves them to Supabase for 7-year retention.
 *
 * Security:
 *  - HMAC-SHA256 signature verification (required — no bypass in production)
 *  - Webhook routes are blocked from browser origin calls (see middleware.ts)
 *  - Body capped at 1 MB (Shopify orders are typically < 50 KB)
 */

import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { supabase } from '@/lib/supabase'

const WEBHOOK_SECRET  = process.env.SHOPIFY_WEBHOOK_SECRET ?? ''
const IS_PROD         = process.env.NODE_ENV === 'production'
const MAX_BODY_BYTES  = 1_048_576  // 1 MB

if (IS_PROD && !WEBHOOK_SECRET) {
  throw new Error('SHOPIFY_WEBHOOK_SECRET must be set in production.')
}

/** Verify Shopify HMAC-SHA256 signature using timing-safe comparison */
function verifySignature(rawBody: string, hmacHeader: string): boolean {
  if (!WEBHOOK_SECRET) return true // dev only — never reached in production
  const digest = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(rawBody, 'utf8')
    .digest('base64')

  try {
    return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(hmacHeader))
  } catch {
    return false
  }
}

export async function POST(req: NextRequest) {
  // ── Body size guard ────────────────────────────────────────────────────
  const contentLength = Number(req.headers.get('content-length') ?? 0)
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: 'Payload too large.' }, { status: 413 })
  }

  try {
    const rawBody    = await req.text()
    const hmacHeader = req.headers.get('x-shopify-hmac-sha256') ?? ''

    // ── Signature verification ─────────────────────────────────────────
    if (!verifySignature(rawBody, hmacHeader)) {
      console.warn('[webhook] Invalid HMAC signature — request rejected')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // ── Parse & store order ────────────────────────────────────────────
    const order = JSON.parse(rawBody) as Record<string, unknown>

    const shopifyCreatedAt = order.created_at
      ? new Date(order.created_at as string)
      : new Date()

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
      subtotal_price:       order.subtotal_price ? parseFloat(order.subtotal_price as string) : null,
      total_shipping:       order.total_shipping_price_set
        ? parseFloat(((order.total_shipping_price_set as Record<string, Record<string, string>>).shop_money?.amount) ?? '0')
        : null,
      total_tax:            order.total_tax    ? parseFloat(order.total_tax as string)    : null,
      total_price:          order.total_price  ? parseFloat(order.total_price as string)  : null,
      currency:             (order.currency           ?? null) as string | null,
      financial_status:     (order.financial_status   ?? null) as string | null,
      fulfillment_status:   (order.fulfillment_status ?? null) as string | null,
      shipping_address:     shipping,
      shopify_created_at:   shopifyCreatedAt.toISOString(),
      expires_at:           expiresAt.toISOString(),
    }

    const { error } = await supabase
      .from('orders')
      .upsert(row, { onConflict: 'shopify_order_id' })

    if (error) throw error

    console.log(`[webhook] Order ${row.shopify_order_number} saved — expires ${expiresAt.toISOString().slice(0, 10)}`)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[/api/webhooks/shopify/orders]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
