import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import './globals.css'
import { TabNav } from '@/components/layout/TabNav'
import { Footer } from '@/components/layout/Footer'

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
    icon: '/brand_assets/icons/jammtrade-favicon-512.png',
    apple: '/brand_assets/icons/jammtrade-app-icon-1024.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body>
        <TabNav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
