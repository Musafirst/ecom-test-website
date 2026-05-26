/** @type {import('next').NextConfig} */
const nextConfig = {

  // ── Security headers ────────────────────────────────────────────────────
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Prevent MIME sniffing
          { key: 'X-Content-Type-Options',    value: 'nosniff' },
          // Block clickjacking
          { key: 'X-Frame-Options',           value: 'DENY' },
          // Limit referrer info
          { key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin' },
          // Disable browser DNS prefetch
          { key: 'X-DNS-Prefetch-Control',    value: 'off' },
          // Disable unwanted browser features
          { key: 'Permissions-Policy',        value: 'camera=(), microphone=(), geolocation=(), payment=(self)' },
          // Force HTTPS for 2 years
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          // Prevent browsers from loading the page in a frame
          {
            key:   'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // Next.js requires unsafe-inline for hydration scripts
              "script-src 'self' 'unsafe-inline' https://apis.google.com",
              // Tailwind & Framer Motion use inline styles
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              // Remote images from Shopify CDN and product sources
              "img-src 'self' data: blob: https:",
              // API calls: Supabase + Shopify
              "connect-src 'self' https://*.myshopify.com https://*.shopify.com https://*.supabase.co",
              // No frames
              "frame-src 'none'",
              "frame-ancestors 'none'",
              // Only submit forms to own domain or Shopify checkout
              "form-action 'self' https://*.myshopify.com",
              // Prevent base-tag hijacking
              "base-uri 'self'",
              // Block mixed content
              "upgrade-insecure-requests",
            ].join('; '),
          },
        ],
      },
    ]
  },

  // ── Image optimisation ──────────────────────────────────────────────────
  images: {
    formats: ['image/webp', 'image/avif'],
    qualities: [75, 82, 90],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.pexels.com',           pathname: '/photos/**' },
      { protocol: 'https', hostname: 'fimgs.net',                   pathname: '/mdimg/perfume-thumbs/**' },
      { protocol: 'https', hostname: 'www.lattafaindia.com',         pathname: '/cdn/shop/files/**' },
      { protocol: 'https', hostname: 'us.afnan.com',                pathname: '/cdn/shop/files/**' },
      { protocol: 'https', hostname: 'd1ncau8tqf99kp.cloudfront.net', pathname: '/**' },
      { protocol: 'https', hostname: 'd8j0ntlcm91z4.cloudfront.net', pathname: '/**' },
      { protocol: 'https', hostname: 'www.jbl.com',                 pathname: '/dw/image/**' },
      { protocol: 'https', hostname: 'image-us.samsung.com',        pathname: '/**' },
      { protocol: 'https', hostname: 'images.samsung.com',          pathname: '/**' },
      { protocol: 'https', hostname: 'static.bhphoto.com',          pathname: '/**' },
      { protocol: 'https', hostname: 'pisces.bbystatic.com',        pathname: '/**' },
      { protocol: 'https', hostname: 'mnd-assets.mynewsdesk.com',   pathname: '/**' },
      { protocol: 'https', hostname: 'm.media-amazon.com',          pathname: '/images/**' },
      { protocol: 'https', hostname: 'www.intenseoud.com',          pathname: '/cdn/shop/**' },
      { protocol: 'https', hostname: 'afnan.com',                   pathname: '/cdn/shop/**' },
      { protocol: 'https', hostname: 'us.afnan.com',                pathname: '/cdn/shop/**' },
      { protocol: 'https', hostname: 'armafperfume.com',            pathname: '/cdn/shop/**' },
      { protocol: 'https', hostname: 'www.myperfumeshop.com',       pathname: '/cdn/shop/**' },
      { protocol: 'https', hostname: 'cdn.shopify.com',             pathname: '/s/files/**' },
      { protocol: 'https', hostname: 'www.lattafa-usa.com',         pathname: '/cdn/shop/**' },
      { protocol: 'https', hostname: 'armaf.com',                   pathname: '/cdn/shop/**' },
    ],
  },
}

export default nextConfig
