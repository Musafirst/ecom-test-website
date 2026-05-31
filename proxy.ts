/**
 * Request guard for the public storefront.
 *
 * Responsibilities:
 * 1. Apply security headers before the page or API route runs.
 * 2. Allow browser API calls only from the configured storefront origins.
 * 3. Keep Shopify webhooks server-to-server only.
 */

import { NextRequest, NextResponse } from 'next/server'
import { allowedStorefrontOrigins, siteUrl } from '@/lib/site'

const IS_PROD = process.env.NODE_ENV === 'production'
const WEBHOOK_PATHS = ['/api/webhooks/']

function isWebhookPath(pathname: string) {
  return WEBHOOK_PATHS.some((path) => pathname.startsWith(path))
}

function corsOriginFor(origin: string | null) {
  return origin && allowedStorefrontOrigins.has(origin) ? origin : siteUrl
}

function applySecurityHeaders(response: NextResponse) {
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-DNS-Prefetch-Control', 'off')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=(self)')

  if (IS_PROD) {
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
  }
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  const origin = req.headers.get('origin')
  if (pathname.startsWith('/api/')) {
    const isWebhook = isWebhookPath(pathname)

    // Shopify webhooks are server-to-server requests and should not have an Origin.
    if (isWebhook && origin) {
      return new NextResponse('Forbidden', { status: 403 })
    }

    if (!isWebhook && origin && !allowedStorefrontOrigins.has(origin)) {
      return new NextResponse('Forbidden', { status: 403 })
    }

    if (req.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': corsOriginFor(origin),
          'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Max-Age': '86400',
        },
      })
    }
  }

  const response = NextResponse.next()
  applySecurityHeaders(response)

  if (pathname.startsWith('/api/') && origin && allowedStorefrontOrigins.has(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin)
    response.headers.set('Vary', 'Origin')
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|woff2?|ttf|eot)).*)',
  ],
}
