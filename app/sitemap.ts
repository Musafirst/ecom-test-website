import type { MetadataRoute } from 'next'
import { getAllProducts } from '@/lib/products'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://jammtrade.com')

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getAllProducts()
  const staticRoutes = [
    '',
    '/shop',
    '/shop/collection/oud',
    '/shop/collection/amber',
    '/shop/collection/daily',
    '/shop/category/electronics',
    '/shop/category/audio',
    '/shop/category/smartwatches',
    '/shop/shipping-returns',
    '/shop/privacy-policy',
  ]

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: route === '' || route === '/shop' ? 1 : 0.7,
    })),
    ...products.map((product) => ({
      url: `${siteUrl}/product/${product.handle}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    })),
  ]
}
