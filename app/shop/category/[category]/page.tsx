import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BorderBeam } from '@/components/ui/border-beam'
import { ProductCard } from '@/components/product/ProductCard'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { categoryDetails, electronicsProducts } from '@/lib/products'

interface CategoryPageProps {
  params: Promise<{
    category: string
  }>
}

type CategoryKey = keyof typeof categoryDetails

function isCategoryKey(value: string): value is CategoryKey {
  return value in categoryDetails
}

export function generateStaticParams() {
  return Object.keys(categoryDetails).map((category) => ({ category }))
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: categoryParam } = await params

  if (!isCategoryKey(categoryParam)) {
    return {
      title: 'Category not found',
    }
  }

  const category = categoryDetails[categoryParam]

  return {
    title: category.name,
    description: category.intro,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categoryParam } = await params

  if (!isCategoryKey(categoryParam)) {
    notFound()
  }

  const category = categoryDetails[categoryParam]

  if (categoryParam === 'electronics') {
    return (
      <section className="min-h-[calc(100vh-120px)] bg-transparent px-3 py-6 text-jamm-dark sm:px-4 lg:py-8">
        <div className="mx-auto max-w-[1560px] py-6 sm:py-10 lg:py-16">
          <div className="mb-8 max-w-3xl rounded-lg border border-jamm-gold/15 bg-white/28 p-5 shadow-[0_16px_40px_rgba(12,11,9,0.04)] sm:mb-12 sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none">
            <SectionLabel>Secondary Category</SectionLabel>
            <h1 className="mt-3 font-sans text-3xl font-semibold leading-tight text-jamm-dark sm:text-5xl lg:text-6xl">
              {category.name}
            </h1>
            <p className="mt-4 font-sans text-base leading-relaxed text-jamm-muted sm:mt-5 sm:text-lg">
              {category.intro}
            </p>
            <p className="mt-3 font-sans text-sm leading-relaxed text-jamm-muted/80">
              {category.detail}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 lg:gap-5">
            {electronicsProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <Link
            href="/shop"
            className="mt-10 inline-flex items-center gap-3 font-sans text-[10px] uppercase tracking-[0.22em] text-jamm-gold transition-colors duration-200 hover:text-jamm-gold-muted"
          >
            <span className="h-px w-6 bg-current" />
            Back to shop
          </Link>
        </div>
      </section>
    )
  }

  const image =
    categoryParam === 'clothing'
      ? '/product-images/jamm-hoodie.webp'
      : 'https://images.pexels.com/photos/33481395/pexels-photo-33481395.jpeg?auto=compress&cs=tinysrgb&w=1200'

  return (
    <section className="min-h-[calc(100vh-120px)] bg-transparent px-3 py-6 text-jamm-dark sm:px-4 lg:py-10">
      <div className="mx-auto grid max-w-[1560px] grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center">
        <div className="flex flex-col justify-center">
          <SectionLabel>Coming Soon</SectionLabel>
          <h1 className="mt-3 font-sans text-3xl font-semibold leading-tight text-jamm-dark sm:text-5xl lg:text-6xl">
            {category.name}
          </h1>
          <p className="mt-5 max-w-xl font-sans text-base leading-relaxed text-jamm-dark/60 sm:text-lg">
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

        <div className="relative min-h-[320px] overflow-hidden rounded-[20px] border border-jamm-gold/35 bg-[#f4f4f2] shadow-[0_24px_70px_rgba(12,11,9,0.08)] sm:min-h-[500px] sm:rounded-[24px] lg:min-h-[620px]">
          <BorderBeam size={520} duration={13} borderWidth={2.5} colorFrom="#C4973A" colorTo="#F8E7A6" />
          <Image
            src={image}
            alt={category.name}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            quality={90}
            className="object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  )
}
