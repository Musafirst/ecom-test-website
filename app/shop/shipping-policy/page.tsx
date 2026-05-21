import type { Metadata } from 'next'
import { PolicyPage } from '@/components/legal/PolicyPage'

export const metadata: Metadata = {
  title: 'Shipping Policy',
  description: 'Shipping, processing, delivery, and order tracking information for Jamm Trade.',
  alternates: {
    canonical: '/shop/shipping-policy',
  },
}

export default function ShippingPolicyPage() {
  return (
    <PolicyPage
      title="Shipping Policy"
      intro="Jamm Trade ships eligible orders with tracked delivery and careful packaging for fragrances, electronics, and curated essentials."
      sections={[
        {
          heading: 'Processing Time',
          body: [
            'Orders are typically processed within 1 to 3 business days after payment is confirmed, excluding weekends and holidays.',
          ],
        },
        {
          heading: 'Shipping Rates and Delivery',
          body: [
            'Shipping rates, available methods, estimated delivery dates, taxes, and duties are calculated at secure Shopify checkout before payment is completed.',
            'Delivery estimates are provided by the carrier and may vary due to address accuracy, weather, carrier volume, or customs processing.',
          ],
        },
        {
          heading: 'Tracking',
          body: [
            'When tracking is available, customers receive shipment details by email after the order has been fulfilled.',
          ],
        },
        {
          heading: 'Address Accuracy',
          body: [
            'Customers are responsible for entering a complete and accurate shipping address. Contact Jamm Trade quickly if an address needs correction before fulfillment.',
          ],
        },
      ]}
    />
  )
}
