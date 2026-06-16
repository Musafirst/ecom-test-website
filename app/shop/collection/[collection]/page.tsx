import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CollectionProductGrid } from '@/components/product/CollectionProductGrid'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { collectionDetails, getCollectionDetails, getCollectionProducts, isSupportedCollectionHandle } from '@/lib/products'

interface CollectionPageProps {
  params: Promise<{
    collection: string
  }>
}

type CollectionKey = keyof typeof collectionDetails

function isCollectionKey(value: string): value is CollectionKey {
  return value in collectionDetails || isSupportedCollectionHandle(value)
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export function generateStaticParams() {
  return Object.keys(collectionDetails).map((collection) => ({ collection }))
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const { collection: collectionParam } = await params

  if (!isCollectionKey(collectionParam)) {
    return {
      title: 'Collection not found',
    }
  }

  const dynamicCollectionDetails = await getCollectionDetails()
  const collection = dynamicCollectionDetails[collectionParam]

  return {
    title: `${collection.name} Collection`,
    description: collection.intro,
    alternates: {
      canonical: `/shop/collection/${collectionParam}`,
    },
  }
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { collection: collectionParam } = await params

  if (!isCollectionKey(collectionParam)) {
    notFound()
  }

  const dynamicCollectionDetails = await getCollectionDetails()
  const collection = dynamicCollectionDetails[collectionParam]
  const products = await getCollectionProducts(collectionParam)
  const emptyMessage = 'Products are temporarily unavailable.'

  return (
    <section className="bg-transparent px-3 py-5 text-jamm-dark sm:px-4 sm:py-7 lg:py-10">
      <div className="mx-auto max-w-[1320px] py-3 sm:py-5 lg:py-7">
        <div className="mb-7 max-w-3xl rounded-lg border border-jamm-gold/20 bg-[#FAF7F2]/94 p-5 shadow-[0_18px_48px_rgba(12,11,9,0.07)] sm:mb-9 sm:p-7">
          <SectionLabel>
            {collectionParam === 'smartwatches' || collectionParam === 'audio'
              ? 'Electronics'
              : collectionParam === 'oud' || collectionParam === 'amber' || collectionParam === 'daily'
                ? 'Perfumes'
                : 'Collection'}
          </SectionLabel>
          <h1 className="mt-3 font-sans text-3xl font-semibold leading-tight text-jamm-dark sm:text-5xl lg:text-6xl">
            {collection.name}
          </h1>
          <p className="mt-4 font-sans text-base leading-relaxed text-jamm-dark/82 sm:mt-5 sm:text-lg">
            {collection.intro}
          </p>
          <p className="mt-3 font-sans text-sm leading-relaxed text-jamm-dark/68">
            {collection.note}
          </p>
        </div>

        {products.length > 0 ? (
          <CollectionProductGrid products={products} />
        ) : (
          <div className="rounded-lg border border-jamm-gold/20 bg-[#EDE8DC] px-6 py-14 text-center shadow-[0_16px_40px_rgba(12,11,9,0.04)] sm:px-8 sm:py-16">
            <p className="font-sans text-xl font-semibold text-jamm-dark sm:text-2xl">
              {emptyMessage}
            </p>
            <p className="mx-auto mt-3 max-w-md font-sans text-sm leading-relaxed text-jamm-muted">
              Contact Jamm Trade for current availability or explore another collection.
            </p>
          </div>
        )}

        <Link
          href={
            collectionParam === 'smartwatches' || collectionParam === 'audio'
              ? '/shop/category/electronics'
              : collectionParam === 'oud' || collectionParam === 'amber' || collectionParam === 'daily'
                ? '/shop/category/perfumes'
                : '/shop#collections'
          }
          className="mt-10 inline-flex items-center gap-3 font-sans text-[10px] uppercase tracking-[0.22em] text-jamm-gold transition-colors duration-200 hover:text-jamm-gold-muted"
        >
          <span className="h-px w-6 bg-current" />
          {collectionParam === 'smartwatches' || collectionParam === 'audio'
            ? 'Back to Electronics'
            : collectionParam === 'oud' || collectionParam === 'amber' || collectionParam === 'daily'
              ? 'Back to Perfumes'
              : 'Back to collections'}
        </Link>
      </div>
    </section>
  )
}
