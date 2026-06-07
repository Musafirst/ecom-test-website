import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { incrementMetric, logError, logEvent, logWarning, recordApiResult } from '@/lib/observability'
import { verifyShopifyWebhookSignature } from '@/lib/webhookSecurity'

const WEBHOOK_SECRET = process.env.SHOPIFY_WEBHOOK_SECRET || process.env.SHOPIFY_CLIENT_SECRET || ''
const IS_PROD = process.env.NODE_ENV === 'production'
const MAX_BODY_BYTES = 256_000

if (IS_PROD && !WEBHOOK_SECRET) {
  throw new Error('SHOPIFY_WEBHOOK_SECRET or SHOPIFY_CLIENT_SECRET must be set in production.')
}

async function triggerDeployHook() {
  const deployHookUrl = process.env.VERCEL_DEPLOY_HOOK_URL
  if (!deployHookUrl) return false

  const response = await fetch(deployHookUrl, { method: 'POST' })
  if (!response.ok) {
    throw new Error(`Deploy hook failed: ${response.status}`)
  }

  return true
}

export async function POST(req: NextRequest) {
  const startedAt = Date.now()
  const respond = (body: Record<string, unknown>, status = 200) => {
    recordApiResult('/api/webhooks/shopify/shop-update', status, startedAt)
    return NextResponse.json(body, { status })
  }

  const contentLength = Number(req.headers.get('content-length') ?? 0)
  if (contentLength > MAX_BODY_BYTES) {
    incrementMetric('shopify_webhooks_total', { result: 'payload_too_large', topic: 'shop_update' })
    return respond({ error: 'Payload too large.' }, 413)
  }

  try {
    const rawBody = await req.text()
    const hmacHeader = req.headers.get('x-shopify-hmac-sha256') ?? ''

    if (WEBHOOK_SECRET && !verifyShopifyWebhookSignature(rawBody, hmacHeader, WEBHOOK_SECRET)) {
      incrementMetric('shopify_webhooks_total', { result: 'unauthorized', topic: 'shop_update' })
      logWarning('shopify.shop_update_unauthorized')
      return respond({ error: 'Unauthorized' }, 401)
    }

    revalidateTag('shopify-business-info', 'max')
    const deployTriggered = await triggerDeployHook()

    incrementMetric('shopify_webhooks_total', { result: 'accepted', topic: 'shop_update' })
    logEvent('shopify.shop_update_synced', { deployTriggered })
    return respond({ ok: true, deployTriggered })
  } catch (error) {
    incrementMetric('shopify_webhooks_total', { result: 'error', topic: 'shop_update' })
    logError('shopify.shop_update_failed', error)
    return respond({ error: 'Server error' }, 500)
  }
}
