/**
 * Receives Shopify order webhooks and stores a minimized record in Supabase.
 * Shopify remains the payment processor; card details are never stored here.
 */

import { NextRequest, NextResponse } from 'next/server'
import { incrementMetric, logError, logEvent, logWarning, recordApiResult } from '@/lib/observability'
import { minimizeShopifyOrder } from '@/lib/orderPrivacy'
import { getSupabase } from '@/lib/supabase'
import { verifyShopifyWebhookSignature } from '@/lib/webhookSecurity'

const WEBHOOK_SECRET = process.env.SHOPIFY_WEBHOOK_SECRET ?? ''
const IS_PROD = process.env.NODE_ENV === 'production'
const MAX_BODY_BYTES = 1_048_576

if (IS_PROD && !WEBHOOK_SECRET) {
  throw new Error('SHOPIFY_WEBHOOK_SECRET must be set in production.')
}

export async function POST(req: NextRequest) {
  const startedAt = Date.now()
  const respond = (body: Record<string, unknown>, status = 200) => {
    recordApiResult('/api/webhooks/shopify/orders', status, startedAt)
    return NextResponse.json(body, { status })
  }

  const contentLength = Number(req.headers.get('content-length') ?? 0)
  if (contentLength > MAX_BODY_BYTES) {
    incrementMetric('shopify_webhooks_total', { result: 'payload_too_large' })
    return respond({ error: 'Payload too large.' }, 413)
  }

  try {
    const rawBody = await req.text()
    const hmacHeader = req.headers.get('x-shopify-hmac-sha256') ?? ''

    // Development may omit the secret. Production fails during module loading.
    if (WEBHOOK_SECRET && !verifyShopifyWebhookSignature(rawBody, hmacHeader, WEBHOOK_SECRET)) {
      incrementMetric('shopify_webhooks_total', { result: 'unauthorized' })
      logWarning('shopify.webhook_unauthorized')
      return respond({ error: 'Unauthorized' }, 401)
    }

    const row = minimizeShopifyOrder(JSON.parse(rawBody) as Record<string, unknown>)
    const { error } = await getSupabase()
      .from('orders')
      .upsert(row, { onConflict: 'shopify_order_id' })

    if (error) throw error

    incrementMetric('shopify_webhooks_total', { result: 'accepted' })
    logEvent('shopify.webhook_saved', { retention: 'seven_years' })
    return respond({ ok: true })
  } catch (err) {
    incrementMetric('shopify_webhooks_total', { result: 'error' })
    logError('shopify.webhook_failed', err)
    return respond({ error: 'Server error' }, 500)
  }
}
