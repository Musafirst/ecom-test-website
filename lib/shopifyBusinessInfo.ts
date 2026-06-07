import { unstable_cache } from 'next/cache'
import { businessInfo as fallbackBusinessInfo } from '@/lib/businessInfo'

export type PublicBusinessInfo = {
  name: string
  supportEmail: string
  publicLocation: string
}

type ShopifyShopResponse = {
  shop?: {
    name?: string
    email?: string
    customer_email?: string
    address1?: string
    address2?: string
    city?: string
    province?: string
    province_code?: string
    zip?: string
    country?: string
    country_name?: string
  }
}

const shopifyApiVersion = '2026-04'

function clean(value?: string | null) {
  return value?.trim() || undefined
}

function getShopDomain() {
  return (process.env.SHOPIFY_STORE_DOMAIN || 'jamm-trade.myshopify.com')
    .replace(/^https?:\/\//, '')
    .replace(/\/$/, '')
}

function formatShopAddress(shop: NonNullable<ShopifyShopResponse['shop']>) {
  const cityLine = [
    clean(shop.city),
    clean(shop.province_code) ?? clean(shop.province),
    clean(shop.zip),
  ].filter(Boolean).join(', ').replace(/, ([^,]*)$/, ' $1')

  return [
    clean(shop.address1),
    clean(shop.address2),
    clean(cityLine),
    clean(shop.country_name) ?? clean(shop.country),
  ].filter(Boolean).join('\n')
}

async function fetchBusinessInfoFromShopify(): Promise<PublicBusinessInfo | null> {
  const token = process.env.SHOPIFY_ADMIN_TOKEN
  if (!token) return null

  const response = await fetch(`https://${getShopDomain()}/admin/api/${shopifyApiVersion}/shop.json`, {
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token,
    },
    next: {
      revalidate: 300,
      tags: ['shopify-business-info'],
    },
  })

  if (!response.ok) {
    throw new Error(`Shopify shop.json failed: ${response.status}`)
  }

  const data = await response.json() as ShopifyShopResponse
  const shop = data.shop
  if (!shop) return null

  return {
    name: fallbackBusinessInfo.name,
    supportEmail: clean(shop.customer_email) ?? clean(shop.email) ?? fallbackBusinessInfo.supportEmail,
    publicLocation: formatShopAddress(shop) || fallbackBusinessInfo.publicLocation,
  }
}

export const getShopifyBusinessInfo = unstable_cache(
  async () => {
    try {
      return await fetchBusinessInfoFromShopify() ?? fallbackBusinessInfo
    } catch {
      return fallbackBusinessInfo
    }
  },
  ['shopify-business-info'],
  {
    revalidate: 300,
    tags: ['shopify-business-info'],
  },
)
