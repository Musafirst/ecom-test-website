export const maxCartBodyBytes = 20_480
export const maxCartLines = 50
export const maxCartQuantity = 99

const shopifyVariantIdPattern = /^gid:\/\/shopify\/ProductVariant\/\d+$/

export type CartLineInput = {
  variantId: string
  quantity: number
}

export function parseCartLine(line: unknown): CartLineInput | null {
  if (!line || typeof line !== 'object') return null

  const variantId = 'variantId' in line && typeof line.variantId === 'string' ? line.variantId : ''
  const quantity = Number('quantity' in line ? line.quantity : 0)

  return shopifyVariantIdPattern.test(variantId) && Number.isInteger(quantity) && quantity > 0 && quantity <= maxCartQuantity
    ? { variantId, quantity }
    : null
}

export function requestIsTooLarge(request: Request, maxBytes = maxCartBodyBytes) {
  return Number(request.headers.get('content-length') ?? 0) > maxBytes
}
