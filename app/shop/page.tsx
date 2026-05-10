import type { Metadata } from 'next'
import { HeroSection } from '@/components/shop/HeroSection'
import { ShopShortcuts } from '@/components/shop/ShopShortcuts'
import { FeaturedProducts } from '@/components/shop/FeaturedProducts'
import { CollectionGrid } from '@/components/shop/CollectionGrid'
import { SecondaryCategories } from '@/components/shop/SecondaryCategories'
import { TrustBar } from '@/components/shop/TrustBar'

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Rare fragrances, clothing, and electronics. Curated for those who know the difference.',
}

export default function ShopPage() {
  return (
    <>
      <HeroSection />
      <ShopShortcuts />
      <FeaturedProducts />
      <CollectionGrid />
      <SecondaryCategories />
      <TrustBar />
    </>
  )
}
