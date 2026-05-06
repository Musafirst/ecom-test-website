import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BorderBeam } from '@/components/ui/border-beam'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { categoryDetails } from '@/lib/products'

interface CategoryPageProps {
  params: {
    category: string
  }
}

type CategoryKey = keyof typeof categoryDetails

function isCategoryKey(value: string): value is CategoryKey {
  return value in categoryDetails
}

export function generateStaticParams() {
  return Object.keys(categoryDetails).map((category) => ({ category }))
}

export function generateMetadata({ params }: CategoryPageProps): Metadata {
  if (!isCategoryKey(params.category)) {
    return {
      title: 'Category not found',
    }
  }

  const category = categoryDetails[params.category]

  return {
    title: category.name,
    description: category.intro,
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  if (!isCategoryKey(params.category)) {
    notFound()
  }

  const category = categoryDetails[params.category]
  const image =
    params.category === 'clothing'
      ? '/product-images/jamm-hoodie.png'
      : 'https://images.pexels.com/photos/33481395/pexels-photo-33481395.jpeg?auto=compress&cs=tinysrgb&w=1200'

  return (
    <section className="min-h-[calc(100vh-120px)] bg-white px-3 py-8 text-jamm-dark sm:px-4">
      <div className="mx-auto grid max-w-[1560px] grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="flex flex-col justify-center">
          <SectionLabel>Coming Soon</SectionLabel>
          <h1 className="mt-3 font-sans text-3xl font-medium leading-tight tracking-[-0.03em] text-jamm-dark sm:text-5xl lg:text-7xl">
            {category.name}
          </h1>
          <p className="mt-6 max-w-xl font-sans text-lg leading-relaxed text-jamm-dark/60">
            {category.intro}
          </p>
          <p className="mt-3 max-w-xl font-sans text-sm leading-relaxed text-jamm-muted">
            {category.detail}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="mailto:contact@jammtrade.com"
              className="inline-flex items-center justify-center rounded-full bg-jamm-dark px-8 py-4 font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-white transition-colors duration-300 hover:bg-jamm-gold hover:text-jamm-dark"
            >
              Get Notified
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center rounded-full border border-black/15 px-8 py-4 font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-jamm-dark transition-colors duration-300 hover:border-jamm-gold hover:text-jamm-gold"
            >
              Shop Fragrance
            </Link>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[24px] border border-jamm-gold/35 bg-[#f4f4f2]">
          <BorderBeam size={520} duration={13} borderWidth={2.5} colorFrom="#C4973A" colorTo="#F8E7A6" />
          <img src={image} alt={category.name} className="h-full w-full object-cover" />
        </div>
      </div>
    </section>
  )
}
