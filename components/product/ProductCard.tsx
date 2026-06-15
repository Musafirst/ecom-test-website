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
  const canAddToCart = Boolean(product.variantId && product.availableForSale !== false)
  const cat = product.brand ? `${product.categoryLabel} · ${product.brand}` : product.categoryLabel

  const handleAdd = async () => {
    if (!canAddToCart || adding) return
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
        <span className="product__price">${product.price.toFixed(2)}</span>
        <div className="product__cart">
          {product.variantId ? (
            <button
              className="btn btn--dark btn--block"
              type="button"
              onClick={handleAdd}
              disabled={!canAddToCart || adding}
            >
              <span>
                {product.availableForSale === false ? 'Sold Out' : added ? 'Added ✓' : adding ? 'Adding…' : 'Add to Cart'}
              </span>
            </button>
          ) : (
            <Link className="btn btn--dark btn--block" href={`/shop/product/${product.handle}`}>
              <span>View Product</span>
            </Link>
          )}
        </div>
      </div>
    </article>
  )
}
