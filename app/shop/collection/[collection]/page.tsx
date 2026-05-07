import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ProductCard } from '@/components/product/ProductCard'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { collectionDetails, collectionProducts } from '@/lib/products'

interface CollectionPageProps {
  params: {
    collection: string
  }
}

type CollectionKey = keyof typeof collectionProducts

function isCollectionKey(value: string): value is CollectionKey {
  return value in collectionProducts
}

export function generateStaticParams() {
  return Object.keys(collectionProducts).map((collection) => ({ collection }))
}

export function generateMetadata({ params }: CollectionPageProps): Metadata {
  if (!isCollectionKey(params.collection)) {
    return {
      title: 'Collection not found',
    }
  }

  const collection = collectionDetails[params.collection]

  return {
    title: `${collection.name} Collection`,
    description: collection.intro,
  }
}

export default function CollectionPage({ params }: CollectionPageProps) {
  if (!isCollectionKey(params.collection)) {
    notFound()
  }

  const collection = collectionDetails[params.collection]
  const products = collectionProducts[params.collection]

  return (
    <section className="min-h-[calc(100vh-120px)] bg-transparent px-3 py-8 text-jamm-dark sm:px-4">
      <div className="mx-auto max-w-[1560px] py-10 lg:py-16">
        <div className="mb-12 max-w-3xl">
          <SectionLabel>Collection</SectionLabel>
          <h1 className="mt-3 font-sans text-3xl font-medium tracking-[-0.03em] text-jamm-dark sm:text-5xl lg:text-7xl">
            {collection.name}
          </h1>
          <p className="mt-5 font-sans text-lg leading-relaxed text-jamm-muted">
            {collection.intro}
          </p>
          <p className="mt-3 font-sans text-sm leading-relaxed text-jamm-muted/80">
            {collection.note}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <Link
          href="/shop#collections"
          className="mt-10 inline-flex items-center gap-3 font-sans text-[10px] uppercase tracking-[0.22em] text-jamm-gold transition-colors duration-200 hover:text-jamm-gold-muted"
        >
          <span className="h-px w-6 bg-current" />
          Back to collections
        </Link>
      </div>
    </section>
  )
}
