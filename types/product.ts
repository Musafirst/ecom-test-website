export type ProductCollection = 'oud' | 'amber' | 'daily'
export type ProductCategory = 'perfume' | 'electronics' | 'clothing'
export type ProductSubcategory = 'fragrance' | 'headphones-audio' | 'smartwatches' | 'apparel'
export type ProductBadgeType = 'new' | 'bestseller'

// Structured to map directly to Shopify Storefront API product fields.
// Replace static data in data/products.ts with Storefront API calls when connecting Shopify.
export interface JammProduct {
  id: string
  handle: string
  title: string
  price: number
  compareAtPrice?: number
  collection?: ProductCollection
  category: ProductCategory
  categoryLabel: string
  subcategory?: ProductSubcategory
  tags: string[]
  badge?: ProductBadgeType
  description?: string
  image: string
  imageAlt: string
  details?: string[]
  included?: string[]
  galleryImages?: string[]
  brand?: string
}
