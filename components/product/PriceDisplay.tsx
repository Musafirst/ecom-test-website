interface PriceDisplayProps {
  price: number
  compareAtPrice?: number
  currency?: string
  onLight?: boolean
}

export function PriceDisplay({ price, compareAtPrice, currency = '$', onLight = false }: PriceDisplayProps) {
  return (
    <div className="flex items-center gap-3">
      <span className={`${onLight ? 'text-jamm-dark' : 'text-white'} font-sans text-base font-semibold sm:text-sm`}>
        {currency}{price.toFixed(2)}
      </span>
      {compareAtPrice && compareAtPrice > price && (
        <span className={`font-sans text-base line-through sm:text-sm ${onLight ? 'text-black/30' : 'text-jamm-muted'}`}>
          {currency}{compareAtPrice.toFixed(2)}
        </span>
      )}
    </div>
  )
}
