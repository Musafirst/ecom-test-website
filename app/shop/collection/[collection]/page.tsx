import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CollectionProductGrid } from '@/components/product/CollectionProductGrid'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { collectionDetails, collectionProducts } from '@/lib/products'

interface CollectionPageProps {
  params: Promise<{
    collection: string
  }>
}

type CollectionKey = keyof typeof collectionProducts

function isCollectionKey(value: string): value is CollectionKey {
  return value in collectionProducts
}

export function generateStaticParams() {
  return Object.keys(collectionProducts).map((collection) => ({ collection }))
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { collection: collectionParam } = await params

  if (!isCollectionKey(collectionParam)) {
    return {
      title: 'Collection not found',
    }
  }

  const collection = collectionDetails[collectionParam]

  return {
    title: `${collection.name} Collection`,
    description: collection.intro,
  }
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { collection: collectionParam } = await params

  if (!isCollectionKey(collectionParam)) {
    notFound()
  }

  const collection = collectionDetails[collectionParam]
  const products = collectionProducts[collectionParam]

  return (
    <section className="min-h-[calc(100vh-120px)] bg-transparent px-3 py-6 text-jamm-dark sm:px-4 lg:py-8">
      <div className="mx-auto max-w-[1560px] py-6 sm:py-10 lg:py-16">
        <div className="mb-8 max-w-3xl rounded-lg border border-jamm-gold/15 bg-white/28 p-5 shadow-[0_16px_40px_rgba(12,11,9,0.04)] sm:mb-12 sm:p-0 sm:shadow-none sm:border-0 sm:bg-transparent">
          <SectionLabel>Collection</SectionLabel>
          <h1 className="mt-3 font-sans text-3xl font-semibold leading-tight text-jamm-dark sm:text-5xl lg:text-6xl">
            {collection.name}
          </h1>
          <p className="mt-4 font-sans text-base leading-relaxed text-jamm-muted sm:mt-5 sm:text-lg">
            {collection.intro}
          </p>
          <p className="mt-3 font-sans text-sm leading-relaxed text-jamm-muted/80">
            {collection.note}
          </p>
        </div>

        <CollectionProductGrid products={products} />

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
