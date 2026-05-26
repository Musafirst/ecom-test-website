/**
 * Next.js Edge Middleware — runs before every request.
 *
 * Responsibilities:
 *  1. Security headers on all responses (clickjacking, MIME sniffing, HSTS…)
 *  2. CORS — API routes only accept browser requests from jammtrade.com
 *  3. Block requests with no User-Agent (bots / scanners)
 */

import { NextRequest, NextResponse } from 'next/server'

const IS_PROD    = process.env.NODE_ENV === 'production'
const SITE_ORIGIN = 'https://jammtrade.com'

// Routes that must only be called server-to-server (no browser Origin allowed)
const WEBHOOK_PATHS = ['/api/webhooks/']

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const origin       = req.headers.get('origin')
  const userAgent    = req.headers.get('user-agent') ?? ''

  // ── 1. Block empty User-Agent (automated scanners) ───────────────────────
  if (!userAgent && !pathname.startsWith('/api/webhooks/')) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  // ── 2. CORS enforcement on API routes ────────────────────────────────────
  if (pathname.startsWith('/api/')) {

    // Webhook routes: must NOT come from a browser (no Origin header expected)
    const isWebhook = WEBHOOK_PATHS.some((p) => pathname.startsWith(p))
    if (isWebhook && origin) {
      // Shopify sends server-to-server — no Origin header; reject any browser call
      return new NextResponse('Forbidden', { status: 403 })
    }

    // Non-webhook API: block cross-origin browser requests from unknown origins
    if (!isWebhook && origin && origin !== SITE_ORIGIN) {
      return new NextResponse('Forbidden', { status: 403 })
    }

    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin':  SITE_ORIGIN,
          'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Max-Age':       '86400',
        },
      })
    }
  }

  // ── 3. Build response with security headers ───────────────────────────────
  const res = NextResponse.next()

  // Prevent clickjacking
  res.headers.set('X-Frame-Options', 'DENY')
  res.headers.set('Content-Security-Policy', "frame-ancestors 'none'")

  // Prevent MIME-type sniffing
  res.headers.set('X-Content-Type-Options', 'nosniff')

  // Disable DNS prefetching (privacy)
  res.headers.set('X-DNS-Prefetch-Control', 'off')

  // Limit referrer info sent to third parties
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  // Restrict browser feature access
  res.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(self)',
  )

  // Force HTTPS for 2 years (production only)
  if (IS_PROD) {
    res.headers.set(
      'Strict-Transport-Security',
      'max-age=63072000; includeSubDomains; preload',
    )
  }

  // Set CORS header for same-origin API responses
  if (pathname.startsWith('/api/') && origin === SITE_ORIGIN) {
    res.headers.set('Access-Control-Allow-Origin', SITE_ORIGIN)
  }

  return res
}

export const config = {
  // Run on every route except Next.js internals and static assets
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|woff2?|ttf|eot)).*)',
  ],
}
