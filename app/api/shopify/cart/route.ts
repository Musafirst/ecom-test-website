import { NextResponse } from 'next/server'
import { addShopifyCartLines, createShopifyCart, createShopifyCartFromLines, isShopifyConfigured } from '@/lib/shopify'

const cartIdCookieName = 'jamm_shopify_cart_id'

// Client components call this route instead of Shopify directly so the
// Storefront token stays server-side. The Shopify cart id is kept in an
// httpOnly cookie and reused for later add-to-cart actions.
export async function POST(request: Request) {
  if (!isShopifyConfigured()) {
    return NextResponse.json({ error: 'Shopify is not configured.' }, { status: 503 })
  }

  const body = await request.json().catch(() => null)
  const variantId = body?.variantId
  const quantity = Number(body?.quantity ?? 1)

  if (!variantId || !Number.isFinite(quantity) || quantity < 1) {
    return NextResponse.json({ error: 'A valid variantId and quantity are required.' }, { status: 400 })
  }

  // Route handlers receive a standard Request, so read this cookie manually.
  const cookieHeader = request.headers.get('cookie') ?? ''
  const cartId = cookieHeader
    .split(';')
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${cartIdCookieName}=`))
    ?.split('=')
    .slice(1)
    .join('=')

  // First item creates a Shopify cart; later items append lines to that cart.
  const payload = cartId
    ? (await addShopifyCartLines(decodeURIComponent(cartId), variantId, quantity))?.cartLinesAdd
    : (await createShopifyCart(variantId, quantity))?.cartCreate
  const errors = payload?.userErrors ?? []

  if (!payload?.cart || errors.length > 0) {
    return NextResponse.json({ error: errors[0]?.message ?? 'Unable to update Shopify cart.' }, { status: 400 })
  }

  const response = NextResponse.json({ cart: payload.cart })
  response.cookies.set(cartIdCookieName, payload.cart.id, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  })

  return response
}

export async function PUT(request: Request) {
  if (!isShopifyConfigured()) {
    return NextResponse.json({ error: 'Shopify is not configured.' }, { status: 503 })
  }

  const body = await request.json().catch(() => null)
  const lines: unknown[] = Array.isArray(body?.lines) ? body.lines : []
  const validLines = lines
    .map((line) => ({
      variantId: typeof line === 'object' && line && 'variantId' in line && typeof line.variantId === 'string' ? line.variantId : '',
      quantity: Number(typeof line === 'object' && line && 'quantity' in line ? line.quantity : 0),
    }))
    .filter((line) => line.variantId && Number.isFinite(line.quantity) && line.quantity > 0)

  if (validLines.length === 0) {
    return NextResponse.json({ error: 'At least one valid cart line is required.' }, { status: 400 })
  }

  const payload = (await createShopifyCartFromLines(validLines))?.cartCreate
  const errors = payload?.userErrors ?? []

  if (!payload?.cart || errors.length > 0) {
    return NextResponse.json({ error: errors[0]?.message ?? 'Unable to sync Shopify cart.' }, { status: 400 })
  }

  const response = NextResponse.json({ cart: payload.cart })
  response.cookies.set(cartIdCookieName, payload.cart.id, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  })

  return response
}
