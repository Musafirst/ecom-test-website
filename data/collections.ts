import { perfumeProducts } from '@/data/products'

export const collectionDetails = {
  oud: {
    name: 'Oud',
    intro: 'Deep, resinous fragrances built around oud, woods, smoke, and amber.',
    note: 'Lattafa, Maison Alhambra, Afnan, and Armaf oud selections prepared for Shopify upload.',
    count: `${perfumeProducts.filter((product) => product.collection === 'oud').length} fragrances`,
  },
  amber: {
    name: 'Amber',
    intro: 'Warm amber blends with sweet spice, musk, vanilla, and polished projection.',
    note: 'Amber-led fragrance picks from Lattafa, Al Haramain, Afnan, and Armaf.',
    count: `${perfumeProducts.filter((product) => product.collection === 'amber').length} fragrances`,
  },
  daily: {
    name: 'Daily',
    intro: 'Clean, balanced fragrances that work from morning through night.',
    note: 'Fresh, versatile daily scents selected as the most approachable entry point.',
    count: `${perfumeProducts.filter((product) => product.collection === 'daily').length} fragrances`,
  },
} as const

export const categoryDetails = {
  clothing: {
    name: 'Clothing',
    intro: 'Jamm Trade apparel with the lotus mark across everyday essentials.',
    detail: 'Clothing stays planned for a later release.',
  },
  electronics: {
    name: 'Electronics',
    intro: 'Headphones, audio, and smartwatches selected as a secondary Jamm Trade category.',
    detail: 'Electronics are prepared in product data for future Shopify upload, with perfumes remaining the main focus.',
  },
} as const
