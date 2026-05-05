import type { Metadata } from 'next'
import { ComingSoonPage } from '@/components/coming-soon/ComingSoonPage'

export const metadata: Metadata = {
  title: 'Jamm Fleet',
  description: 'Jamm Fleet is coming soon.',
}

export default function JammFleetPage() {
  return (
    <ComingSoonPage
      headline="Jamm Fleet is coming soon"
      subtext="Be first to know when car rental services open."
    />
  )
}
