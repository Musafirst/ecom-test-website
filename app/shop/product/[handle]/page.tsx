import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ProductBadge } from '@/components/product/ProductBadge'
import { ProductDetailGallery } from '@/components/product/ProductDetailGallery'
import { ProductPurchasePanel } from '@/components/product/ProductPurchasePanel'
import { PriceDisplay } from '@/components/product/PriceDisplay'
import { allProducts, getProductByHandle } from '@/lib/products'

interface ProductPageProps {
  params: Promise<{
    handle: string
  }>
}

function uniqueImages(images: string[]) {
  return images.filter((image, index) => Boolean(image) && images.indexOf(image) === index)
}

function getProductGalleryImages(product: NonNullable<ReturnType<typeof getProductByHandle>>) {
  if (product.galleryImages && product.galleryImages.length >= 5) {
    return uniqueImages(product.galleryImages).slice(0, 5)
  }

  if (product.collection === 'oud') {
    return uniqueImages([
      product.image,
      'https://fimgs.net/mdimg/perfume-thumbs/375x500.79940.jpg',
      'https://fimgs.net/mdimg/perfume-thumbs/375x500.68283.jpg',
      'https://fimgs.net/mdimg/perfume-thumbs/375x500.25807.jpg',
      'https://fimgs.net/mdimg/perfume-thumbs/375x500.88825.jpg',
    ]).slice(0, 5)
  }

  if (product.collection === 'amber') {
    return uniqueImages([
      product.image,
      'https://fimgs.net/mdimg/perfume-thumbs/375x500.75805.jpg',
      'https://fimgs.net/mdimg/perfume-thumbs/375x500.51816.jpg',
      'https://fimgs.net/mdimg/perfume-thumbs/375x500.65414.jpg',
      'https://fimgs.net/mdimg/perfume-thumbs/375x500.72821.jpg',
    ]).slice(0, 5)
  }

  if (product.collection === 'daily') {
    return uniqueImages([
      product.image,
      'https://fimgs.net/mdimg/perfume-thumbs/375x500.78611.jpg',
      'https://fimgs.net/mdimg/perfume-thumbs/375x500.70465.jpg',
      'https://fimgs.net/mdimg/perfume-thumbs/375x500.66011.jpg',
      'https://fimgs.net/mdimg/perfume-thumbs/375x500.34696.jpg',
    ]).slice(0, 5)
  }

  if (product.subcategory === 'smartwatches') {
    return uniqueImages([
      product.image,
      '/product-images/electronics/samsung-galaxy-watch7.webp',
      '/product-images/electronics/samsung-galaxy-watch8.webp',
      '/images/hero-electronics.jpg',
      '/product-images/placeholders/smartwatch.webp',
    ]).slice(0, 5)
  }

  if (product.category === 'electronics') {
    return uniqueImages([
      product.image,
      '/product-images/electronics/sony-wh-1000xm5.webp',
      '/product-images/electronics/jbl-tune-770nc.webp',
      '/product-images/electronics/samsung-galaxy-buds3-pro.webp',
      '/product-images/placeholders/audio.webp',
    ]).slice(0, 5)
  }

  return uniqueImages([
    product.image,
    '/product-images/jamm-hoodie.webp',
    '/product-images/jamm-hoodie.png',
    '/images/hero-clothing.jpg',
    '/images/hero-clothing.webp',
  ]).slice(0, 5)
}

export function generateStaticParams() {
  return allProducts.map((product) => ({ handle: product.handle }))
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { handle } = await params
  const product = getProductByHandle(handle)

  if (!product) {
    return {
      title: 'Product not found',
    }
  }

  return {
    title: product.title,
    description: product.description,
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle } = await params
  const product = getProductByHandle(handle)

  if (!product) {
    notFound()
  }

  const backHref = product.collection ? `/shop/collection/${product.collection}` : '/shop/category/electronics'
  const backLabel = product.collection ? `${product.categoryLabel} collection` : product.categoryLabel
  const isElectronics = product.category === 'electronics'
  const isPerfume = product.category === 'perfume'
  const electronicsImageClassName =
    product.handle === 'sony-wh-1000xm5'
      ? 'object-contain p-5 mix-blend-multiply sm:p-7'
      : product.subcategory === 'smartwatches'
        ? 'object-contain p-3 mix-blend-multiply sm:p-4'
        : 'object-contain p-5 mix-blend-multiply sm:p-7'
  const perfumeImageClassName = 'object-contain p-6 mix-blend-multiply contrast-[1.04] drop-shadow-[0_28px_34px_rgba(12,11,9,0.26)] sm:p-8'
  const imageClassName = isElectronics ? electronicsImageClassName : isPerfume ? perfumeImageClassName : 'object-cover'
  const galleryImages = getProductGalleryImages(product)
  const scentDetails = product.collection === 'oud'
    ? ['oud woods', 'amber warmth', 'evening wear', 'strong presence']
    : product.collection === 'amber'
      ? ['amber', 'sweet spice', 'warm projection', 'smooth drydown']
      : product.collection === 'daily'
        ? ['fresh profile', 'daily wear', 'clean woods', 'easy versatility']
        : []
  const electronicsDetails = product.subcategory === 'smartwatches'
    ? ['smartwatch', 'daily tracking', 'touch display', 'wireless pairing']
    : product.category === 'electronics'
      ? ['wireless audio', 'daily use', 'portable design', 'premium sound']
      : []
  const details = product.details ?? (scentDetails.length > 0 ? scentDetails : electronicsDetails.length > 0 ? electronicsDetails : product.tags.map((tag) => tag.replace(/-/g, ' ')))
  const included = product.included ?? [
    product.category === 'perfume' ? 'Factory bottle' : 'Product unit',
    product.category === 'perfume' ? 'Retail packaging' : 'Retail packaging',
  ]

  return (
    <section className="relative overflow-hidden bg-transparent px-3 py-6 text-jamm-dark sm:px-4 lg:py-12">
      <div className="pointer-events-none absolute -right-28 -top-28 h-80 w-80 rounded-full bg-jamm-gold/10 blur-3xl" />
      <div className="mx-auto max-w-[1560px]">
        <Link
          href={backHref}
          className="mb-4 inline-flex min-h-10 items-center gap-1.5 rounded-full border border-jamm-gold/20 bg-white/35 px-4 font-sans text-sm font-medium text-jamm-muted transition-colors duration-200 hover:text-jamm-dark sm:mb-6 sm:border-0 sm:bg-transparent sm:px-0"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5 flex-shrink-0" aria-hidden>
            <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {backLabel}
        </Link>

        <div className="grid grid-cols-1 gap-5 sm:gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
          <ProductDetailGallery
            images={galleryImages}
            alt={product.imageAlt}
            aspectRatio={isElectronics ? '4/3' : '4/5'}
            imageClassName={imageClassName}
          />

          <div className="rounded-lg border border-jamm-gold/20 bg-[#FAF7F2]/92 p-5 shadow-[0_18px_50px_rgba(12,11,9,0.06)] backdrop-blur-sm sm:p-8 lg:sticky lg:top-8">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              {product.badge && <ProductBadge type={product.badge} />}
              <span className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-jamm-muted">
                {product.brand || 'Jamm Trade'}
              </span>
            </div>

            <h1 className="max-w-xl font-sans text-[28px] font-semibold leading-tight text-jamm-dark sm:text-4xl lg:text-5xl">
              {product.title}
            </h1>

            <div className="mt-4 flex items-center gap-3 font-sans text-sm text-jamm-muted">
              <span className="flex items-center gap-0.5" aria-label="5 star rating">
                {[0, 1, 2, 3, 4].map((star) => (
                  <svg key={star} viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5 text-jamm-gold drop-shadow-[0_1px_4px_rgba(196,151,58,0.35)]" aria-hidden>
                    <path d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 14.4l-4.8 2.5.9-5.4L4.2 7.7l5.4-.8z" />
                  </svg>
                ))}
              </span>
              <span>3,345 reviews</span>
            </div>

            <div className="mt-6 rounded-md border border-jamm-gold/20 bg-white/55 px-4 py-3 sm:mt-7">
              <PriceDisplay price={product.price} compareAtPrice={product.compareAtPrice} onLight />
            </div>

            <div className="mt-6 border-t border-jamm-gold/15 pt-5 sm:mt-8 sm:pt-6">
              <p className="mb-3 font-sans text-sm font-semibold text-jamm-dark">
                {product.category === 'perfume' ? 'Notes' : product.category === 'electronics' ? 'Finish' : 'Colors'}
              </p>
              <div className="flex flex-wrap gap-3">
                {details.slice(0, 4).map((detail) => (
                  <span
                    key={detail}
                    className="rounded-md border border-jamm-gold/20 bg-white/70 px-3 py-2 font-sans text-xs font-medium capitalize text-jamm-muted"
                  >
                    {detail}
                  </span>
                ))}
              </div>
            </div>

            <ProductPurchasePanel product={product} />

            <Link
              href="/shop#perfumes"
              className="mt-4 inline-flex font-sans text-sm font-medium text-jamm-muted underline underline-offset-4 transition-colors duration-200 hover:text-jamm-gold"
            >
              Back to Shop
            </Link>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 rounded-lg border border-jamm-gold/18 bg-white/24 p-5 shadow-[0_16px_40px_rgba(12,11,9,0.04)] sm:mt-12 sm:border-t sm:border-x-0 sm:border-b-0 sm:bg-transparent sm:p-0 sm:pt-10 sm:shadow-none lg:grid-cols-[1.3fr_0.7fr]">
          <div>
            <h2 className="mb-4 font-sans text-xl font-semibold text-jamm-dark">Description</h2>
            <p className="max-w-3xl font-sans text-sm leading-relaxed text-jamm-dark/72 sm:text-base">
              {product.description}
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
            <div>
              <h3 className="mb-3 font-sans text-sm font-semibold text-jamm-dark">What's Included?</h3>
              <ul className="space-y-2.5 font-sans text-sm text-jamm-dark/70">
                {included.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-jamm-gold" aria-hidden>
                      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="capitalize">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-3 font-sans text-sm font-semibold text-jamm-dark">Features</h3>
              <ul className="space-y-2.5 font-sans text-sm text-jamm-dark/70">
                {details.slice(0, 5).map((detail) => (
                  <li key={detail} className="flex items-start gap-2">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-jamm-gold" aria-hidden>
                      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="capitalize">{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
