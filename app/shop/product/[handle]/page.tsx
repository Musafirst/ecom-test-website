import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ProductBadge } from '@/components/product/ProductBadge'
import { ProductDetailGallery } from '@/components/product/ProductDetailGallery'
import { ProductPurchasePanel } from '@/components/product/ProductPurchasePanel'
import { PriceDisplay } from '@/components/product/PriceDisplay'
import { getAllProducts, getProductByHandle } from '@/lib/products'
import { absoluteSiteUrl, site, siteUrl } from '@/lib/site'
import type { JammProduct } from '@/types/product'

interface ProductPageProps {
  params: Promise<{
    handle: string
  }>
}

function uniqueImages(images: string[]) {
  return images.filter((image, index) => Boolean(image) && images.indexOf(image) === index)
}

function cleanProductTitle(title: string) {
  return title.replace(/\s+/g, ' ').replace(/\s+\|\s+Jamm Trade$/i, '').trim()
}

function cleanProductDescription(product: JammProduct) {
  const fallback = `${cleanProductTitle(product.title)} from ${site.name}. Premium ${product.categoryLabel.toLowerCase()} selection with secure checkout.`
  return (product.description ?? fallback).replace(/\s+/g, ' ').trim()
}

function getProductGalleryImages(product: JammProduct) {
  return uniqueImages([product.image, ...(product.galleryImages ?? [])]).slice(0, 5)
}

export async function generateStaticParams() {
  const products = await getAllProducts()

  return products.map((product) => ({ handle: product.handle }))
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { handle } = await params
  const product = await getProductByHandle(handle)

  if (!product) {
    return {
      title: 'Product not found',
    }
  }

  const title = cleanProductTitle(product.title)
  const description = cleanProductDescription(product)

  return {
    title,
    description,
    alternates: {
      canonical: `/shop/product/${product.handle}`,
    },
    openGraph: {
      type: 'website',
      title: `${title} | ${site.name}`,
      description,
      url: `${siteUrl}/shop/product/${product.handle}`,
      images: [
        {
          url: absoluteSiteUrl(product.image),
          width: 1200,
          height: 1200,
          alt: product.imageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${site.name}`,
      description,
      images: [absoluteSiteUrl(product.image)],
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle } = await params
  const product = await getProductByHandle(handle)

  if (!product) {
    notFound()
  }

  const backHref = product.collection ? `/shop/collection/${product.collection}` : '/shop/category/electronics'
  const backLabel = product.collection ? `${product.categoryLabel} collection` : product.categoryLabel
  const isElectronics = product.category === 'electronics'
  const isPerfume = product.category === 'perfume'
  const isClothing = product.category === 'clothing'
  const electronicsImageClassName =
    product.handle === 'sony-wh-1000xm5'
      ? 'object-contain p-5 mix-blend-multiply sm:p-7'
      : product.subcategory === 'smartwatches'
        ? 'object-contain p-3 mix-blend-multiply sm:p-4'
        : 'object-contain p-5 mix-blend-multiply sm:p-7'
  const perfumeImageClassName = 'object-contain p-6 mix-blend-multiply contrast-[1.04] drop-shadow-[0_28px_34px_rgba(12,11,9,0.26)] sm:p-8'
  const clothingImageClassName = 'object-contain p-2 mix-blend-multiply drop-shadow-[0_20px_28px_rgba(12,11,9,0.18)] sm:p-5'
  const imageClassName = isElectronics ? electronicsImageClassName : isPerfume ? perfumeImageClassName : isClothing ? clothingImageClassName : 'object-contain p-5'
  const galleryImages = getProductGalleryImages(product)
  const productTitle = cleanProductTitle(product.title)
  const productDescription = cleanProductDescription(product)
  const productDescriptionPreview = productDescription.length > 180
    ? `${productDescription.slice(0, 180).trim()}...`
    : productDescription
  const productUrl = `${siteUrl}/shop/product/${product.handle}`
  const productSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        '@id': `${productUrl}#product`,
        name: productTitle,
        description: productDescription,
        image: galleryImages.map(absoluteSiteUrl),
        brand: {
          '@type': 'Brand',
          name: product.brand || site.name,
        },
        sku: product.id,
        category: product.categoryLabel,
        offers: {
          '@type': 'Offer',
          url: productUrl,
          priceCurrency: product.currencyCode ?? 'USD',
          price: product.price.toFixed(2),
          availability: product.availableForSale === false
            ? 'https://schema.org/OutOfStock'
            : 'https://schema.org/InStock',
          itemCondition: 'https://schema.org/NewCondition',
          seller: {
            '@type': 'Organization',
            name: site.name,
            url: siteUrl,
          },
        },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${productUrl}#breadcrumbs`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Shop',
            item: `${siteUrl}/shop`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: product.categoryLabel,
            item: `${siteUrl}${backHref}`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: productTitle,
            item: productUrl,
          },
        ],
      },
    ],
  }

  // These are display-only fallbacks for legacy/demo products. Live Shopify
  // content still controls title, description, price, images, and inventory.
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
    product.category === 'perfume' ? 'Full-size bottle' : 'Product unit',
    product.category === 'perfume' ? 'Retail packaging' : 'Retail packaging',
  ]

  return (
    <section className="relative overflow-hidden bg-transparent px-3 py-4 text-jamm-dark sm:px-4 sm:py-6 lg:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <div className="pointer-events-none absolute -right-28 -top-28 h-80 w-80 rounded-full bg-jamm-gold/10 blur-3xl" />
      <div className="mx-auto max-w-[1560px]">
        <Link
          href={backHref}
          className="mb-3 inline-flex min-h-9 items-center gap-1.5 rounded-full border border-jamm-gold/20 bg-white/35 px-3 font-sans text-xs font-medium text-jamm-muted transition-colors duration-200 hover:text-jamm-dark sm:mb-6 sm:min-h-10 sm:border-0 sm:bg-transparent sm:px-0 sm:text-sm"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5 flex-shrink-0" aria-hidden>
            <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {backLabel}
        </Link>

        <div className="grid min-w-0 grid-cols-1 gap-3 sm:gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
          <ProductDetailGallery
            images={galleryImages}
            alt={product.imageAlt}
            aspectRatio={isElectronics ? '4/3' : isClothing ? '4/3' : '4/5'}
            imageClassName={imageClassName}
            compact={isClothing}
          />

          <div className={`${isClothing ? 'p-3 min-[390px]:p-4' : 'p-4'} min-w-0 rounded-lg border border-jamm-gold/20 bg-[#FAF7F2]/92 shadow-[0_18px_50px_rgba(12,11,9,0.06)] backdrop-blur-sm sm:p-8 lg:sticky lg:top-[136px]`}>
            <div className="mb-3 flex flex-wrap items-center gap-2.5 sm:mb-4 sm:gap-3">
              {product.badge && <ProductBadge type={product.badge} />}
              <span className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-jamm-muted">
                {product.brand || 'Jamm Trade'}
              </span>
            </div>

            <h1 className="max-w-xl [overflow-wrap:anywhere] font-serif text-[clamp(1.45rem,6.5vw,2rem)] font-light leading-[1.08] text-jamm-dark sm:text-5xl lg:text-6xl">
              {productTitle}
            </h1>


            <div className="mt-4 rounded-md border border-jamm-gold/20 bg-white/55 px-3 py-2.5 sm:mt-7 sm:px-4 sm:py-3">
              <PriceDisplay price={product.price} compareAtPrice={product.compareAtPrice} onLight />
            </div>

            <p className="mt-2 font-sans text-[11px] font-medium uppercase tracking-[0.14em] text-jamm-muted sm:mt-3 sm:text-xs sm:tracking-[0.16em]">
              {product.availableForSale === false
                ? 'Out of stock'
                : typeof product.quantityAvailable === 'number'
                  ? product.quantityAvailable > 0
                    ? `${product.quantityAvailable} available`
                    : 'In stock'
                  : 'In stock'}
            </p>

            <div className="mt-4 border-t border-jamm-gold/15 pt-4 sm:mt-8 sm:pt-6">
              <p className="mb-2.5 font-sans text-sm font-semibold text-jamm-dark sm:mb-3">
                {product.category === 'perfume' ? 'Notes' : product.category === 'electronics' ? 'Finish' : 'Colors'}
              </p>
              <div className="flex flex-wrap gap-2.5 sm:gap-3">
                {details.slice(0, 4).map((detail) => (
                  <span
                    key={detail}
                    className="max-w-full [overflow-wrap:anywhere] rounded-md border border-jamm-gold/20 bg-white/70 px-3 py-2 font-sans text-xs font-medium capitalize leading-snug text-jamm-muted"
                  >
                    {detail}
                  </span>
                ))}
              </div>
            </div>

            <ProductPurchasePanel product={product} compact={isClothing} />

            <Link
              href="/shop#perfumes"
              className="mt-4 inline-flex font-sans text-sm font-medium text-jamm-muted underline underline-offset-4 transition-colors duration-200 hover:text-jamm-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jamm-gold focus-visible:ring-offset-2"
            >
              Back to Shop
            </Link>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 rounded-lg border border-jamm-gold/18 bg-white/24 p-5 shadow-[0_16px_40px_rgba(12,11,9,0.04)] sm:mt-12 sm:border-t sm:border-x-0 sm:border-b-0 sm:bg-transparent sm:p-0 sm:pt-10 sm:shadow-none lg:grid-cols-[1.3fr_0.7fr]">
          <div>
            <h2 className="mb-4 font-sans text-xl font-semibold text-jamm-dark">Description</h2>
            <div className="max-w-3xl font-sans text-sm leading-relaxed text-jamm-dark/72 sm:text-base">
              <p>{productDescriptionPreview}</p>
              {productDescriptionPreview !== productDescription && (
                <details className="group mt-3">
                  <summary className="inline-flex cursor-pointer list-none items-center gap-2 rounded-md border border-jamm-gold/25 bg-[#FAF7F2]/70 px-3 py-2 font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-jamm-dark transition-colors hover:border-jamm-gold/55 [&::-webkit-details-marker]:hidden">
                    <span className="group-open:hidden">Read more</span>
                    <span className="hidden group-open:inline">Show less</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5 transition-transform group-open:rotate-180" aria-hidden>
                      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </summary>
                  <p className="mt-3">{productDescription}</p>
                </details>
              )}
            </div>
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
