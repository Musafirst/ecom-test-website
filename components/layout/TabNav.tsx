'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { site } from '@/lib/site'

const tabs = [
  { label: 'Shop', href: '/shop', soon: false },
  { label: 'Collections', href: '/shop#collections', soon: false, shopOnly: true },
]

const serviceLinks = [
  { label: 'Jamm Fleet', href: '/jamm-fleet', description: 'Vehicle rental inquiries' },
  { label: 'Jamm Cargo', href: '/jamm-cargo', description: 'Shipping quote requests' },
]

const liveSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? site.defaultUrl

export function TabNav() {
  const pathname = usePathname()
  const isShop = pathname.startsWith('/shop') || pathname === '/'
  const logoHref = pathname.startsWith('/shop/checkout') ? liveSiteUrl : '/shop'
  const [mobileOpen, setMobileOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const servicesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 48)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    function syncCart() {
      try {
        const stored = window.localStorage.getItem('jamm-trade-cart')
        const items = stored ? (JSON.parse(stored) as { handle: string; quantity: number }[]) : []
        setCartCount(items.reduce((sum, item) => sum + item.quantity, 0))
      } catch {
        setCartCount(0)
      }
    }
    syncCart()
    window.addEventListener('cart-updated', syncCart)
    window.addEventListener('storage', syncCart)
    return () => {
      window.removeEventListener('cart-updated', syncCart)
      window.removeEventListener('storage', syncCart)
    }
  }, [])

  useEffect(() => {
    if (!mobileOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [mobileOpen])

  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (!servicesRef.current?.contains(e.target as Node)) {
        setServicesOpen(false)
      }
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setServicesOpen(false)
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  const visibleTabs = tabs.filter((tab) => isShop || !tab.shopOnly)

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#FAF7F2]/86 px-3 pt-3 backdrop-blur-md sm:px-4">
        {isShop && (
          <div className="overflow-hidden rounded-lg bg-jamm-dark py-1.5 text-center font-sans text-[10px] font-medium text-jamm-cream sm:rounded-xl sm:py-2 sm:text-[11px]">
            <div className="flex whitespace-nowrap animate-marquee">
              <span className="px-8">
                Free shipping&nbsp;&nbsp;-&nbsp;&nbsp;Save 20% on your first order&nbsp;&nbsp;-&nbsp;&nbsp;New fragrance arrivals weekly&nbsp;&nbsp;-&nbsp;&nbsp;Curated perfume essentials&nbsp;&nbsp;-&nbsp;&nbsp;
              </span>
              <span className="px-8" aria-hidden>
                Free shipping&nbsp;&nbsp;-&nbsp;&nbsp;Save 20% on your first order&nbsp;&nbsp;-&nbsp;&nbsp;New fragrance arrivals weekly&nbsp;&nbsp;-&nbsp;&nbsp;Curated perfume essentials&nbsp;&nbsp;-&nbsp;&nbsp;
              </span>
            </div>
          </div>
        )}

        <div className={`mx-auto flex h-[78px] w-full max-w-[1560px] items-center justify-between overflow-hidden rounded-b-[18px] px-2 backdrop-blur-sm transition-[background-color,backdrop-filter,box-shadow] duration-200 sm:h-[104px] sm:rounded-b-[22px] sm:px-5 md:h-[112px] md:overflow-visible lg:h-[120px] ${scrolled ? 'bg-[#FAF7F2]/95 shadow-[0_10px_30px_rgba(12,11,9,0.06)]' : 'bg-[#FAF7F2]/78'}`}>
          <Link href={logoHref} className="flex flex-shrink-0 items-center overflow-visible">
            <Image
              src="/brand_assets/logos/jamm-trade-exact-transparent.webp"
              alt="Jamm Trade"
              width={1536}
              height={1024}
              className="h-[72px] w-auto flex-shrink-0 object-contain sm:h-[88px] md:h-[96px] lg:h-[108px] xl:h-[120px]"
              priority
              loading="eager"
            />
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {visibleTabs.map((tab) => {
              const isActive = pathname === tab.href || (tab.href === '/shop#collections' && pathname === '/shop')
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`rounded-full px-4 py-2 font-sans text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'bg-jamm-gold/15 text-jamm-dark'
                      : 'text-jamm-dark/55 hover:bg-jamm-dark/6 hover:text-jamm-dark'
                  }`}
                >
                  {tab.label}
                  {tab.soon && <span className="ml-2 text-[10px] text-jamm-gold">Soon</span>}
                </Link>
              )
            })}
          </nav>

          <div className="flex flex-shrink-0 items-center gap-0.5 md:gap-1 md:pt-0">
            <div
              ref={servicesRef}
              className="group relative hidden md:block"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={servicesOpen}
                onClick={() => setServicesOpen((open) => !open)}
                className="inline-flex h-10 items-center gap-2 rounded-full px-3.5 font-sans text-sm font-medium text-jamm-dark/55 transition-colors duration-200 hover:bg-jamm-dark/6 hover:text-jamm-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jamm-gold focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF7F2]"
              >
                Services
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${servicesOpen ? 'rotate-180' : ''}`}
                  aria-hidden
                >
                  <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <AnimatePresence>
                {servicesOpen && (
                  <motion.div
                    role="menu"
                    aria-label="Jamm services"
                    className="absolute right-0 top-[calc(100%+10px)] w-64 overflow-hidden rounded-lg border border-jamm-gold/25 bg-[#FAF7F2] p-2 shadow-[0_18px_45px_rgba(12,11,9,0.12)]"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4, transition: { duration: 0.14 } }}
                    transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {serviceLinks.map((service) => (
                      <Link
                        key={service.href}
                        href={service.href}
                        role="menuitem"
                        onClick={() => setServicesOpen(false)}
                        className="block rounded-md px-3 py-3 transition-colors duration-200 hover:bg-jamm-gold/10 focus-visible:bg-jamm-gold/10 focus-visible:outline-none"
                      >
                        <span className="block font-sans text-sm font-semibold text-jamm-dark">{service.label}</span>
                        <span className="mt-0.5 block font-sans text-xs leading-relaxed text-jamm-dark/52">{service.description}</span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {isShop && (
              <>
                <Link
                  href="/shop#perfumes"
                  aria-label="Search products"
                  className="flex h-11 w-11 items-center justify-center rounded-full text-jamm-dark/60 transition-colors duration-200 hover:bg-jamm-dark/6 hover:text-jamm-dark"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden>
                    <circle cx="11" cy="11" r="6" />
                    <path d="m16 16 4 4" />
                  </svg>
                </Link>
                <Link
                  href="/shop/checkout"
                  aria-label={`Cart${cartCount > 0 ? `, ${cartCount} item${cartCount > 1 ? 's' : ''}` : ''}`}
                  className="relative hidden h-10 items-center justify-center rounded-full px-3 font-sans text-sm text-jamm-dark/60 transition-colors duration-200 hover:bg-jamm-dark/6 hover:text-jamm-dark md:flex"
                >
                  Cart
                  {cartCount > 0 && (
                    <span className="ml-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-jamm-gold px-1 font-sans text-[9px] font-bold text-jamm-dark">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </Link>
                <Link
                  href="/shop/checkout"
                  aria-label={`Cart${cartCount > 0 ? `, ${cartCount} item${cartCount > 1 ? 's' : ''}` : ''}`}
                  className="relative flex h-11 w-11 items-center justify-center rounded-full text-jamm-dark/60 transition-colors duration-200 hover:bg-jamm-dark/6 hover:text-jamm-dark md:hidden"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden>
                    <path d="M6 7h13l-1.2 8.2a2 2 0 0 1-2 1.8H8.4a2 2 0 0 1-2-1.7L5 4H3" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="9" cy="20" r="1" />
                    <circle cx="17" cy="20" r="1" />
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute right-0.5 top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-jamm-gold px-1 font-sans text-[9px] font-bold leading-none text-jamm-dark">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </Link>
              </>
            )}
            {!isShop && (
              <Link
                href="/shop/contact"
                className="hidden rounded-full border border-jamm-gold/40 px-4 py-2 font-sans text-sm text-jamm-dark/70 transition-colors duration-200 hover:border-jamm-gold hover:text-jamm-dark sm:inline-flex"
              >
                Contact
              </Link>
            )}

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="flex h-11 w-11 items-center justify-center rounded-full text-jamm-dark/60 transition-colors duration-200 hover:bg-jamm-dark/6 hover:text-jamm-dark md:hidden"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden>
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            className="fixed inset-0 z-[100] flex max-h-[100dvh] flex-col overflow-y-auto bg-[#FAF7F2]/95 backdrop-blur-sm"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%', transition: { duration: 0.22, ease: [0.32, 0.72, 0, 1] } }}
            transition={{ duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
          >
            <div className="flex w-full items-center justify-between overflow-visible border-b border-jamm-dark/10 px-5 py-3">
              <Link href={logoHref} onClick={() => setMobileOpen(false)} className="flex flex-shrink-0 items-center overflow-visible">
                <Image
                  src="/brand_assets/logos/jamm-trade-exact-transparent.webp"
                  alt="Jamm Trade"
                  width={1536}
                  height={1024}
                  className="h-[88px] w-auto flex-shrink-0 object-contain"
                  priority
                  loading="eager"
                />
              </Link>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="flex h-11 w-11 items-center justify-center rounded-full text-jamm-dark/60 transition-colors duration-200 hover:bg-jamm-dark/6 hover:text-jamm-dark"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden>
                  <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <nav className="flex flex-col gap-1 px-4 pt-6">
              {visibleTabs.map((tab, i) => (
                <motion.div
                  key={tab.href}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={tab.href}
                    onClick={() => setMobileOpen(false)}
                    aria-current={pathname === tab.href ? 'page' : undefined}
                    className="flex items-center justify-between rounded-[14px] px-4 py-4 font-sans text-lg font-medium text-jamm-dark transition-colors duration-200 hover:bg-jamm-dark/6"
                  >
                    {tab.label}
                    {tab.soon && (
                      <span className="rounded-full border border-jamm-gold/50 px-2.5 py-1 font-sans text-[10px] font-medium uppercase tracking-[0.14em] text-jamm-gold">
                        Soon
                      </span>
                    )}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: visibleTabs.length * 0.06, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-[14px] border border-jamm-gold/18 bg-[#EDE8DC]/55"
              >
                <button
                  type="button"
                  aria-expanded={mobileServicesOpen}
                  className="flex w-full items-center justify-between rounded-[14px] px-4 py-4 font-sans text-lg font-medium text-jamm-dark transition-colors duration-200 hover:bg-jamm-dark/6"
                  onClick={() => setMobileServicesOpen((open) => !open)}
                >
                  Services
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className={`h-4 w-4 transition-transform duration-200 ${mobileServicesOpen ? 'rotate-180' : ''}`}
                    aria-hidden
                  >
                    <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <AnimatePresence initial={false}>
                  {mobileServicesOpen && (
                    <motion.div
                      className="grid overflow-hidden"
                      initial={{ gridTemplateRows: '0fr', opacity: 0 }}
                      animate={{ gridTemplateRows: '1fr', opacity: 1 }}
                      exit={{ gridTemplateRows: '0fr', opacity: 0 }}
                      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <div className="min-h-0 px-2 pb-2">
                        {serviceLinks.map((service) => (
                          <Link
                            key={service.href}
                            href={service.href}
                            onClick={() => setMobileOpen(false)}
                            className="block rounded-md px-3 py-3 font-sans transition-colors duration-200 hover:bg-jamm-gold/10"
                          >
                            <span className="block text-base font-semibold text-jamm-dark">{service.label}</span>
                            <span className="mt-0.5 block text-xs leading-relaxed text-jamm-dark/52">{service.description}</span>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </nav>

            <div className="mt-auto border-t border-jamm-dark/10 px-5 py-5 flex flex-col gap-2">
              <Link
                href="/shop/about"
                onClick={() => setMobileOpen(false)}
                className="font-sans text-sm text-jamm-dark/55 transition-colors duration-200 hover:text-jamm-gold"
              >
                About Jamm Trade
              </Link>
              <Link
                href="/shop/contact"
                onClick={() => setMobileOpen(false)}
                className="font-sans text-sm text-jamm-dark/40 transition-colors duration-200 hover:text-jamm-gold"
              >
                Contact
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
