export interface HeroSlide {
  id: string
  i18nKey: 'main' | 'perfumes' | 'electronics' | 'clothing' | 'ecosystem'
  category: string
  title: string
  subtitle: string
  image: string
  imagePosition?: string
  video?: string
  poster?: string
  ctaLabel: string
  ctaHref: string
  secondaryCtaLabel?: string
  secondaryCtaHref?: string
}

export const heroSlides: HeroSlide[] = [
  {
    id: 'main-commerce',
    i18nKey: 'main',
    category: 'Jamm Trade',
    title: 'From essentials to enterprise.',
    subtitle: 'Curated fragrances, fashion, and everyday goods selected with intention.',
    image: '/images/hero-main-commerce.webp',
    imagePosition: 'center center',
    video: '/videos/jamm-trade-cinematic-hero.mp4',
    poster: '/images/jamm-trade-ecosystem-poster-1600.jpg',
    ctaLabel: 'Explore Products',
    ctaHref: '/shop',
  },
  {
    id: 'perfumes',
    i18nKey: 'perfumes',
    category: 'Fragrances',
    title: 'Signature scents, selected with care.',
    subtitle: 'Oud, amber, rose, musk, and everyday fragrances chosen for presence and balance.',
    image: '/images/hero-perfumes.webp',
    imagePosition: 'center center',
    video: '/videos/jamm-trade-cinematic-hero.mp4',
    poster: '/images/jamm-trade-ecosystem-poster-1600.jpg',
    ctaLabel: 'Shop Perfumes',
    ctaHref: '/shop#perfumes',
  },
  {
    id: 'electronics',
    i18nKey: 'electronics',
    category: 'Electronics',
    title: 'Everyday tech, refined.',
    subtitle: 'Useful electronics and accessories selected for quality, simplicity, and daily use.',
    image: '/images/hero-electronics.webp',
    imagePosition: 'center 42%',
    video: '/videos/jamm-trade-cinematic-hero.mp4',
    poster: '/images/jamm-trade-ecosystem-poster-1600.jpg',
    ctaLabel: 'Shop Electronics',
    ctaHref: '/shop#electronics',
  },
  {
    id: 'clothing',
    i18nKey: 'clothing',
    category: 'Clothing',
    title: 'Wear the mark.',
    subtitle: 'Minimal clothing pieces built around comfort, identity, and quiet detail.',
    image: '/images/hero-clothing.webp',
    imagePosition: 'center 34%',
    video: '/videos/jamm-trade-cinematic-hero.mp4',
    poster: '/images/jamm-trade-ecosystem-poster-1600.jpg',
    ctaLabel: 'Shop Clothing',
    ctaHref: '/shop/collection/clothing',
  },
  {
    id: 'ecosystem',
    i18nKey: 'ecosystem',
    category: 'Jamm Trade Ecosystem',
    title: 'From essentials to enterprise.',
    subtitle: 'Luxury fragrances, technology, apparel, mobility and logistics — connected through one ecosystem.',
    image: '/images/jamm-trade-ecosystem-poster-1600.jpg',
    imagePosition: 'center center',
    poster: '/images/jamm-trade-ecosystem-poster-1600.jpg',
    ctaLabel: 'Explore Collections',
    ctaHref: '#collections',
    secondaryCtaLabel: 'Discover Our Services',
    secondaryCtaHref: '/jamm-fleet',
  },
]
