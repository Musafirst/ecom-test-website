import { NextResponse } from 'next/server'
import { getShopifyBusinessInfo } from '@/lib/shopifyBusinessInfo'

export async function GET() {
  const businessInfo = await getShopifyBusinessInfo()

  return NextResponse.json(businessInfo, {
    headers: {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=86400',
    },
  })
}
