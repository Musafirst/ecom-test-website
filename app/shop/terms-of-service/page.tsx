import type { Metadata } from 'next'
import { PolicyPage } from '@/components/legal/PolicyPage'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for using Jamm Trade and purchasing products.',
  alternates: {
    canonical: '/shop/terms-of-service',
  },
}

export default function TermsOfServicePage() {
  return (
    <PolicyPage
      title="Terms of Service"
      intro="These terms govern use of the Jamm Trade storefront and purchases made through secure Shopify checkout."
      sections={[
        {
          heading: 'Store Use',
          body: [
            'By using this website, you agree to provide accurate account, contact, billing, and shipping information when placing an order.',
            'Jamm Trade may refuse or cancel orders that appear fraudulent, contain pricing errors, violate these terms, or cannot be fulfilled.',
          ],
        },
        {
          heading: 'Product Information',
          body: [
            'Jamm Trade works to present product titles, images, descriptions, availability, and pricing accurately. Minor packaging or presentation differences may occur by supplier or production batch.',
          ],
        },
        {
          heading: 'Pricing and Payment',
          body: [
            'Prices are shown in the storefront currency and confirmed at checkout. Taxes, shipping, and applicable duties are calculated during checkout before payment is submitted.',
          ],
        },
        {
          heading: 'Checkout and Fulfillment',
          body: [
            'Purchases are completed through secure Shopify checkout. Order fulfillment depends on payment authorization, inventory availability, and successful carrier acceptance.',
          ],
        },
      ]}
    />
  )
}
