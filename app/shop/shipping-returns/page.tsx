import type { Metadata } from 'next'
import { PolicyPage } from '@/components/legal/PolicyPage'

export const metadata: Metadata = {
  title: 'Shipping & Returns',
  description: 'Shipping and returns overview for Jamm Trade shop orders.',
  alternates: {
    canonical: '/shop/shipping-returns',
  },
}

export default function ShippingReturnsPage() {
  return (
    <PolicyPage
      title="Shipping & Returns"
      intro="A quick overview of fulfillment and returns. For full details, review the dedicated shipping and refund policies linked below."
      sections={[
        {
          heading: 'Shipping',
          body: [
            'Orders are typically processed within 1 to 3 business days after payment confirmation. Shipping rates and delivery estimates are confirmed during secure Shopify checkout.',
          ],
        },
        {
          heading: 'Returns',
          body: [
            'Eligible return requests must be made within 14 days of delivery. Items must be unused, unopened, and in original retail packaging unless the item arrived damaged or incorrect.',
          ],
        },
        {
          heading: 'Support',
          body: [
            'Contact Jamm Trade with your order number and product details for shipping, delivery, return, or damaged-item support.',
          ],
        },
      ]}
    />
  )
}
