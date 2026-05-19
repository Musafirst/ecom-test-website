import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import './globals.css'
import { TabNav } from '@/components/layout/TabNav'
import { Footer } from '@/components/layout/Footer'
import BackgroundComponents from '@/components/ui/background-components'

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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://jammtrade.com')

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Jamm Trade',
    template: '%s | Jamm Trade',
  },
  description: 'Rare fragrances. Curated for those who know the difference.',
  openGraph: {
    type: 'website',
    siteName: 'Jamm Trade',
    title: 'Jamm Trade',
    description: 'Rare fragrances. Curated for those who know the difference.',
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
    title: 'Jamm Trade',
    description: 'Rare fragrances. Curated for those who know the difference.',
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
        name: 'Jamm Trade',
        url: siteUrl,
        logo: `${siteUrl}/brand_assets/icons/jammtrade-favicon-512.png`,
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer support',
          email: 'contact@jammtrade.com',
          availableLanguage: 'en',
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        name: 'Jamm Trade',
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
