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
  weight: ['300', '400', '500'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Jamm Trade',
    template: '%s | Jamm Trade',
  },
  description: 'Rare fragrances. Curated for those who know the difference.',
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
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body>
        <BackgroundComponents>
          <TabNav />
          <main>{children}</main>
          <Footer />
        </BackgroundComponents>
      </body>
    </html>
  )
}
