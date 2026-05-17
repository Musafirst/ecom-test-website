import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckoutCart } from '@/components/shop/CheckoutCart'
import { SectionLabel } from '@/components/ui/SectionLabel'
import { getAllProducts } from '@/lib/products'

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Review your Jamm Trade cart and prepare your order.',
}

export default async function CheckoutPage() {
  const products = await getAllProducts()

  return (
    <section className="min-h-[calc(100vh-120px)] bg-transparent px-3 py-8 text-jamm-dark sm:px-4">
      <div className="mx-auto max-w-[1560px] py-10 lg:py-16">
        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <SectionLabel>Checkout</SectionLabel>
            <h1 className="mt-3 font-sans text-3xl font-medium tracking-[-0.03em] text-jamm-dark sm:text-5xl lg:text-7xl">
              Your Cart
            </h1>
            <p className="mt-5 max-w-2xl font-sans text-lg leading-relaxed text-jamm-muted">
              Review your selected products before sending the order request.
            </p>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center rounded-full border border-black/15 px-6 py-3 font-sans text-[10px] font-medium uppercase tracking-[0.18em] text-jamm-dark transition-colors duration-300 hover:border-jamm-gold hover:text-jamm-gold"
          >
            Continue Shopping
          </Link>
        </div>

        <CheckoutCart products={products} />
      </div>
    </section>
  )
}
