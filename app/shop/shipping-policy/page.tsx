import type { Metadata } from 'next'
import { PolicyPage } from '@/components/legal/PolicyPage'
import { getShopifyPolicies } from '@/lib/shopify'

export const metadata: Metadata = {
  title: 'Shipping Policy',
  description: 'Shipping, processing, delivery, and order tracking information for Jamm Trade.',
  alternates: {
    canonical: '/shop/shipping-policy',
  },
}

export default async function ShippingPolicyPage() {
  const policies = await getShopifyPolicies()
  const policy = policies?.shippingPolicy

  return (
    <PolicyPage
      title="Shipping Policy"
      html={policy?.body}
      intro="Jamm Trade ships eligible orders with tracked delivery. Processing takes 1–3 business days."
      sections={[
        {
          heading: 'Delivery',
          body: ['United States 3–7 business days. International 7–21 business days. Shipping rates calculated at checkout.'],
        },
      ]}
    />
  )
}
