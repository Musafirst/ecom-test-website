import type { Metadata } from 'next'
import { ComingSoonPage } from '@/components/coming-soon/ComingSoonPage'

export const metadata: Metadata = {
  title: 'Jamm Cargo',
  description: 'Jamm Cargo - US to Africa. Coming soon.',
}

export default function JammCargoPage() {
  return (
    <ComingSoonPage
      headline="Jamm Cargo — US to Africa"
      subtext="Get updates when shipping services from the U.S. to Africa become available."
    />
  )
}
