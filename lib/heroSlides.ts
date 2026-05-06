export interface HeroSlide {
  id: string
  category: string
  title: string
  subtitle: string
  image: string
  ctaLabel: string
  ctaHref: string
}

export const heroSlides: HeroSlide[] = [
  {
    id: 'main-commerce',
    category: 'Jamm Trade',
    title: 'From essentials to enterprise.',
    subtitle: 'Curated fragrances, fashion, and everyday goods selected with intention.',
    image: '/images/hero-main-commerce.jpg',
    ctaLabel: 'Explore Products',
    ctaHref: '/shop',
  },
  {
    id: 'perfumes',
    category: 'Fragrances',
    title: 'Signature scents, selected with care.',
    subtitle: 'Oud, amber, rose, musk, and everyday fragrances chosen for presence and balance.',
    image: '/images/hero-perfumes.jpg',
    ctaLabel: 'Shop Perfumes',
    ctaHref: '/shop#perfumes',
  },
  {
    id: 'electronics',
    category: 'Electronics',
    title: 'Everyday tech, refined.',
    subtitle: 'Useful electronics and accessories selected for quality, simplicity, and daily use.',
    image: '/images/hero-electronics.jpg',
    ctaLabel: 'Shop Electronics',
    ctaHref: '/shop#electronics',
  },
  {
    id: 'clothing',
    category: 'Clothing',
    title: 'Wear the mark.',
    subtitle: 'Minimal clothing pieces built around comfort, identity, and quiet detail.',
    image: '/images/hero-clothing.jpg',
    ctaLabel: 'Shop Clothing',
    ctaHref: '/shop#clothing',
  },
]
