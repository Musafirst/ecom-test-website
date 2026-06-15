import Link from 'next/link'
import { ProductCard } from '@/components/product/ProductCard'
import type { JammProduct } from '@/types/product'

interface FeaturedProductsProps {
  products: JammProduct[]
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (products.length === 0) return null

  return (
    <section className="section" id="fragrance">
      <div className="container">
        <div className="section-head">
          <div className="head-left reveal">
            <p className="eyebrow">Fragrance Collection</p>
            <h2 className="section-title">Featured Products</h2>
          </div>
          <Link className="link-arrow reveal" href="/shop/category/perfumes">
            View all products
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </Link>
          <div className="rule" />
        </div>

        <div className="products-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
