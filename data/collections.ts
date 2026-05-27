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
  perfumes: {
    name: 'Perfumes',
    intro: 'Rare fragrances curated across three scent families — oud, amber, and daily wear.',
    detail: 'Browse by collection to find your signature.',
  },
  clothing: {
    name: 'Clothing',
    intro: 'Jamm Trade branded apparel with the lotus mark across everyday essentials.',
    detail: 'Hoodies, tees, and essentials printed on demand. Each piece carries the Jamm Trade identity.',
  },
  electronics: {
    name: 'Electronics',
    intro: 'Headphones, audio accessories, and smartwatches selected for quality and everyday use.',
    detail: 'A curated secondary category featuring trusted audio and wearable brands.',
  },
} as const
