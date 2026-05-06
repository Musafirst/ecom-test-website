'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

const tabs = [
  { label: 'Shop', href: '/shop', soon: false },
  { label: 'Collections', href: '/shop#collections', soon: false, shopOnly: true },
  { label: 'Jamm Fleet', href: '/jamm-fleet', soon: true },
  { label: 'Jamm Cargo', href: '/jamm-cargo', soon: true },
]

export function TabNav() {
  const pathname = usePathname()
  const isShop = pathname.startsWith('/shop') || pathname === '/'
  const [mobileOpen, setMobileOpen] = useState(false)

  const visibleTabs = tabs.filter((tab) => isShop || !tab.shopOnly)

  return (
    <>
      <header className="relative z-50 bg-[#FAF7F2] px-3 pt-3 sm:px-4">
        {isShop && (
          <div className="overflow-hidden rounded-xl bg-jamm-dark py-2 text-center font-sans text-[11px] font-medium text-jamm-cream">
            <div className="flex whitespace-nowrap animate-marquee">
              <span className="px-8">
                Save 20% on your first order&nbsp;&nbsp;-&nbsp;&nbsp;New fragrance arrivals weekly&nbsp;&nbsp;-&nbsp;&nbsp;Curated perfume essentials&nbsp;&nbsp;-&nbsp;&nbsp;
              </span>
              <span className="px-8" aria-hidden>
                Save 20% on your first order&nbsp;&nbsp;-&nbsp;&nbsp;New fragrance arrivals weekly&nbsp;&nbsp;-&nbsp;&nbsp;Curated perfume essentials&nbsp;&nbsp;-&nbsp;&nbsp;
              </span>
            </div>
          </div>
        )}

        <div className="mx-auto flex h-[118px] w-full max-w-[1560px] items-center justify-between overflow-hidden rounded-b-[22px] bg-[#FAF7F2] px-2 sm:h-[138px] sm:px-6 md:h-[133px] md:overflow-visible">
          <Link href="/shop" className="flex flex-shrink-0 items-center overflow-visible">
            <Image
              src="/brand_assets/logos/jamm-trade-exact-transparent.png"
              alt="Jamm Trade"
              width={1536}
              height={1024}
              className="h-[119px] w-auto flex-shrink-0 object-contain sm:h-[142px] md:h-[280px] lg:h-[340px] xl:h-[389px]"
              priority
            />
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {visibleTabs.map((tab) => {
              const isActive = pathname === tab.href
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`rounded-full px-4 py-2 font-sans text-sm transition-colors duration-200 ${
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
            {isShop && (
              <>
                <Link
                  href="/shop#perfumes"
                  aria-label="Search products"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-jamm-dark/60 transition-colors duration-200 hover:bg-jamm-dark/6 hover:text-jamm-dark md:h-10 md:w-10"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden>
                    <circle cx="11" cy="11" r="6" />
                    <path d="m16 16 4 4" />
                  </svg>
                </Link>
                <Link
                  href="mailto:contact@jammtrade.com"
                  aria-label="Cart"
                  className="hidden h-10 items-center justify-center rounded-full px-3 font-sans text-sm text-jamm-dark/60 transition-colors duration-200 hover:bg-jamm-dark/6 hover:text-jamm-dark md:flex"
                >
                  Cart (0)
                </Link>
                <Link
                  href="mailto:contact@jammtrade.com"
                  aria-label="Cart"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-jamm-dark/60 transition-colors duration-200 hover:bg-jamm-dark/6 hover:text-jamm-dark md:hidden"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden>
                    <path d="M6 7h13l-1.2 8.2a2 2 0 0 1-2 1.8H8.4a2 2 0 0 1-2-1.7L5 4H3" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="9" cy="20" r="1" />
                    <circle cx="17" cy="20" r="1" />
                  </svg>
                </Link>
              </>
            )}
            {!isShop && (
              <Link
                href="mailto:contact@jammtrade.com"
                className="hidden rounded-full border border-jamm-gold/40 px-4 py-2 font-sans text-sm text-jamm-dark/70 transition-colors duration-200 hover:border-jamm-gold hover:text-jamm-dark sm:inline-flex"
              >
                Contact
              </Link>
            )}

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
              className="flex h-9 w-9 items-center justify-center rounded-full text-jamm-dark/60 transition-colors duration-200 hover:bg-jamm-dark/6 hover:text-jamm-dark md:hidden"
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
            className="fixed inset-0 z-[100] flex flex-col bg-[#FAF7F2]"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex w-full items-center justify-between overflow-visible border-b border-jamm-dark/10 px-5 py-4">
              <Link href="/shop" onClick={() => setMobileOpen(false)} className="flex flex-shrink-0 items-center overflow-visible">
                <Image
                  src="/brand_assets/logos/jamm-trade-exact-transparent.png"
                  alt="Jamm Trade"
                  width={1536}
                  height={1024}
                  className="h-[108px] w-auto flex-shrink-0 object-contain"
                  priority
                />
              </Link>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="flex h-10 w-10 items-center justify-center rounded-full text-jamm-dark/60 transition-colors duration-200 hover:bg-jamm-dark/6 hover:text-jamm-dark"
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
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={tab.href}
                    onClick={() => setMobileOpen(false)}
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
            </nav>

            <div className="mt-auto border-t border-jamm-dark/10 px-5 py-5">
              <Link
                href="mailto:contact@jammtrade.com"
                onClick={() => setMobileOpen(false)}
                className="font-sans text-sm text-jamm-dark/40 transition-colors duration-200 hover:text-jamm-gold"
              >
                contact@jammtrade.com
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
