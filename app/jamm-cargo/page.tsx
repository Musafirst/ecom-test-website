import type { Metadata } from 'next'
import { ComingSoonPage } from '@/components/coming-soon/ComingSoonPage'

export const metadata: Metadata = {
  title: 'Jamm Cargo',
  description: 'Jamm Cargo for America, Europe, Asia, and Africa. Coming soon.',
}

export default function JammCargoPage() {
  return (
    <ComingSoonPage
      headline="Jamm Cargo - America, Europe, Asia, Africa."
      subtext="Get updates when shipping services across America, Europe, Asia, and Africa become available."
    />
  )
}
