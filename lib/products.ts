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
// stays centralized and local demo products remain development-only fallback data.
export const collectionDetails = {
  ...fallbackCollectionDetails,
  electronics: {
    name: 'Electronics',
    intro: 'Premium audio, smartwatches, and everyday electronics selected for quality and focus.',
    note: 'Premium audio and wearable tech chosen for everyday quality.',
    count: `${fallbackProducts.filter((product) => product.category === 'electronics').length} products`,
  },
  audio: {
    name: 'Audio',
    intro: 'Headphones and earbuds selected for everyday listening, travel, and focus.',
    note: 'Headphones and earbuds selected for listening, travel, and focus.',
    count: `${fallbackProducts.filter((product) => product.subcategory === 'headphones-audio').length} products`,
  },
  smartwatches: {
    name: 'Smartwatches',
    intro: 'Wearable tech for daily tracking, notifications, and refined utility.',
    note: 'Wearable tech for daily tracking, notifications, and refined utility.',
    count: `${fallbackProducts.filter((product) => product.subcategory === 'smartwatches').length} products`,
  },
  clothing: {
    name: 'Clothing',
    intro: 'Jamm Trade apparel with the lotus mark across everyday essentials.',
    note: 'Apparel carrying the Jamm Trade lotus mark, made for everyday wear.',
    count: '0 products',
  },
} as const

export const categoryDetails = fallbackCategoryDetails

export const demoProducts = fallbackProducts

// Main product list used by shop, checkout, and static route generation.
export async function getAllProducts() {
  return getShopifyProducts()
}

// Homepage product grid: first four products sorted by title, matching the
// Shopify theme's featured section exactly so both storefronts stay identical.
export async function getFeaturedProducts() {
  const products = await getShopifyProducts()

  return [...products].sort((a, b) => a.title.localeCompare(b.title)).slice(0, 4)
}

// Perfume category: all fragrance products across oud, amber, and daily.
export async function getPerfumeProducts() {
  const products = await getShopifyProducts()
  const perfumeProducts = products.filter((product) => product.category === 'perfume')

  return perfumeProducts.length > 0 || process.env.NODE_ENV === 'production'
    ? perfumeProducts
    : fallbackProducts.filter((product) => product.category === 'perfume')
}

// Secondary electronics category uses Shopify when matching products exist.
export async function getElectronicsProducts() {
  const products = await getShopifyProducts()
  const electronicsProducts = products.filter((product) => product.category === 'electronics')

  return electronicsProducts.length > 0 || process.env.NODE_ENV === 'production'
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
