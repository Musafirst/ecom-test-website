import { allProducts as fallbackProducts } from '@/data/products'
import { cache } from 'react'
import {
  cartCreateMutation,
  cartCreateFromLinesMutation,
  cartLinesAddMutation,
  collectionByHandleQuery,
  collectionsQuery,
  productByHandleQuery,
  productsQuery,
  shopPoliciesQuery,
} from '@/lib/shopifyQueries'
import { site } from '@/lib/site'
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
      price: ShopifyMoney
      compareAtPrice: ShopifyMoney | null
      sku?: string | null
      barcode?: string | null
    }>[]
  }
  collections: {
    edges: Edge<{
      handle: string
      title: string
    }>[]
  }
}

type PublicShopifyVariant = {
  id: number
  title: string
  available: boolean
  price: number
  compare_at_price: number | null
  sku?: string | null
  barcode?: string | null
  featured_image?: {
    src?: string
    alt?: string | null
  } | null
}

type PublicShopifyProduct = {
  id: number
  handle: string
  title: string
  description?: string
  vendor?: string
  type?: string | null
  product_type?: string | null
  tags?: string[]
  available?: boolean
  price?: number
  compare_at_price?: number | null
  variants?: PublicShopifyVariant[]
  images?: string[]
  featured_image?: string | null
  options?: {
    name: string
    values: string[]
  }[]
  media?: {
    alt?: string | null
    src?: string
    preview_image?: {
      src?: string
    }
  }[]
}

export type ShopifyCollection = {
  id: string
  handle: string
  title: string
  description: string
  image?: ShopifyImage | null
  products?: { edges: Edge<ShopifyProduct>[] }
}

const collectionHandles = ['oud', 'amber', 'daily', 'electronics', 'audio', 'smartwatches', 'clothing'] as const
const collectionHandleSet = new Set<string>(collectionHandles)
const loggedShopifyErrors = new Set<string>()
const allowDemoFallback = process.env.NODE_ENV !== 'production'
const storefrontApiVersion = '2026-04'

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
  return `https://${normalizedDomain}/api/${storefrontApiVersion}/graphql.json`
}

export function isShopifyConfigured() {
  return Boolean(getStorefrontUrl() && process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN)
}

// Server-side Storefront API fetch helper. It returns null instead of throwing
// so development callers can fall back to local demo data during setup or API outages.
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

function normalizeShopifyAssetUrl(url?: string | null) {
  if (!url) return undefined
  if (url.startsWith('//')) return `https:${url}`
  return url
}

function stripHtml(value?: string) {
  return (value ?? '')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/p>/gi, ' ')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim()
}

// Shopify products can be categorized by collection, product type, or tags.
// If a product lands in the wrong section, check those Shopify fields first.
function getProductCollection(product: ShopifyProduct): ProductCollection | undefined {
  const handles = product.collections.edges.map(({ node }) => normalizeHandle(node.handle))
  const titles = product.collections.edges.map(({ node }) => normalizeHandle(node.title))
  const tags = product.tags.map(normalizeHandle)
  const candidates = [...handles, ...titles, ...tags, normalizeHandle(product.productType)]

  // Shopify collection handles often have a suffix (e.g. "oud-collection" for our "oud" key).
  // Match if a candidate equals the key or starts/ends with it as a hyphen-separated segment.
  return collectionHandles.find((handle) =>
    candidates.some((c) => c === handle || c.startsWith(`${handle}-`) || c.endsWith(`-${handle}`)),
  )
}

function getCategory(product: ShopifyProduct, collection?: ProductCollection): ProductCategory {
  const values = [product.productType, product.vendor, ...product.tags, collection ?? '', product.handle, product.title].map(normalizeHandle)

  if (values.some((value) => value.includes('electronics') || value.includes('audio') || value.includes('watch'))) {
    return 'electronics'
  }

  if (values.some((value) => value.includes('clothing') || value.includes('apparel') || value.includes('hoodie') || value.includes('tee') || value.includes('shirt'))) {
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

// Shopify product images often have supplier-sourced alt texts that contain
// "Wholesale" prefixes (e.g. "Oudlash - Wholesale Perfume/Eau de Toilette - …").
// Those strings would appear in rendered HTML alt attributes and trigger GMC
// Misrepresentation flags, so we replace them with the product title instead.
function sanitizeAltText(altText: string | null, productTitle: string): string {
  if (!altText) return productTitle
  if (/wholesale/i.test(altText)) return productTitle
  return altText
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
    sku: selectedVariant?.sku || undefined,
    gtin: selectedVariant?.barcode || undefined,
    availableForSale: selectedVariant?.availableForSale ?? product.availableForSale,
    quantityAvailable: null,
    collection,
    category,
    categoryLabel: getCategoryLabel(category, collection, subcategory),
    subcategory,
    tags: product.tags,
    description: product.description,
    brand: product.vendor,
    image: featuredImage?.url ?? '/product-images/placeholders/perfume.webp',
    imageAlt: sanitizeAltText(featuredImage?.altText ?? null, product.title),
    galleryImages: galleryImages.length > 0 ? galleryImages : featuredImage ? [featuredImage.url] : undefined,
  }
}

function mapPublicShopifyProduct(product: PublicShopifyProduct): JammProduct {
  const selectedVariant = product.variants?.find((variant) => variant.available) ?? product.variants?.[0]
  const type = product.type ?? product.product_type ?? ''
  const tags = product.tags ?? []
  const values = [type, product.vendor ?? '', ...tags, product.handle, product.title].map(normalizeHandle)
  const category: ProductCategory = values.some((value) =>
    value.includes('clothing') || value.includes('apparel') || value.includes('hoodie') || value.includes('tee') || value.includes('shirt')
  )
    ? 'clothing'
    : values.some((value) => value.includes('electronics') || value.includes('audio') || value.includes('watch'))
      ? 'electronics'
      : 'perfume'
  const collection: ProductCollection | undefined = category === 'clothing' ? 'clothing' : undefined
  const subcategory: ProductSubcategory | undefined =
    category === 'clothing'
      ? 'apparel'
      : category === 'electronics' && values.some((value) => value.includes('watch'))
        ? 'smartwatches'
        : category === 'electronics'
          ? 'headphones-audio'
          : 'fragrance'
  const galleryImages = (product.images ?? [])
    .map(normalizeShopifyAssetUrl)
    .filter((url): url is string => Boolean(url))
  const featuredImage =
    normalizeShopifyAssetUrl(selectedVariant?.featured_image?.src) ??
    normalizeShopifyAssetUrl(product.featured_image) ??
    galleryImages[0]
  const colorOptions = product.options?.find((option) => normalizeHandle(option.name) === 'color')?.values
  const price = ((selectedVariant?.price ?? product.price ?? 0) / 100)
  const compareAtPrice = selectedVariant?.compare_at_price ?? product.compare_at_price

  return {
    id: `gid://shopify/Product/${product.id}`,
    handle: product.handle,
    title: product.title,
    price,
    compareAtPrice: compareAtPrice && compareAtPrice / 100 > price ? compareAtPrice / 100 : undefined,
    currencyCode: 'USD',
    variantId: selectedVariant ? `gid://shopify/ProductVariant/${selectedVariant.id}` : undefined,
    sku: selectedVariant?.sku || undefined,
    gtin: selectedVariant?.barcode || undefined,
    availableForSale: selectedVariant?.available ?? product.available,
    quantityAvailable: null,
    collection,
    category,
    categoryLabel: getCategoryLabel(category, collection, subcategory),
    subcategory,
    tags,
    description: stripHtml(product.description),
    brand: product.vendor,
    image: featuredImage ?? '/product-images/placeholders/perfume.webp',
    imageAlt: sanitizeAltText(selectedVariant?.featured_image?.alt ?? product.media?.[0]?.alt ?? null, product.title),
    galleryImages: galleryImages.length > 0 ? galleryImages : featuredImage ? [featuredImage] : undefined,
    details: colorOptions ?? tags.map((tag) => tag.replace(/-/g, ' ')),
  }
}

async function getPublicShopifyProductByHandle(handle: string): Promise<JammProduct | undefined> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN?.replace(/^https?:\/\//, '').replace(/\/$/, '')

  if (!domain) return undefined

  try {
    const response = await fetch(`https://${domain}/products/${encodeURIComponent(handle)}.js`, {
      next: { revalidate: 300 },
    })

    if (!response.ok) return undefined

    const product = (await response.json()) as PublicShopifyProduct
    return product?.handle ? mapPublicShopifyProduct(product) : undefined
  } catch (error) {
    logShopifyErrorOnce('public-product-request-failed', 'Public Shopify product fallback failed:', error)
    return undefined
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
export const getShopifyProducts = cache(async (first = 60): Promise<JammProduct[]> => {
  const data = await shopifyFetch<{ products: { edges: Edge<ShopifyProduct>[] } }>(productsQuery, { first })
  const products = data?.products.edges.map(({ node }) => mapShopifyProduct(node)) ?? []

  return products.length > 0 ? products : allowDemoFallback ? fallbackProducts : []
})

export const getShopifyProductByHandle = cache(async (handle: string): Promise<JammProduct | undefined> => {
  const data = await shopifyFetch<{ product: ShopifyProduct | null }>(productByHandleQuery, { handle })
  const product = data?.product ? mapShopifyProduct(data.product) : undefined
  const listedProduct = product
    ? undefined
    : (await getShopifyProducts()).find((candidate) => candidate.handle === handle)

  return product
    ?? listedProduct
    ?? await getPublicShopifyProductByHandle(handle)
    ?? (allowDemoFallback ? fallbackProducts.find((fallbackProduct) => fallbackProduct.handle === handle) : undefined)
})

export const getShopifyCollections = cache(async (): Promise<ShopifyCollection[]> => {
  const data = await shopifyFetch<{ collections: { edges: Edge<ShopifyCollection>[] } }>(collectionsQuery)

  return data?.collections.edges.map(({ node }) => node) ?? []
})

export const getShopifyCollectionProducts = cache(async (handle: string, first = 60): Promise<JammProduct[]> => {
  const normalizedHandle = normalizeHandle(handle)

  // Try multiple Shopify collection handle variants.
  const candidateHandles = [
    normalizedHandle,
    `${normalizedHandle}-collection`,
    ...(normalizedHandle === 'clothing' ? ['apparel', 'jamm-clothing'] : []),
  ]

  let data: { collection: ShopifyCollection | null } | null = null
  for (const h of candidateHandles) {
    data = await shopifyFetch<{ collection: ShopifyCollection | null }>(collectionByHandleQuery, { handle: h, first })
    if (data?.collection) break
  }

  const products = data?.collection?.products?.edges.map(({ node }) => mapShopifyProduct(node)) ?? []

  if (products.length > 0) return products

  const allProducts = await getShopifyProducts(first)
  const filteredProducts = allProducts.filter((product) => {
    if (normalizedHandle === 'audio') return product.subcategory === 'headphones-audio'
    if (normalizedHandle === 'smartwatches') return product.subcategory === 'smartwatches'
    if (normalizedHandle === 'electronics') return product.category === 'electronics'
    if (normalizedHandle === 'clothing') {
      const h = normalizeHandle(product.handle)
      return (
        product.category === 'clothing' ||
        product.collection === 'clothing' ||
        h.includes('hoodie') || h.includes('apparel') || h.includes('tee') || h.includes('shirt')
      )
    }
    return product.collection === normalizedHandle
  })

  if (data?.collection) return filteredProducts

  // For clothing, also try fetching known product handles directly as a guaranteed fallback.
  if (normalizedHandle === 'clothing' && filteredProducts.length === 0) {
    const knownHandles = ['jamm-trade-heritage-hoodie']
    const direct = (await Promise.all(knownHandles.map(h => getShopifyProductByHandle(h)))).filter(Boolean) as JammProduct[]
    if (direct.length > 0) return direct
  }

  return filteredProducts.length > 0 ? filteredProducts : allowDemoFallback ? fallbackByCollection(normalizedHandle) : []
})

export const getCollectionCounts = cache(async () => {
  const counts = await Promise.all(
    collectionHandles.map(async (handle) => [handle, (await getShopifyCollectionProducts(handle)).length] as const),
  )

  return Object.fromEntries(counts) as Record<(typeof collectionHandles)[number], number>
})

export function isSupportedCollectionHandle(handle: string) {
  return collectionHandleSet.has(normalizeHandle(handle))
}

export async function createShopifyCart(variantId: string, quantity: number) {
  return createShopifyCartFromLines([{ variantId, quantity }])
}

export async function createShopifyCartFromLines(lines: { variantId: string; quantity: number }[]) {
  return shopifyFetch<{
    cartCreate: {
      cart: { id: string; checkoutUrl: string; totalQuantity: number } | null
      userErrors: { field: string[] | null; message: string }[]
    }
  }>(lines.length === 1 ? cartCreateMutation : cartCreateFromLinesMutation, {
    input: {
      lines: lines.map((line) => ({ merchandiseId: line.variantId, quantity: line.quantity })),
    },
  })
}

export type ShopPolicy = {
  title: string
  body: string
  url: string
}

export type ShopPolicies = {
  privacyPolicy: ShopPolicy | null
  refundPolicy: ShopPolicy | null
  shippingPolicy: ShopPolicy | null
  termsOfService: ShopPolicy | null
}

function normalizeCustomerPolicy(policy: ShopPolicy | null) {
  if (!policy) return null

  return {
    ...policy,
    body: policy.body
      .replace(/mailto:[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, `mailto:${site.supportEmail}`)
      .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, site.supportEmail),
  }
}

export const getShopifyPolicies = cache(async (): Promise<ShopPolicies | null> => {
  const data = await shopifyFetch<{ shop: ShopPolicies }>(shopPoliciesQuery)
  if (!data?.shop) return null

  return {
    privacyPolicy: normalizeCustomerPolicy(data.shop.privacyPolicy),
    refundPolicy: normalizeCustomerPolicy(data.shop.refundPolicy),
    shippingPolicy: normalizeCustomerPolicy(data.shop.shippingPolicy),
    termsOfService: normalizeCustomerPolicy(data.shop.termsOfService),
  }
})

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
