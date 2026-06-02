import crypto from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { verifyShopifyWebhookSignature } from '@/lib/webhookSecurity'

describe('Shopify webhook verification', () => {
  it('accepts a matching HMAC and rejects altered payloads', () => {
    const body = '{"id":123}'
    const secret = 'test-only-secret'
    const signature = crypto.createHmac('sha256', secret).update(body).digest('base64')

    expect(verifyShopifyWebhookSignature(body, signature, secret)).toBe(true)
    expect(verifyShopifyWebhookSignature('{"id":456}', signature, secret)).toBe(false)
  })

  it('rejects requests without a configured secret or signature', () => {
    expect(verifyShopifyWebhookSignature('{}', '', 'secret')).toBe(false)
    expect(verifyShopifyWebhookSignature('{}', 'signature', '')).toBe(false)
  })
})
