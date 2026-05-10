interface PriceDisplayProps {
  price: number
  compareAtPrice?: number
  currency?: string
  onLight?: boolean
}

export function PriceDisplay({ price, compareAtPrice, currency = '$', onLight = false }: PriceDisplayProps) {
  return (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
      <span className={`${onLight ? 'text-jamm-dark' : 'text-white'} font-sans text-sm font-semibold sm:text-sm md:text-base lg:text-sm`}>
        {currency}{price.toFixed(2)}
      </span>
      {compareAtPrice && compareAtPrice > price && (
        <span className={`font-sans text-xs line-through sm:text-sm ${onLight ? 'text-black/30' : 'text-jamm-muted'}`}>
          {currency}{compareAtPrice.toFixed(2)}
        </span>
      )}
    </div>
  )
}
