export const site = {
  name: 'Jamm Trade',
  defaultUrl: 'https://jammtrade.com',
  apexUrl: 'https://jammtrade.com',
  wwwUrl: 'https://www.jammtrade.com',
  shopUrl: 'https://shop.jammtrade.com',
  supportEmail: 'contact@jammtrade.com',
  description: 'Rare fragrances. Curated for those who know the difference.',
}

export function normalizeOrigin(value?: string) {
  if (!value) return null

  try {
    return new URL(value.startsWith('http') ? value : `https://${value}`).origin
  } catch {
    return null
  }
}

export const siteUrl =
  normalizeOrigin(process.env.NEXT_PUBLIC_SITE_URL) ??
  normalizeOrigin(process.env.VERCEL_URL) ??
  site.defaultUrl

// Browser-facing API routes should only accept calls from the public storefront.
// Shopify webhooks are handled separately because they are server-to-server.
export const allowedStorefrontOrigins = new Set(
  [
    siteUrl,
    site.apexUrl,
    site.wwwUrl,
    site.shopUrl,
    normalizeOrigin(process.env.VERCEL_URL),
  ].filter((value): value is string => Boolean(value)),
)

export function absoluteSiteUrl(path = '') {
  if (path.startsWith('http')) return path
  return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`
}
