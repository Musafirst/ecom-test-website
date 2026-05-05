import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ProductBadge } from '@/components/product/ProductBadge'
import { PriceDisplay } from '@/components/product/PriceDisplay'
import { ProductPhoto } from '@/components/ui/ProductPhoto'
import { featuredProducts, getProductByHandle } from '@/lib/products'

interface ProductPageProps {
  params: {
    handle: string
  }
}

export function generateStaticParams() {
  return featuredProducts.map((product) => ({ handle: product.handle }))
}

export function generateMetadata({ params }: ProductPageProps): Metadata {
  const product = getProductByHandle(params.handle)

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

export default function ProductPage({ params }: ProductPageProps) {
  const product = getProductByHandle(params.handle)

  if (!product) {
    notFound()
  }

  return (
    <section className="bg-white px-3 py-8 text-jamm-dark sm:px-4">
      <div className="mx-auto grid min-h-[calc(100vh-120px)] max-w-[1560px] grid-cols-1 gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="overflow-hidden rounded-[24px] bg-[#f4f4f2]">
          <ProductPhoto
            src={product.image}
            alt={product.imageAlt}
            aspectRatio="4/5"
          />
        </div>

        <div className="flex flex-col justify-center">
          <Link
            href={`/shop/collection/${product.collection}`}
            className="mb-6 font-sans text-sm font-medium text-jamm-muted transition-colors duration-200 hover:text-jamm-dark"
          >
            {product.collection} collection
          </Link>

          <div className="mb-5 flex items-center gap-3">
            {product.badge && <ProductBadge type={product.badge} />}
            <span className="text-[10px] font-sans uppercase tracking-[0.2em] text-jamm-muted">
              {product.brand || 'Eau de parfum'}
            </span>
          </div>

          <h1 className="mb-5 font-sans text-5xl font-medium leading-tight tracking-[-0.03em] text-jamm-dark sm:text-7xl">
            {product.title}
          </h1>

          <p className="mb-8 max-w-xl font-sans text-base leading-relaxed text-jamm-muted sm:text-lg">
            {product.description}
          </p>

          <div className="mb-8">
            <PriceDisplay price={product.price} compareAtPrice={product.compareAtPrice} onLight />
          </div>

          <div className="grid max-w-xl grid-cols-1 gap-3 border-y border-black/10 py-6 sm:grid-cols-3">
            {['Verified sourcing', 'Premium oils', 'Worldwide shipping'].map((item) => (
              <p key={item} className="font-sans text-[11px] uppercase tracking-[0.16em] text-jamm-muted">
                {item}
              </p>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="mailto:contact@jammtrade.com"
              className="inline-flex items-center justify-center rounded-full bg-jamm-dark px-8 py-4 font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-white transition-colors duration-300 hover:bg-jamm-gold hover:text-jamm-dark"
            >
              Request Purchase
            </Link>
            <Link
              href="/shop#perfumes"
              className="inline-flex items-center justify-center rounded-full border border-black/15 px-8 py-4 font-sans text-[11px] font-medium uppercase tracking-[0.18em] text-jamm-dark transition-colors duration-300 hover:border-jamm-gold hover:text-jamm-gold"
            >
              Back to Shop
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
