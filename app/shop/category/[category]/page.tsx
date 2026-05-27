import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BorderBeam } from '@/components/ui/border-beam'
import { ProductCard } from '@/components/product/ProductCard'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { categoryDetails, getCollectionProducts, getElectronicsProducts, getPerfumeProducts } from '@/lib/products'

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

  if (categoryParam === 'perfumes') {
    const [oudProducts, amberProducts, dailyProducts, allPerfumes] = await Promise.all([
      getCollectionProducts('oud'),
      getCollectionProducts('amber'),
      getCollectionProducts('daily'),
      getPerfumeProducts(),
    ])

    const subCollections = [
      {
        handle: 'oud',
        name: 'Oud',
        copy: 'Deep, resinous fragrances built around oud, woods, and smoke.',
        count: oudProducts.length,
        image: '/images/collections/featured-oud.png',
      },
      {
        handle: 'amber',
        name: 'Amber',
        copy: 'Warm amber blends with sweet spice, musk, and vanilla.',
        count: amberProducts.length,
        image: '/images/collections/featured-amber.png',
      },
      {
        handle: 'daily',
        name: 'Daily',
        copy: 'Clean, balanced fragrances for everyday wear.',
        count: dailyProducts.length,
        image: '/images/collections/featured-daily.png',
      },
    ]

    const seenIds = new Set<string>()
    const mergedPerfumes = [...allPerfumes, ...oudProducts, ...amberProducts, ...dailyProducts].filter((p) => {
      if (seenIds.has(p.id)) return false
      seenIds.add(p.id)
      return true
    })

    return (
      <section className="min-h-[calc(100vh-120px)] bg-transparent px-3 py-6 text-jamm-dark sm:px-4 lg:py-8">
        <div className="mx-auto max-w-[1560px] py-6 sm:py-10 lg:py-16">
          <div className="mb-8 max-w-3xl rounded-lg border border-jamm-gold/15 bg-white/28 p-5 shadow-[0_16px_40px_rgba(12,11,9,0.04)] sm:mb-12 sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none">
            <SectionLabel>Category</SectionLabel>
            <h1 className="mt-3 font-sans text-3xl font-semibold leading-tight text-jamm-dark sm:text-5xl lg:text-6xl">
              {category.name}
            </h1>
            <p className="mt-4 font-sans text-base leading-relaxed text-jamm-muted sm:mt-5 sm:text-lg">
              {category.intro}
            </p>
          </div>

          <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:mb-14">
            {subCollections.map((col) => (
              <Link
                key={col.handle}
                href={`/shop/collection/${col.handle}`}
                className="group relative flex min-h-[220px] overflow-hidden rounded-[18px] border border-jamm-gold/35 bg-[#EDE8DC] shadow-[0_18px_45px_rgba(12,11,9,0.08)] transition-[border-color,box-shadow] duration-300 hover:border-jamm-gold/70 hover:shadow-[0_24px_70px_rgba(12,11,9,0.14)] sm:min-h-[260px]"
              >
                <Image
                  src={col.image}
                  alt={col.name}
                  fill
                  sizes="(min-width: 640px) 33vw, 100vw"
                  quality={75}
                  className="object-contain object-center p-6 transition-transform duration-500 group-hover:scale-[1.025]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.75)_0%,rgba(0,0,0,0.35)_50%,rgba(0,0,0,0.06)_100%)]" />
                <div className="absolute left-0 top-0 rounded-br-[14px] bg-jamm-gold px-4 py-2 font-sans text-xs font-semibold text-jamm-dark">
                  {col.name}
                </div>
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  {col.count > 0 && (
                    <p className="mb-1.5 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-jamm-gold">
                      {col.count} {col.count === 1 ? 'fragrance' : 'fragrances'}
                    </p>
                  )}
                  <h2 className="mb-1 font-sans text-xl font-semibold text-jamm-cream [text-shadow:0_2px_14px_rgba(0,0,0,0.6)] sm:text-2xl">
                    {col.name}
                  </h2>
                  <p className="font-sans text-sm leading-relaxed text-jamm-cream/80 [text-shadow:0_1px_8px_rgba(0,0,0,0.5)]">
                    {col.copy}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {mergedPerfumes.length > 0 ? (
            <>
              <p className="mb-5 font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-jamm-gold">
                All Fragrances
              </p>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 lg:gap-5">
                {mergedPerfumes.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          ) : (
            <div className="rounded-lg border border-jamm-gold/20 bg-[#EDE8DC] px-6 py-14 text-center shadow-[0_16px_40px_rgba(12,11,9,0.04)] sm:px-8 sm:py-16">
              <p className="font-sans text-xl font-semibold text-jamm-dark sm:text-2xl">Fragrances coming soon.</p>
              <p className="mx-auto mt-3 max-w-md font-sans text-sm leading-relaxed text-jamm-muted">
                This category will update automatically once products are assigned in Shopify.
              </p>
            </div>
          )}

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

  if (categoryParam === 'electronics') {
    const [electronicsProducts, smartwatchProducts, audioProducts] = await Promise.all([
      getElectronicsProducts(),
      getCollectionProducts('smartwatches'),
      getCollectionProducts('audio'),
    ])

    const subCollections = [
      {
        handle: 'smartwatches',
        name: 'Smartwatches',
        copy: 'Wearable tech for daily tracking and utility.',
        count: smartwatchProducts.length,
        image: smartwatchProducts[0]?.image ?? '/product-images/placeholders/electronics.webp',
      },
      {
        handle: 'audio',
        name: 'Audio',
        copy: 'Headphones and earbuds for everyday listening.',
        count: audioProducts.length,
        image: audioProducts[0]?.image ?? '/product-images/placeholders/audio.webp',
      },
    ]

    // Merge all sources so the grid always shows products regardless of which
    // Shopify collection/category path succeeds. Deduplicate by product ID.
    const seenIds = new Set<string>()
    const allElectronics = [...electronicsProducts, ...smartwatchProducts, ...audioProducts].filter((p) => {
      if (seenIds.has(p.id)) return false
      seenIds.add(p.id)
      return true
    })

    return (
      <section className="min-h-[calc(100vh-120px)] bg-transparent px-3 py-6 text-jamm-dark sm:px-4 lg:py-8">
        <div className="mx-auto max-w-[1560px] py-6 sm:py-10 lg:py-16">
          <div className="mb-8 max-w-3xl rounded-lg border border-jamm-gold/15 bg-white/28 p-5 shadow-[0_16px_40px_rgba(12,11,9,0.04)] sm:mb-12 sm:border-0 sm:bg-transparent sm:p-0 sm:shadow-none">
            <SectionLabel>Category</SectionLabel>
            <h1 className="mt-3 font-sans text-3xl font-semibold leading-tight text-jamm-dark sm:text-5xl lg:text-6xl">
              {category.name}
            </h1>
            <p className="mt-4 font-sans text-base leading-relaxed text-jamm-muted sm:mt-5 sm:text-lg">
              {category.intro}
            </p>
          </div>

          <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:mb-14">
            {subCollections.map((col) => (
              <Link
                key={col.handle}
                href={`/shop/collection/${col.handle}`}
                className="group relative flex min-h-[220px] overflow-hidden rounded-[18px] border border-jamm-gold/35 bg-[#EDE8DC] shadow-[0_18px_45px_rgba(12,11,9,0.08)] transition-[border-color,box-shadow] duration-300 hover:border-jamm-gold/70 hover:shadow-[0_24px_70px_rgba(12,11,9,0.14)] sm:min-h-[260px]"
              >
                <Image
                  src={col.image}
                  alt={col.name}
                  fill
                  sizes="(min-width: 640px) 50vw, 100vw"
                  quality={75}
                  className="object-contain object-center p-6 transition-transform duration-500 group-hover:scale-[1.025]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.75)_0%,rgba(0,0,0,0.35)_50%,rgba(0,0,0,0.06)_100%)]" />
                <div className="absolute left-0 top-0 rounded-br-[14px] bg-jamm-gold px-4 py-2 font-sans text-xs font-semibold text-jamm-dark">
                  {col.name}
                </div>
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  {col.count > 0 && (
                    <p className="mb-1.5 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-jamm-gold">
                      {col.count} {col.count === 1 ? 'product' : 'products'}
                    </p>
                  )}
                  <h2 className="mb-1 font-sans text-xl font-semibold text-jamm-cream [text-shadow:0_2px_14px_rgba(0,0,0,0.6)] sm:text-2xl">
                    {col.name}
                  </h2>
                  <p className="font-sans text-sm leading-relaxed text-jamm-cream/80 [text-shadow:0_1px_8px_rgba(0,0,0,0.5)]">
                    {col.copy}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {allElectronics.length > 0 ? (
            <>
              <p className="mb-5 font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-jamm-gold">
                All Electronics
              </p>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 lg:gap-5">
                {allElectronics.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          ) : (
            <div className="rounded-lg border border-jamm-gold/20 bg-[#EDE8DC] px-6 py-14 text-center shadow-[0_16px_40px_rgba(12,11,9,0.04)] sm:px-8 sm:py-16">
              <p className="font-sans text-xl font-semibold text-jamm-dark sm:text-2xl">Electronics coming soon.</p>
              <p className="mx-auto mt-3 max-w-md font-sans text-sm leading-relaxed text-jamm-muted">
                This category will update automatically once products are assigned in Shopify.
              </p>
            </div>
          )}

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
          <SectionLabel>Category</SectionLabel>
          <h1 className="mt-3 font-sans text-3xl font-semibold leading-tight text-jamm-dark sm:text-5xl lg:text-6xl">
            {category.name}
          </h1>
          <p className="mt-5 max-w-xl font-sans text-base leading-relaxed text-jamm-dark/60 sm:text-lg">
            {category.intro}
          </p>
          <p className="mt-3 max-w-xl font-sans text-sm leading-relaxed text-jamm-muted">
            {category.detail}
          </p>
          <p className="mt-4 max-w-xl font-sans text-xs leading-relaxed text-jamm-dark/45">
            Products in this category are fulfilled via print-on-demand. New items are added regularly. Contact us if you have a specific request.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="mailto:contact@jammtrade.com"
              className="inline-flex items-center justify-center rounded-full bg-jamm-dark px-8 py-4 font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-white transition-colors duration-300 hover:bg-jamm-gold hover:text-jamm-dark"
            >
              Contact for Requests
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
            quality={82}
            className="object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  )
}
