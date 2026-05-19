import type { Metadata } from 'next'
import { HeroSection } from '@/components/shop/HeroSection'
import { ShopShortcuts } from '@/components/shop/ShopShortcuts'
import { FeaturedProducts } from '@/components/shop/FeaturedProducts'
import { CollectionGrid } from '@/components/shop/CollectionGrid'
import { SecondaryCategories } from '@/components/shop/SecondaryCategories'
import { TrustBar } from '@/components/shop/TrustBar'
import { getCollectionDetails, getElectronicsProducts, getFeaturedProducts } from '@/lib/products'

export const metadata: Metadata = {
  title: 'Luxury Fragrances, Electronics & Essentials',
  description: 'Rare fragrances, clothing, and electronics. Curated for those who know the difference.',
}

export default async function ShopPage() {
  const [featuredProducts, collectionDetails, electronicsProducts] = await Promise.all([
    getFeaturedProducts(),
    getCollectionDetails(),
    getElectronicsProducts(),
  ])

  return (
    <>
      <HeroSection />
      <ShopShortcuts
        collectionCounts={{
          oud: collectionDetails.oud.count,
          amber: collectionDetails.amber.count,
          daily: collectionDetails.daily.count,
        }}
      />
      <FeaturedProducts products={featuredProducts} />
      <CollectionGrid
        counts={{
          oud: collectionDetails.oud.count,
          amber: collectionDetails.amber.count,
          daily: collectionDetails.daily.count,
        }}
      />
      <SecondaryCategories electronicsProducts={electronicsProducts} />
      <TrustBar />
    </>
  )
}
