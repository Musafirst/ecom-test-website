import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import './globals.css'
import { TabNav } from '@/components/layout/TabNav'
import { Footer } from '@/components/layout/Footer'
import BackgroundComponents from '@/components/ui/background-components'
import { absoluteSiteUrl, site, siteUrl } from '@/lib/site'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  variable: '--font-cormorant',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: site.name,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: {
    type: 'website',
    siteName: site.name,
    title: site.name,
    description: site.description,
    url: '/',
    images: [
      {
        url: '/images/hero-main-commerce.webp',
        width: 1600,
        height: 1067,
        alt: 'Jamm Trade curated fragrance and essentials edit',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: site.name,
    description: site.description,
    images: ['/images/hero-main-commerce.webp'],
  },
  icons: {
    icon: [
      { url: '/brand_assets/icons/jammtrade-icon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/brand_assets/icons/jammtrade-favicon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: { url: '/brand_assets/icons/jammtrade-apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    other: [
      { rel: 'icon', url: '/brand_assets/icons/jammtrade-icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: site.name,
        legalName: 'Jamm Trade LLC',
        url: siteUrl,
        logo: absoluteSiteUrl('/brand_assets/icons/jammtrade-favicon-512.png'),
        email: site.supportEmail,
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer support',
          email: site.supportEmail,
          availableLanguage: 'en',
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        name: site.name,
        url: siteUrl,
        publisher: {
          '@id': `${siteUrl}/#organization`,
        },
      },
    ],
  }

  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <BackgroundComponents>
          <TabNav />
          <main>{children}</main>
          <Footer />
        </BackgroundComponents>
      </body>
    </html>
  )
}
