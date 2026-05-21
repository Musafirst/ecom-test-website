import type { Metadata } from 'next'
import { Interactive3DHero } from '@/components/hero/Interactive3DHero'

export const metadata: Metadata = {
  title: '3D Hero Preview',
  robots: {
    index: false,
    follow: false,
  },
}

export default function HeroPreviewPage() {
  return <Interactive3DHero />
}
