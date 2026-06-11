const isProduction = process.env.NODE_ENV === 'production'
const scriptSrc = isProduction
  ? "'self' 'unsafe-inline' https://apis.google.com"
  : "'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com"

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep static generation reliable on memory-constrained CI and local machines.
  experimental: {
    cpus: 2,
  },

  // Security headers apply to every route served by the public Next.js site.
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-DNS-Prefetch-Control', value: 'off' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(self)' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              `script-src ${scriptSrc}`,
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https:",
              "connect-src 'self'",
              "frame-src 'none'",
              "frame-ancestors 'none'",
              "form-action 'self' https://*.myshopify.com",
              "base-uri 'self'",
              'upgrade-insecure-requests',
            ].join('; '),
          },
        ],
      },
    ]
  },

  // Remote product images are allowed from Shopify and trusted supplier/CDN hosts.
  images: {
    formats: ['image/webp', 'image/avif'],
    qualities: [75, 82, 90],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.pexels.com', pathname: '/photos/**' },
      { protocol: 'https', hostname: 'www.lattafaindia.com', pathname: '/cdn/shop/files/**' },
      { protocol: 'https', hostname: 'd1ncau8tqf99kp.cloudfront.net', pathname: '/**' },
      { protocol: 'https', hostname: 'd8j0ntlcm91z4.cloudfront.net', pathname: '/**' },
      { protocol: 'https', hostname: 'www.jbl.com', pathname: '/dw/image/**' },
      { protocol: 'https', hostname: 'image-us.samsung.com', pathname: '/**' },
      { protocol: 'https', hostname: 'images.samsung.com', pathname: '/**' },
      { protocol: 'https', hostname: 'static.bhphoto.com', pathname: '/**' },
      { protocol: 'https', hostname: 'pisces.bbystatic.com', pathname: '/**' },
      { protocol: 'https', hostname: 'mnd-assets.mynewsdesk.com', pathname: '/**' },
      { protocol: 'https', hostname: 'm.media-amazon.com', pathname: '/images/**' },
      { protocol: 'https', hostname: 'cdn.shopify.com', pathname: '/s/files/**' },
    ],
  },
}

export default nextConfig
