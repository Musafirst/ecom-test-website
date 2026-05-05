import type { JammProduct } from '@/types/product'

// Placeholder product data. Replace with Shopify Storefront API when live.
// Images: add an `images: string[]` field to JammProduct and populate with real URLs.
export const featuredProducts: JammProduct[] = [
  {
    id: 'pf-001',
    handle: 'signature-oud',
    title: 'Signature Oud',
    price: 89,
    collection: 'oud',
    badge: 'bestseller',
    description: 'Deep oud on a bed of amber and musk.',
    brand: 'Oriental oud style',
    image: 'https://images.pexels.com/photos/30618765/pexels-photo-30618765.jpeg?auto=compress&cs=tinysrgb&w=1200',
    imageAlt: 'Luxurious oud perfume bottle with rose petals on a dark backdrop',
  },
  {
    id: 'pf-002',
    handle: 'amber-night',
    title: 'Amber Night',
    price: 75,
    collection: 'amber',
    description: 'Warm amber, soft vanilla, lasting.',
    brand: 'Maison inspired',
    image: 'https://images.pexels.com/photos/15926320/pexels-photo-15926320.jpeg?auto=compress&cs=tinysrgb&w=1200',
    imageAlt: 'Minimal perfume bottle with gold accents on warm wood',
  },
  {
    id: 'pf-003',
    handle: 'rose-musk',
    title: 'Rose Musk',
    price: 65,
    collection: 'daily',
    badge: 'new',
    description: 'Fresh rose cut with clean musk.',
    brand: 'Fresh musk style',
    image: 'https://images.pexels.com/photos/9197662/pexels-photo-9197662.jpeg?auto=compress&cs=tinysrgb&w=1200',
    imageAlt: 'Luxury perfume bottle on white cloth in soft sunlight',
  },
  {
    id: 'pf-004',
    handle: 'cedar-gold',
    title: 'Cedar Gold',
    price: 95,
    collection: 'oud',
    description: 'Cedar, oud, and a trace of smoke.',
    brand: 'Afnan style',
    image: 'https://images.pexels.com/photos/33820360/pexels-photo-33820360.jpeg?auto=compress&cs=tinysrgb&w=1200',
    imageAlt: 'Premium perfume bottle with Arabic-style script on a bright surface',
  },
]

export const collectionProducts = {
  oud: featuredProducts.filter((p) => p.collection === 'oud'),
  amber: featuredProducts.filter((p) => p.collection === 'amber'),
  daily: featuredProducts.filter((p) => p.collection === 'daily'),
}

export const collectionDetails = {
  oud: {
    name: 'Oud',
    intro: 'Deep, resinous fragrances built around oud, woods, smoke, and amber.',
    note: 'Best for evenings, colder weather, and anyone who likes a scent with real presence.',
  },
  amber: {
    name: 'Amber',
    intro: 'Warm amber blends with vanilla, musk, and soft spice.',
    note: 'Smooth, lasting, and easy to wear close to the skin.',
  },
  daily: {
    name: 'Daily',
    intro: 'Clean, balanced fragrances that work from morning through night.',
    note: 'Polished without feeling heavy.',
  },
}

export const categoryDetails = {
  clothing: {
    name: 'Clothing',
    intro: 'Jamm Trade apparel with the lotus mark across everyday essentials.',
    detail: 'Hoodies, tees, and accessories are being prepared for release.',
  },
  electronics: {
    name: 'Electronics',
    intro: 'Curated tech and audio for a sharper daily setup.',
    detail: 'A small electronics selection is coming soon.',
  },
}

export function getProductByHandle(handle: string) {
  return featuredProducts.find((product) => product.handle === handle)
}
