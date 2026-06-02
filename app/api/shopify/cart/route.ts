import { NextResponse } from 'next/server'
import { addShopifyCartLines, createShopifyCart, createShopifyCartFromLines, isShopifyConfigured } from '@/lib/shopify'
import { maxCartLines, parseCartLine, requestIsTooLarge } from '@/lib/cartValidation'
import { incrementMetric, recordApiResult } from '@/lib/observability'

const cartIdCookieName = 'jamm_shopify_cart_id'
const cartCookieMaxAge = 60 * 60 * 24 * 30
function readCartId(request: Request) {
  const cookieHeader = request.headers.get('cookie') ?? ''

  const encodedCartId = cookieHeader
    .split(';')
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${cartIdCookieName}=`))
    ?.split('=')
    .slice(1)
    .join('=')

  if (!encodedCartId) return undefined

  try {
    return decodeURIComponent(encodedCartId)
  } catch {
    return undefined
  }
}

function jsonError(message: string, status: number, operation: string, startedAt: number) {
  incrementMetric('cart_operations_total', { operation, result: status >= 500 ? 'error' : 'rejected' })
  recordApiResult('/api/shopify/cart', status, startedAt)
  return NextResponse.json({ error: message }, { status })
}

function jsonCartResponse(cart: { id: string; checkoutUrl: string; totalQuantity: number }, operation: string, startedAt: number) {
  incrementMetric('cart_operations_total', { operation, result: 'accepted' })
  recordApiResult('/api/shopify/cart', 200, startedAt)
  const response = NextResponse.json({ cart })

  response.cookies.set(cartIdCookieName, cart.id, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: cartCookieMaxAge,
  })

  return response
}

// Client components call this route instead of Shopify directly so the
// Storefront token stays server-side. The Shopify cart id is kept in an
// httpOnly cookie and reused for later add-to-cart actions.
export async function POST(request: Request) {
  const startedAt = Date.now()
  const operation = 'add'
  if (requestIsTooLarge(request)) {
    return jsonError('Request too large.', 413, operation, startedAt)
  }

  if (!isShopifyConfigured()) {
    return jsonError('Shopify is not configured.', 503, operation, startedAt)
  }

  const body = await request.json().catch(() => null)
  const line = parseCartLine({
    variantId: body?.variantId,
    quantity: body?.quantity ?? 1,
  })

  if (!line) {
    return jsonError('A valid variantId and quantity are required.', 400, operation, startedAt)
  }

  // First item creates a Shopify cart; later items append lines to that cart.
  const cartId = readCartId(request)
  const payload = cartId
    ? (await addShopifyCartLines(cartId, line.variantId, line.quantity))?.cartLinesAdd
    : (await createShopifyCart(line.variantId, line.quantity))?.cartCreate
  const errors = payload?.userErrors ?? []

  if (!payload?.cart || errors.length > 0) {
    return jsonError(errors[0]?.message ?? 'Unable to update Shopify cart.', 400, operation, startedAt)
  }

  return jsonCartResponse(payload.cart, operation, startedAt)
}

export async function PUT(request: Request) {
  const startedAt = Date.now()
  const operation = 'sync'
  if (requestIsTooLarge(request)) {
    return jsonError('Request too large.', 413, operation, startedAt)
  }

  if (!isShopifyConfigured()) {
    return jsonError('Shopify is not configured.', 503, operation, startedAt)
  }

  const body = await request.json().catch(() => null)
  const lines: unknown[] = Array.isArray(body?.lines) ? body.lines : []
  if (lines.length > maxCartLines) {
    return jsonError(`A cart may contain at most ${maxCartLines} lines.`, 400, operation, startedAt)
  }

  const validLines = lines.flatMap((line) => {
    const parsedLine = parseCartLine(line)
    return parsedLine ? [parsedLine] : []
  })

  if (validLines.length === 0 || validLines.length !== lines.length) {
    return jsonError('Every cart line needs a valid Shopify variantId and quantity from 1 to 99.', 400, operation, startedAt)
  }

  const payload = (await createShopifyCartFromLines(validLines))?.cartCreate
  const errors = payload?.userErrors ?? []

  if (!payload?.cart || errors.length > 0) {
    return jsonError(errors[0]?.message ?? 'Unable to sync Shopify cart.', 400, operation, startedAt)
  }

  return jsonCartResponse(payload.cart, operation, startedAt)
}
