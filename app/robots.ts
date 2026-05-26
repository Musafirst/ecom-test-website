import type { MetadataRoute } from 'next'
import { absoluteSiteUrl } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/shop/checkout'],
    },
    sitemap: absoluteSiteUrl('/sitemap.xml'),
  }
}
