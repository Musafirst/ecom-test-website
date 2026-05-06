import type { Metadata } from 'next'
import { SpectraOudShowcase } from '@/components/shop/SpectraOudShowcase'

export const metadata: Metadata = {
  title: 'Spectra Oud',
  description: 'Deep resinous oud anchored by smoky amber, black musk, and a whisper of rose.',
}

export default function SpectraOudPage() {
  return <SpectraOudShowcase />
}
