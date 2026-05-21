import type { Metadata } from 'next'
import { PolicyPage } from '@/components/legal/PolicyPage'

export const metadata: Metadata = {
  title: 'Refund Policy',
  description: 'Refunds, returns, and exchange terms for Jamm Trade orders.',
  alternates: {
    canonical: '/shop/refund-policy',
  },
}

export default function RefundPolicyPage() {
  return (
    <PolicyPage
      title="Refund Policy"
      intro="Jamm Trade reviews every order with care. This policy explains how returns, refunds, and exchanges are handled for eligible purchases."
      sections={[
        {
          heading: 'Return Window',
          body: [
            'Eligible items may be requested for return within 14 days of delivery. Items must be unused, unopened, in original retail packaging, and in the same condition received.',
            'For fragrance products, the outer seal and packaging must remain intact unless the item arrived damaged or incorrect.',
          ],
        },
        {
          heading: 'Non-Returnable Items',
          body: [
            'Opened fragrances, used electronics, personal care items, gift cards, final sale items, and products damaged after delivery are not eligible for return.',
          ],
        },
        {
          heading: 'Damaged or Incorrect Orders',
          body: [
            'If an order arrives damaged, defective, or incorrect, contact Jamm Trade within 48 hours of delivery with the order number and clear photos of the item and packaging.',
            'Approved claims may be resolved with a replacement, exchange, or refund depending on inventory and order details.',
          ],
        },
        {
          heading: 'Refund Timing',
          body: [
            'Approved refunds are issued to the original payment method after the returned item is received and inspected. Bank or card processing times may vary.',
          ],
        },
      ]}
    />
  )
}
