import type { ProductBadgeType } from '@/types/product'

interface ProductBadgeProps {
  type: ProductBadgeType
}

const labels: Record<ProductBadgeType, string> = {
  new: 'New',
  bestseller: 'Bestseller',
}

export function ProductBadge({ type }: ProductBadgeProps) {
  return (
    <span className="rounded-md bg-jamm-dark px-2.5 py-1.5 font-sans text-[9px] font-medium uppercase tracking-[0.16em] text-white shadow-sm">
      {labels[type]}
    </span>
  )
}
