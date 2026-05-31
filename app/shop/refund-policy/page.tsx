import type { Metadata } from 'next'
import { PolicyPage } from '@/components/legal/PolicyPage'
import { getShopifyPolicies } from '@/lib/shopify'
import { site } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Refund Policy',
  description: 'Refunds, returns, and exchange terms for Jamm Trade orders.',
  alternates: {
    canonical: '/shop/refund-policy',
  },
}

export default async function RefundPolicyPage() {
  const policies = await getShopifyPolicies()
  const policy = policies?.refundPolicy

  return (
    <PolicyPage
      title="Refund Policy"
      html={policy?.body}
      intro={`Jamm Trade reviews every order with care. Contact us at ${site.supportEmail} for return and refund requests.`}
      sections={[
        {
          heading: 'Return Window',
          body: ['Eligible items may be requested for return within 14 days of delivery. Items must be unused, unopened, and in original packaging.'],
        },
      ]}
    />
  )
}
