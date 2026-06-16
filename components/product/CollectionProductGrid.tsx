import { ProductCard } from '@/components/product/ProductCard'
import type { JammProduct } from '@/types/product'

interface CollectionProductGridProps {
  products: JammProduct[]
}

// Server-rendered, no scroll/entrance animation: product cards must be visible
// immediately and never depend on client JS to become visible.
export function CollectionProductGrid({ products }: CollectionProductGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
