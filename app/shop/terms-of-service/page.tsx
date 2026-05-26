import type { Metadata } from 'next'
import { PolicyPage } from '@/components/legal/PolicyPage'
import { getShopifyPolicies } from '@/lib/shopify'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for using Jamm Trade and purchasing products.',
  alternates: {
    canonical: '/shop/terms-of-service',
  },
}

export default async function TermsOfServicePage() {
  const policies = await getShopifyPolicies()
  const policy = policies?.termsOfService

  return (
    <PolicyPage
      title="Terms of Service"
      html={policy?.body}
      intro="These terms govern use of the Jamm Trade storefront and purchases made through secure Shopify checkout."
      sections={[
        {
          heading: 'Store Use',
          body: ['By using this website, you agree to provide accurate account, contact, billing, and shipping information. Jamm Trade may refuse or cancel orders that violate these terms.'],
        },
      ]}
    />
  )
}
