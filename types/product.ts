export type ProductCollection = 'oud' | 'amber' | 'daily' | 'electronics' | 'audio' | 'smartwatches' | 'clothing'
export type ProductCategory = 'perfume' | 'electronics' | 'clothing' | 'health'
export type ProductSubcategory = 'fragrance' | 'headphones-audio' | 'smartwatches' | 'apparel' | 'supplements'
export type ProductBadgeType = 'new' | 'bestseller'

export interface JammProductOption {
  name: string
  values: string[]
}

export interface JammProductVariant {
  id: string
  title: string
  availableForSale: boolean
  price: number
  compareAtPrice?: number
  selectedOptions: { name: string; value: string }[]
  image?: string
}

// Stable product shape used by all product UI.
// Shopify products are mapped into this shape in lib/shopify.ts, while
// data/products.ts remains a live-catalog fallback for local development.
export interface JammProduct {
  id: string
  handle: string
  title: string
  price: number
  priceMax?: number
  compareAtPrice?: number
  currencyCode?: string
  options?: JammProductOption[]
  variants?: JammProductVariant[]
  variantId?: string
  sku?: string
  gtin?: string
  mpn?: string
  availableForSale?: boolean
  quantityAvailable?: number | null
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
