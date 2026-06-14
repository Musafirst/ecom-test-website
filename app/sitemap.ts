import type { MetadataRoute } from 'next'
import { getGuideArticles } from '@/lib/articles'
import { getAllProducts } from '@/lib/products'
import { absoluteSiteUrl } from '@/lib/site'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getAllProducts()
  const articles = getGuideArticles()
  const staticRoutes = [
    '',
    '/shop',
    '/shop/about',
    '/shop/category/perfumes',
    '/shop/category/clothing',
    '/shop/collection/clothing',
    '/shop/collection/oud',
    '/shop/collection/amber',
    '/shop/collection/daily',
    '/shop/category/electronics',
    '/shop/collection/audio',
    '/shop/collection/smartwatches',
    '/shop/contact',
    '/shop/guides',
    '/shop/refund-policy',
    '/shop/shipping-policy',
    '/shop/shipping-returns',
    '/shop/privacy-policy',
    '/shop/terms-of-service',
  ]

  return [
    ...staticRoutes.map((route) => ({
      url: absoluteSiteUrl(route),
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: route === '' || route === '/shop' ? 1 : 0.7,
    })),
    ...products.map((product) => ({
      url: absoluteSiteUrl(`/shop/product/${product.handle}`),
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    })),
    ...articles.map((article) => ({
      url: absoluteSiteUrl(`/shop/guides/${article.slug}`),
      lastModified: new Date(`${article.date}T00:00:00`),
      changeFrequency: 'monthly' as const,
      priority: 0.65,
    })),
  ]
}
