import type { Metadata } from 'next'
import { PolicyPage } from '@/components/legal/PolicyPage'
import { getShopifyPolicies } from '@/lib/shopify'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Jamm Trade collects, uses, and protects customer information.',
  alternates: {
    canonical: '/shop/privacy-policy',
  },
}

export default async function PrivacyPolicyPage() {
  const policies = await getShopifyPolicies()
  const policy = policies?.privacyPolicy

  return (
    <PolicyPage
      title="Privacy Policy"
      updated="May 17, 2026"
      html={policy?.body}
      intro="Jamm Trade respects customer privacy. This policy explains how information is used to operate the storefront, process orders, and support customers."
      sections={[
        {
          heading: 'Contact',
          body: ['For privacy questions, contact us at contact@jammtrade.com or at 100 Branford Road, Darby, PA, 19023, US.'],
        },
      ]}
    />
  )
}
