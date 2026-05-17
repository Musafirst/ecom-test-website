import { allProducts as fallbackProducts } from '@/data/products'
import {
  cartCreateMutation,
  cartLinesAddMutation,
  collectionByHandleQuery,
  collectionsQuery,
  productByHandleQuery,
  productsQuery,
} from '@/lib/shopifyQueries'
import type { JammProduct, ProductCategory, ProductCollection, ProductSubcategory } from '@/types/product'

// This module is the Shopify boundary. Raw Storefront API responses are mapped
// into JammProduct here so components can stay unaware of Shopify's schema.
type ShopifyMoney = {
  amount: string
  currencyCode: string
}

type ShopifyImage = {
  url: string
  altText: string | null
}

type Edge<T> = {
  node: T
}

type ShopifyProduct = {
  id: string
  handle: string
  title: string
  description: string
  vendor: string
  productType: string
  tags: string[]
  availableForSale: boolean
  featuredImage: ShopifyImage | null
  images: { edges: Edge<ShopifyImage>[] }
  priceRange: { minVariantPrice: ShopifyMoney }
  compareAtPriceRange: { minVariantPrice: ShopifyMoney }
  variants: {
    edges: Edge<{
      id: string
      title: string
      availableForSale: boolean
      quantityAvailable: number | null
      price: ShopifyMoney
      compareAtPrice: ShopifyMoney | null
    }>[]
  }
  collections: {
    edges: Edge<{
      handle: string
      title: string
    }>[]
  }
}

export type ShopifyCollection = {
  id: string
  handle: string
  title: string
  description: string
  image?: ShopifyImage | null
  products?: { edges: Edge<ShopifyProduct>[] }
}

const collectionHandles = ['oud', 'amber', 'daily', 'electronics', 'audio', 'smartwatches'] as const
const collectionHandleSet = new Set<string>(collectionHandles)
const loggedShopifyErrors = new Set<string>()

function logShopifyErrorOnce(key: string, message: string, details?: unknown) {
  if (loggedShopifyErrors.has(key)) return

  loggedShopifyErrors.add(key)
  if (details) {
    console.error(message, details)
  } else {
    console.error(message)
  }
}

// Accept either "store.myshopify.com" or a full URL in env vars.
function getStorefrontUrl() {
  const domain = process.env.SHOPIFY_STORE_DOMAIN

  if (!domain) return null

  const normalizedDomain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '')
  return `https://${normalizedDomain}/api/2026-01/graphql.json`
}

export function isShopifyConfigured() {
  return Boolean(getStorefrontUrl() && process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN)
}

// Server-side Storefront API fetch helper. It returns null instead of throwing
// so callers can fall back to local demo data during setup or API outages.
export async function shopifyFetch<T>(query: string, variables: Record<string, unknown> = {}): Promise<T | null> {
  const url = getStorefrontUrl()
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN

  if (!url || !token) return null

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token,
      },
      body: JSON.stringify({ query, variables }),
      // Vercel/Next cache: refresh live product data every five minutes.
      next: { revalidate: 300 },
    })

    if (!response.ok) {
      logShopifyErrorOnce(
        `http-${response.status}`,
        `Shopify Storefront API failed: ${response.status} ${response.statusText}. Check SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN.`,
      )
      return null
    }

    const json = await response.json()

    if (json.errors) {
      logShopifyErrorOnce('graphql-errors', 'Shopify Storefront API errors:', json.errors)
      return null
    }

    return json.data as T
  } catch (error) {
    logShopifyErrorOnce('request-failed', 'Shopify Storefront API request failed:', error)
    return null
  }
}

function normalizeHandle(value: string) {
  return value.toLowerCase().trim().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

// Shopify products can be categorized by collection, product type, or tags.
// If a product lands in the wrong section, check those Shopify fields first.
function getProductCollection(product: ShopifyProduct): ProductCollection | undefined {
  const handles = product.collections.edges.map(({ node }) => normalizeHandle(node.handle))
  const titles = product.collections.edges.map(({ node }) => normalizeHandle(node.title))
  const tags = product.tags.map(normalizeHandle)
  const candidates = [...handles, ...titles, ...tags, normalizeHandle(product.productType)]

  return collectionHandles.find((handle) => candidates.includes(handle))
}

function getCategory(product: ShopifyProduct, collection?: ProductCollection): ProductCategory {
  const values = [product.productType, product.vendor, ...product.tags, collection ?? ''].map(normalizeHandle)

  if (values.some((value) => value.includes('electronics') || value.includes('audio') || value.includes('watch'))) {
    return 'electronics'
  }

  if (values.some((value) => value.includes('clothing') || value.includes('apparel') || value.includes('hoodie'))) {
    return 'clothing'
  }

  return 'perfume'
}

function getSubcategory(product: ShopifyProduct, category: ProductCategory, collection?: ProductCollection): ProductSubcategory | undefined {
  const values = [product.productType, ...product.tags, collection ?? ''].map(normalizeHandle)

  if (values.some((value) => value.includes('smartwatch') || value.includes('watch'))) return 'smartwatches'
  if (values.some((value) => value.includes('audio') || value.includes('headphone') || value.includes('earbud'))) return 'headphones-audio'
  if (category === 'perfume') return 'fragrance'
  if (category === 'clothing') return 'apparel'

  return undefined
}

function getCategoryLabel(category: ProductCategory, collection?: ProductCollection, subcategory?: ProductSubcategory) {
  if (collection === 'oud') return 'Oud'
  if (collection === 'amber') return 'Amber'
  if (collection === 'daily') return 'Daily'
  if (collection === 'audio' || subcategory === 'headphones-audio') return 'Headphones/audio'
  if (collection === 'smartwatches' || subcategory === 'smartwatches') return 'Smartwatches'
  if (category === 'electronics') return 'Electronics'
  if (category === 'clothing') return 'Clothing'

  return 'Fragrance'
}

function toPrice(value?: ShopifyMoney | null) {
  return value ? Number.parseFloat(value.amount) : undefined
}

// Convert Shopify's product/variant/image shape into the stable app contract.
// UI components should receive JammProduct and not raw Shopify objects.
function mapShopifyProduct(product: ShopifyProduct): JammProduct {
  const selectedVariant =
    product.variants.edges.find(({ node }) => node.availableForSale)?.node ?? product.variants.edges[0]?.node
  const collection = getProductCollection(product)
  const category = getCategory(product, collection)
  const subcategory = getSubcategory(product, category, collection)
  const featuredImage = product.featuredImage ?? product.images.edges[0]?.node
  const galleryImages = product.images.edges.map(({ node }) => node.url)
  const price = toPrice(selectedVariant?.price) ?? toPrice(product.priceRange.minVariantPrice) ?? 0
  const compareAtPrice =
    toPrice(selectedVariant?.compareAtPrice) ?? toPrice(product.compareAtPriceRange.minVariantPrice)

  return {
    id: product.id,
    handle: product.handle,
    title: product.title,
    price,
    compareAtPrice: compareAtPrice && compareAtPrice > price ? compareAtPrice : undefined,
    currencyCode: selectedVariant?.price.currencyCode ?? product.priceRange.minVariantPrice.currencyCode,
    variantId: selectedVariant?.id,
    availableForSale: selectedVariant?.availableForSale ?? product.availableForSale,
    quantityAvailable: selectedVariant?.quantityAvailable ?? null,
    collection,
    category,
    categoryLabel: getCategoryLabel(category, collection, subcategory),
    subcategory,
    tags: product.tags,
    description: product.description,
    brand: product.vendor,
    image: featuredImage?.url ?? '/product-images/placeholders/perfume.webp',
    imageAlt: featuredImage?.altText ?? product.title,
    galleryImages: galleryImages.length > 0 ? galleryImages : featuredImage ? [featuredImage.url] : undefined,
  }
}

function fallbackByCollection(handle: string) {
  return fallbackProducts.filter((product) => {
    if (handle === 'audio') return product.subcategory === 'headphones-audio'
    if (handle === 'smartwatches') return product.subcategory === 'smartwatches'
    if (handle === 'electronics') return product.category === 'electronics'
    return product.collection === handle
  })
}

// Shopify-first helpers with local fallback. This keeps the site usable before
// env vars are configured and protects previews from temporary Shopify errors.
export async function getShopifyProducts(first = 60): Promise<JammProduct[]> {
  const data = await shopifyFetch<{ products: { edges: Edge<ShopifyProduct>[] } }>(productsQuery, { first })
  const products = data?.products.edges.map(({ node }) => mapShopifyProduct(node)) ?? []

  return products.length > 0 ? products : fallbackProducts
}

export async function getShopifyProductByHandle(handle: string): Promise<JammProduct | undefined> {
  const data = await shopifyFetch<{ product: ShopifyProduct | null }>(productByHandleQuery, { handle })
  const product = data?.product ? mapShopifyProduct(data.product) : undefined

  return product ?? fallbackProducts.find((fallbackProduct) => fallbackProduct.handle === handle)
}

export async function getShopifyCollections(): Promise<ShopifyCollection[]> {
  const data = await shopifyFetch<{ collections: { edges: Edge<ShopifyCollection>[] } }>(collectionsQuery)

  return data?.collections.edges.map(({ node }) => node) ?? []
}

export async function getShopifyCollectionProducts(handle: string, first = 60): Promise<JammProduct[]> {
  const normalizedHandle = normalizeHandle(handle)
  const data = await shopifyFetch<{ collection: ShopifyCollection | null }>(collectionByHandleQuery, {
    handle: normalizedHandle,
    first,
  })
  const products = data?.collection?.products?.edges.map(({ node }) => mapShopifyProduct(node)) ?? []

  if (products.length > 0) return products

  const allProducts = await getShopifyProducts(first)
  const filteredProducts = allProducts.filter((product) => {
    if (normalizedHandle === 'audio') return product.subcategory === 'headphones-audio'
    if (normalizedHandle === 'smartwatches') return product.subcategory === 'smartwatches'
    if (normalizedHandle === 'electronics') return product.category === 'electronics'
    return product.collection === normalizedHandle
  })

  return filteredProducts.length > 0 ? filteredProducts : fallbackByCollection(normalizedHandle)
}

export async function getCollectionCounts() {
  const products = await getShopifyProducts()

  return Object.fromEntries(
    collectionHandles.map((handle) => [
      handle,
      products.filter((product) => {
        if (handle === 'audio') return product.subcategory === 'headphones-audio'
        if (handle === 'smartwatches') return product.subcategory === 'smartwatches'
        if (handle === 'electronics') return product.category === 'electronics'
        return product.collection === handle
      }).length,
    ]),
  ) as Record<(typeof collectionHandles)[number], number>
}

export function isSupportedCollectionHandle(handle: string) {
  return collectionHandleSet.has(normalizeHandle(handle))
}

export async function createShopifyCart(variantId: string, quantity: number) {
  return shopifyFetch<{
    cartCreate: {
      cart: { id: string; checkoutUrl: string; totalQuantity: number } | null
      userErrors: { field: string[] | null; message: string }[]
    }
  }>(cartCreateMutation, {
    input: {
      lines: [{ merchandiseId: variantId, quantity }],
    },
  })
}

export async function addShopifyCartLines(cartId: string, variantId: string, quantity: number) {
  return shopifyFetch<{
    cartLinesAdd: {
      cart: { id: string; checkoutUrl: string; totalQuantity: number } | null
      userErrors: { field: string[] | null; message: string }[]
    }
  }>(cartLinesAddMutation, {
    cartId,
    lines: [{ merchandiseId: variantId, quantity }],
  })
}
