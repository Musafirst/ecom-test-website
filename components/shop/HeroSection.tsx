'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'

const HOLD = 6000
const HOLD_ECO = 9000

const slides = ['clothing', 'fragrance', 'audio', 'house', 'eco'] as const

const hotspots = [
  { href: '/jamm-fleet', style: { left: '23.5%', top: '43%' }, label: 'Jamm Fleet', aria: 'Jamm Fleet' },
  { href: '/jamm-cargo', style: { left: '58%', top: '33%' }, label: 'Jamm Cargo', aria: 'Jamm Cargo' },
  { href: '/shop/category/perfumes', style: { left: '30%', top: '71%' }, label: 'Fragrance', aria: 'Fragrance collection' },
  { href: '/shop/category/electronics', style: { left: '64%', top: '72%' }, label: 'Electronics', aria: 'Electronics collection' },
  { href: '/shop/collection/clothing', style: { left: '86%', top: '46%' }, label: 'Apparel', aria: 'Apparel collection' },
]

export function HeroSection() {
  const [index, setIndex] = useState(0)
  const [openHotspot, setOpenHotspot] = useState<number | null>(null)
  const timerRef = useRef<number | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  const schedule = useCallback((ms: number) => {
    if (timerRef.current) window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => setIndex((i) => (i + 1) % slides.length), ms)
  }, [])

  useEffect(() => {
    schedule(slides[index] === 'eco' ? HOLD_ECO : HOLD)
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current)
    }
  }, [index, schedule])

  const go = (n: number) => setIndex((n + slides.length) % slides.length)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight') setIndex((i) => (i + 1) % slides.length)
      else if (e.key === 'ArrowLeft') setIndex((i) => (i - 1 + slides.length) % slides.length)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const kick = () => {
      v.muted = true
      v.play().catch(() => {})
    }
    kick()
    v.addEventListener('canplay', kick, { once: true })
    const onVis = () => {
      if (!document.hidden) kick()
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  const touch = useRef({ x: 0, y: 0 })
  const onTouchStart = (e: React.TouchEvent) => {
    touch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touch.current.x
    const dy = e.changedTouches[0].clientY - touch.current.y
    if (Math.abs(dx) > 46 && Math.abs(dx) > Math.abs(dy)) go(index + (dx < 0 ? 1 : -1))
  }

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!(e.target as HTMLElement).closest('.hotspot')) setOpenHotspot(null)
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [])

  const handleHotspot = (e: React.MouseEvent, i: number) => {
    if (window.matchMedia('(hover: none)').matches && openHotspot !== i) {
      e.preventDefault()
      setOpenHotspot(i)
      if (timerRef.current) window.clearTimeout(timerRef.current)
    }
  }

  return (
    <section className="hero-wrap" id="ecosystem">
      <div className="container">
        <div className="hero">
          <div
            className="hero__stage"
            onMouseEnter={() => timerRef.current && window.clearTimeout(timerRef.current)}
            onMouseLeave={() => schedule(slides[index] === 'eco' ? HOLD_ECO : HOLD)}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <div className="hero__media">
              <div className="hero__media-inner">
                <video
                  ref={videoRef}
                  className="hero__video"
                  src="/videos/jamm-trade-cinematic-hero.mp4"
                  poster="/images/jamm-trade-ecosystem-poster-1600.jpg"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                />
              </div>
            </div>

            <article className={`slide slide--clothing${index === 0 ? ' is-active' : ''}`}>
              <div className="slide__bg"><div className="slide__glow" /></div>
              <div className="slide__frame" />
              <div className="slide__content">
                <p className="slide__eyebrow">Clothing</p>
                <h2 className="slide__title">Wear the <em>mark.</em></h2>
                <p className="slide__sub">Hoodies, tees and everyday essentials carrying the Jamm Trade lotus — quiet, considered, unmistakable.</p>
                <div className="slide__cta"><Link className="btn btn--gold" href="/shop/collection/clothing">Shop Clothing</Link></div>
              </div>
            </article>

            <article className={`slide slide--fragrance${index === 1 ? ' is-active' : ''}`}>
              <div className="slide__bg"><div className="slide__glow" /></div>
              <div className="slide__frame" />
              <div className="slide__content">
                <p className="slide__eyebrow">Signature Scents</p>
                <h2 className="slide__title">Scents that <em>linger.</em></h2>
                <p className="slide__sub">Rare Arabic oud, warm amber and clean daily signatures — curated for those who know the difference.</p>
                <div className="slide__cta"><Link className="btn btn--gold" href="/shop/category/perfumes">Shop Fragrance</Link></div>
              </div>
            </article>

            <article className={`slide slide--audio${index === 2 ? ' is-active' : ''}`}>
              <div className="slide__bg"><div className="slide__glow" /></div>
              <div className="slide__frame" />
              <div className="slide__content">
                <p className="slide__eyebrow">Electronics</p>
                <h2 className="slide__title">Sound, <em>refined.</em></h2>
                <p className="slide__sub">Premium audio and everyday technology, chosen with the same eye for quality and focus.</p>
                <div className="slide__cta"><Link className="btn btn--gold" href="/shop/category/electronics">Shop Electronics</Link></div>
              </div>
            </article>

            <article className={`slide slide--house${index === 3 ? ' is-active' : ''}`}>
              <div className="slide__bg"><div className="slide__glow" /></div>
              <div className="slide__frame" />
              <div className="slide__content">
                <p className="slide__eyebrow">The House of Jamm</p>
                <h2 className="slide__title">From essentials<br />to <em>enterprise.</em></h2>
                <p className="slide__sub">One trusted name across every category we touch — fragrance, apparel, electronics and the fleet that moves them.</p>
                <div className="slide__cta"><Link className="btn btn--gold" href="/shop">Explore the House</Link></div>
              </div>
            </article>

            <article className={`slide slide--eco${index === 4 ? ' is-active' : ''}`}>
              <div className="eco-stage">
                {hotspots.map((h, i) => (
                  <Link
                    key={h.href}
                    className={`hotspot${openHotspot === i ? ' is-open' : ''}`}
                    href={h.href}
                    style={h.style}
                    aria-label={h.aria}
                    onClick={(e) => handleHotspot(e, i)}
                  >
                    <span className="hotspot__pulse" />
                    <span className="hotspot__ring" />
                    <span className="hotspot__label"><b>{h.label}&nbsp;→</b></span>
                  </Link>
                ))}
              </div>
              <div className="eco-caption">
                <p className="slide__eyebrow">The Jamm Ecosystem</p>
                <h2 className="eco-caption__title">One house. Every essential.</h2>
                <p className="eco-caption__hint"><span className="pulse-dot" /> Tap a point to explore</p>
              </div>
            </article>

            <button className="hero__arrow hero__arrow--prev" aria-label="Previous slide" onClick={() => go(index - 1)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 5l-7 7 7 7" /></svg>
            </button>
            <button className="hero__arrow hero__arrow--next" aria-label="Next slide" onClick={() => go(index + 1)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 5l7 7-7 7" /></svg>
            </button>
            <div className="hero__dots">
              {slides.map((s, i) => (
                <button
                  key={s}
                  className={`dot${index === i ? ' is-active' : ''}`}
                  aria-label={`Slide ${i + 1}`}
                  onClick={() => go(i)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
