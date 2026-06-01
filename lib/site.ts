export const site = {
  name: 'Jamm Trade',
  defaultUrl: 'https://www.jammtrade.com',
  apexUrl: 'https://jammtrade.com',
  wwwUrl: 'https://www.jammtrade.com',
  supportEmail: 'contact@jammtrade.com',
  publicLocation: 'Philadelphia, PA',
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
  site.defaultUrl

const localDevelopmentOrigins = process.env.NODE_ENV === 'production'
  ? []
  : ['http://localhost:3000', 'http://127.0.0.1:3000']

// Browser-facing API routes should only accept calls from the public storefront.
// Shopify webhooks are handled separately because they are server-to-server.
export const allowedStorefrontOrigins = new Set(
  [
    siteUrl,
    site.apexUrl,
    site.wwwUrl,
    normalizeOrigin(process.env.VERCEL_URL),
    ...localDevelopmentOrigins,
  ].filter((value): value is string => Boolean(value)),
)

export function absoluteSiteUrl(path = '') {
  if (path.startsWith('http')) return path
  return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`
}
