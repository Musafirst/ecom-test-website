import type { Metadata } from 'next'
import { PolicyPage } from '@/components/legal/PolicyPage'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Jamm Trade collects, uses, and protects customer information.',
  alternates: {
    canonical: '/shop/privacy-policy',
  },
}

export default function PrivacyPolicyPage() {
  return (
    <PolicyPage
      title="Privacy Policy"
      intro="Jamm Trade respects customer privacy. This policy explains how information is used to operate the storefront, process orders, and support customers."
      sections={[
        {
          heading: 'Information We Collect',
          body: [
            'Jamm Trade may collect contact details, shipping details, billing details, order history, device information, and messages sent to customer support.',
            'Payment information is handled through secure Shopify checkout and payment providers. Jamm Trade does not store full card numbers on this website.',
          ],
        },
        {
          heading: 'How Information Is Used',
          body: [
            'Customer information is used to process orders, provide shipping updates, prevent fraud, respond to support requests, improve the storefront, and comply with legal obligations.',
          ],
        },
        {
          heading: 'Service Providers',
          body: [
            'Jamm Trade may share necessary order and site information with Shopify, payment processors, fulfillment providers, carriers, analytics services, and other service providers used to operate the store.',
          ],
        },
        {
          heading: 'Customer Choices',
          body: [
            'Customers may contact Jamm Trade to request help with privacy questions, order data, or communication preferences.',
          ],
        },
      ]}
    />
  )
}
