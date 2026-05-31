import { NextResponse } from 'next/server'
import { addShopifyCartLines, createShopifyCart, createShopifyCartFromLines, isShopifyConfigured } from '@/lib/shopify'

const cartIdCookieName = 'jamm_shopify_cart_id'
const cartCookieMaxAge = 60 * 60 * 24 * 30
const maxBodyBytes = 20_480
const maxCartLines = 50
const maxQuantity = 99
const shopifyVariantIdPattern = /^gid:\/\/shopify\/ProductVariant\/\d+$/

type CartLineInput = {
  variantId: string
  quantity: number
}

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

function parseCartLine(line: unknown): CartLineInput | null {
  if (!line || typeof line !== 'object') return null

  const variantId = 'variantId' in line && typeof line.variantId === 'string' ? line.variantId : ''
  const quantity = Number('quantity' in line ? line.quantity : 0)

  return shopifyVariantIdPattern.test(variantId) && Number.isInteger(quantity) && quantity > 0 && quantity <= maxQuantity
    ? { variantId, quantity }
    : null
}

function requestIsTooLarge(request: Request) {
  return Number(request.headers.get('content-length') ?? 0) > maxBodyBytes
}

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status })
}

function jsonCartResponse(cart: { id: string; checkoutUrl: string; totalQuantity: number }) {
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
  if (requestIsTooLarge(request)) {
    return jsonError('Request too large.', 413)
  }

  if (!isShopifyConfigured()) {
    return jsonError('Shopify is not configured.', 503)
  }

  const body = await request.json().catch(() => null)
  const line = parseCartLine({
    variantId: body?.variantId,
    quantity: body?.quantity ?? 1,
  })

  if (!line) {
    return jsonError('A valid variantId and quantity are required.', 400)
  }

  // First item creates a Shopify cart; later items append lines to that cart.
  const cartId = readCartId(request)
  const payload = cartId
    ? (await addShopifyCartLines(cartId, line.variantId, line.quantity))?.cartLinesAdd
    : (await createShopifyCart(line.variantId, line.quantity))?.cartCreate
  const errors = payload?.userErrors ?? []

  if (!payload?.cart || errors.length > 0) {
    return jsonError(errors[0]?.message ?? 'Unable to update Shopify cart.', 400)
  }

  return jsonCartResponse(payload.cart)
}

export async function PUT(request: Request) {
  if (requestIsTooLarge(request)) {
    return jsonError('Request too large.', 413)
  }

  if (!isShopifyConfigured()) {
    return jsonError('Shopify is not configured.', 503)
  }

  const body = await request.json().catch(() => null)
  const lines: unknown[] = Array.isArray(body?.lines) ? body.lines : []
  if (lines.length > maxCartLines) {
    return jsonError(`A cart may contain at most ${maxCartLines} lines.`, 400)
  }

  const validLines = lines.flatMap((line) => {
    const parsedLine = parseCartLine(line)
    return parsedLine ? [parsedLine] : []
  })

  if (validLines.length === 0 || validLines.length !== lines.length) {
    return jsonError('Every cart line needs a valid Shopify variantId and quantity from 1 to 99.', 400)
  }

  const payload = (await createShopifyCartFromLines(validLines))?.cartCreate
  const errors = payload?.userErrors ?? []

  if (!payload?.cart || errors.length > 0) {
    return jsonError(errors[0]?.message ?? 'Unable to sync Shopify cart.', 400)
  }

  return jsonCartResponse(payload.cart)
}
