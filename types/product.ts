export type ProductCollection = 'oud' | 'amber' | 'daily' | 'clothing' | 'electronics'
export type ProductBadgeType = 'new' | 'bestseller'

// Structured to map directly to Shopify Storefront API product fields.
// Replace static data in lib/products.ts with Storefront API calls when connecting Shopify.
export interface JammProduct {
  id: string
  handle: string
  title: string
  price: number
  compareAtPrice?: number
  collection: ProductCollection
  badge?: ProductBadgeType
  description?: string
  image: string
  imageAlt: string
  brand?: string
}
