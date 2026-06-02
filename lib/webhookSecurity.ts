import crypto from 'crypto'

export function verifyShopifyWebhookSignature(rawBody: string, hmacHeader: string, secret: string) {
  if (!secret || !hmacHeader) return false

  const digest = crypto
    .createHmac('sha256', secret)
    .update(rawBody, 'utf8')
    .digest('base64')

  try {
    return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(hmacHeader))
  } catch {
    return false
  }
}
