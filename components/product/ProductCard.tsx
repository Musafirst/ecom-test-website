'use client'

import { useState } from 'react'
import Link from 'next/link'
import { addShopifyItem, mergeCartItem, readCart, writeCart } from '@/lib/cart'
import type { JammProduct } from '@/types/product'

interface ProductCardProps {
  product: JammProduct
}

export function ProductCard({ product }: ProductCardProps) {
  const [added, setAdded] = useState(false)
  const [adding, setAdding] = useState(false)
  const hasMultipleVariants = (product.variants?.length ?? 0) > 1
  const priceVaries = typeof product.priceMax === 'number' && product.priceMax > product.price
  const canQuickAdd = Boolean(product.variantId && product.availableForSale !== false && !hasMultipleVariants)
  const cat = product.brand ? `${product.categoryLabel} · ${product.brand}` : product.categoryLabel

  const handleAdd = async () => {
    if (!canQuickAdd || adding) return
    setAdding(true)
    try {
      await addShopifyItem(product.variantId!, 1)
      writeCart(mergeCartItem(readCart(), product, 1))
      setAdded(true)
      window.setTimeout(() => setAdded(false), 1600)
    } catch {
      setAdded(false)
    } finally {
      setAdding(false)
    }
  }

  return (
    <article className="product reveal">
      <Link href={`/shop/product/${product.handle}`} className="product__media product__media--photo">
        <img className="product__photo" src={product.image} alt={product.imageAlt} loading="lazy" />
      </Link>
      <div className="product__body">
        <span className="product__cat">{cat}</span>
        <h3 className="product__name">
          <Link href={`/shop/product/${product.handle}`}>{product.title}</Link>
        </h3>
        <span className="product__price">
          {priceVaries ? 'From ' : ''}${product.price.toFixed(2)}
        </span>
        <div className="product__cart">
          {product.availableForSale === false ? (
            <button className="btn btn--dark btn--block" type="button" disabled>
              <span>Sold Out</span>
            </button>
          ) : hasMultipleVariants || !product.variantId ? (
            /* Products with options must be configured on the product page so
               the price shown always matches the variant added to the cart. */
            <Link className="btn btn--dark btn--block" href={`/shop/product/${product.handle}`}>
              <span>Choose Options</span>
            </Link>
          ) : (
            <button
              className="btn btn--dark btn--block"
              type="button"
              onClick={handleAdd}
              disabled={adding}
            >
              <span>{added ? 'Added ✓' : adding ? 'Adding…' : 'Add to Cart'}</span>
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
