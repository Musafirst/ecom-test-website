import { categoryDetails as fallbackCategoryDetails, collectionDetails as fallbackCollectionDetails } from '@/data/collections'
import { allProducts as fallbackProducts } from '@/data/products'
import {
  getCollectionCounts,
  getShopifyCollectionProducts,
  getShopifyProductByHandle,
  getShopifyProducts,
  isSupportedCollectionHandle,
} from '@/lib/shopify'

// App-facing product facade. Pages import from here so the Shopify migration
// stays centralized and local demo products remain available as fallback data.
export const collectionDetails = {
  ...fallbackCollectionDetails,
  electronics: {
    name: 'Electronics',
    intro: 'Premium audio, smartwatches, and everyday electronics selected for quality and focus.',
    note: 'Live Shopify collection products are shown when available.',
    count: `${fallbackProducts.filter((product) => product.category === 'electronics').length} products`,
  },
  audio: {
    name: 'Audio',
    intro: 'Headphones and earbuds selected for everyday listening, travel, and focus.',
    note: 'Audio products are powered by Shopify when the collection is available.',
    count: `${fallbackProducts.filter((product) => product.subcategory === 'headphones-audio').length} products`,
  },
  smartwatches: {
    name: 'Smartwatches',
    intro: 'Wearable tech for daily tracking, notifications, and refined utility.',
    note: 'Smartwatch products are powered by Shopify when the collection is available.',
    count: `${fallbackProducts.filter((product) => product.subcategory === 'smartwatches').length} products`,
  },
} as const

export const categoryDetails = fallbackCategoryDetails

export const demoProducts = fallbackProducts

// Main product list used by shop, checkout, and static route generation.
export async function getAllProducts() {
  return getShopifyProducts()
}

// Homepage product grid stays curated by count/order, but its products now come
// from Shopify when available.
export async function getFeaturedProducts() {
  const products = await getShopifyProducts()
  const fragranceProducts = products.filter((product) => product.category === 'perfume')

  return (fragranceProducts.length > 0 ? fragranceProducts : products).slice(0, 4)
}

// Secondary electronics category uses Shopify when matching products exist.
export async function getElectronicsProducts() {
  const products = await getShopifyProducts()
  const electronicsProducts = products.filter((product) => product.category === 'electronics')

  return electronicsProducts.length > 0
    ? electronicsProducts
    : fallbackProducts.filter((product) => product.category === 'electronics')
}

// Collection copy remains local/manual; product contents are Shopify-first.
export async function getCollectionProducts(collection: string) {
  return getShopifyCollectionProducts(collection)
}

export async function getProductByHandle(handle: string) {
  return getShopifyProductByHandle(handle)
}

export async function getCollectionDetails() {
  const counts = await getCollectionCounts()

  return Object.fromEntries(
    Object.entries(collectionDetails).map(([handle, details]) => {
      const count = counts[handle as keyof typeof counts]
      const suffix = handle === 'oud' || handle === 'amber' || handle === 'daily' ? 'fragrances' : 'products'

      return [
        handle,
        {
          ...details,
          count: `${count ?? 0} ${suffix}`,
        },
      ]
    }),
  ) as typeof collectionDetails
}

export { isSupportedCollectionHandle }
