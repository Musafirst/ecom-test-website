'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LanguageSelector } from '@/components/i18n/LocaleProvider'

const announceItems = [
  'Secure Shopify checkout',
  'Clear shipping options at checkout',
  'Customer support when you need it',
  'Curated products',
]

const navLinks = [
  { label: 'Fragrance', href: '/shop/category/perfumes' },
  { label: 'Collections', href: '/shop#collections' },
  { label: 'Electronics', href: '/shop/category/electronics' },
  { label: 'Guides', href: '/shop/guides' },
  { label: 'Ecosystem', href: '/shop#ecosystem' },
]

export function TabNav() {
  const pathname = usePathname()
  const isShop = pathname.startsWith('/shop') || pathname === '/'
  const [cartCount, setCartCount] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)

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
    if (!menuOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  return (
    <>
      {isShop && (
        <div className="announce">
          <div className="announce__track">
            {[0, 1].map((group) => (
              <div className="announce__group" key={group} aria-hidden={group === 1}>
                {announceItems.map((item) => (
                  <span className="announce__item" key={item}>
                    {item}
                    <span className="dot" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      <header className="header">
        <div className="container header__inner">
          <Link className="brand" href="/shop" aria-label="Jamm Trade home">
            <img className="brand__mark" src="/design/logo-badge.png" alt="Jamm Trade lotus emblem" width={46} height={46} />
            <span className="brand__type">
              <span className="brand__name">JAMM TRADE</span>
              <span className="brand__tag">From Essentials to Enterprise</span>
            </span>
          </Link>

          <nav className="nav-desktop" aria-label="Primary">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>{link.label}</Link>
            ))}
          </nav>

          <div className="header__actions">
            <Link className="icon-btn" href="/shop#fragrance" aria-label="Search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
            </Link>
            <Link className="icon-btn" href="/shop/checkout" aria-label={`Cart${cartCount > 0 ? `, ${cartCount} items` : ''}`}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 6h15l-1.5 9h-12z" /><circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" /><path d="M6 6 5 3H2" /></svg>
              {cartCount > 0 && <span className="cart-count">{cartCount > 9 ? '9+' : cartCount}</span>}
            </Link>
            <button className="icon-btn header__menu" aria-label="Menu" onClick={() => setMenuOpen(true)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="mobile-drawer" role="dialog" aria-modal="true" aria-label="Navigation menu">
          <div className="mobile-drawer__head">
            <span className="brand__name">JAMM TRADE</span>
            <button className="icon-btn" aria-label="Close menu" onClick={() => setMenuOpen(false)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" /></svg>
            </button>
          </div>
          <nav className="mobile-drawer__nav">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>{link.label}</Link>
            ))}
            <Link href="/jamm-fleet" onClick={() => setMenuOpen(false)}>Jamm Fleet</Link>
            <Link href="/jamm-cargo" onClick={() => setMenuOpen(false)}>Jamm Cargo</Link>
          </nav>
          <div className="mobile-drawer__foot">
            <LanguageSelector />
          </div>
        </div>
      )}
    </>
  )
}
