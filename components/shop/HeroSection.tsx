'use client'

import { useEffect, useRef, useState } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion, useSpring, type PanInfo } from 'framer-motion'
import { heroSlides } from '@/lib/heroSlides'
import { BorderBeam } from '@/components/ui/border-beam'
import { useLocale } from '@/components/i18n/LocaleProvider'

const swipeConfidenceThreshold = 80

const ecosystemHotspots = [
  {
    label: 'Shop Apparel',
    href: '/shop/collection/clothing',
    className: 'left-[73%] top-[31%] h-[43%] w-[20%] md:left-[72%] md:top-[27%] md:h-[46%] md:w-[22%]',
  },
  {
    label: 'Shop Fragrances',
    href: '/shop/category/perfumes',
    className: 'left-[25%] top-[52%] h-[31%] w-[19%] md:left-[24%] md:top-[49%] md:h-[34%] md:w-[20%]',
  },
  {
    label: 'Shop Electronics',
    href: '/shop/category/electronics',
    className: 'left-[54%] top-[55%] h-[24%] w-[18%] md:left-[53%] md:top-[53%] md:h-[26%] md:w-[18%]',
  },
  {
    label: 'Rent with Jamm Fleet',
    href: '/jamm-fleet',
    className: 'left-[5%] top-[28%] h-[29%] w-[39%] md:left-[5%] md:top-[27%] md:h-[31%] md:w-[38%]',
  },
  {
    label: 'Ship with Jamm Cargo',
    href: '/jamm-cargo',
    className: 'left-[47%] top-[22%] h-[28%] w-[31%] md:left-[48%] md:top-[20%] md:h-[31%] md:w-[29%]',
  },
]

export function HeroSection() {
  const { t } = useLocale()
  const [activeIndex, setActiveIndex] = useState(0)
  const [isMobileHero, setIsMobileHero] = useState(false)
  const [holdEcosystemPreview, setHoldEcosystemPreview] = useState(false)
  const [autoSlideResetKey, setAutoSlideResetKey] = useState(0)
  const [videoAutoplayBlocked, setVideoAutoplayBlocked] = useState(false)
  const activeVideoRef = useRef<HTMLVideoElement | null>(null)
  const springX = useSpring(0, { stiffness: 80, damping: 20 })
  const springY = useSpring(0, { stiffness: 80, damping: 20 })
  const prefersReducedMotion = useReducedMotion()
  const activeSlide = heroSlides[activeIndex]
  const activeTitle = t(`hero.${activeSlide.i18nKey}.title`)
  const isEcosystemSlide = activeSlide.id === 'ecosystem'

  const resetAutoSlideTimer = () => {
    setAutoSlideResetKey((current) => current + 1)
  }

  const showPreviousSlide = () => {
    setActiveIndex((current) => (current - 1 + heroSlides.length) % heroSlides.length)
  }

  const showNextSlide = () => {
    setActiveIndex((current) => (current + 1) % heroSlides.length)
  }

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeDistance = info.offset.x
    const swipeVelocity = info.velocity.x

    if (swipeDistance < -swipeConfidenceThreshold || swipeVelocity < -500) {
      showNextSlide()
      resetAutoSlideTimer()
      return
    }

    if (swipeDistance > swipeConfidenceThreshold || swipeVelocity > 500) {
      showPreviousSlide()
      resetAutoSlideTimer()
    }
  }

  const handleMouseMove = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (isMobileHero || prefersReducedMotion) return

    const bounds = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width - 0.5
    const y = (event.clientY - bounds.top) / bounds.height - 0.5

    springX.set(x * 18)
    springY.set(y * 12)
  }

  const handleMouseLeave = () => {
    springX.set(0)
    springY.set(0)
  }

  useEffect(() => {
    if (window.location.search.includes('hero=ecosystem')) {
      const ecosystemIndex = heroSlides.findIndex((slide) => slide.id === 'ecosystem')
      if (ecosystemIndex >= 0) setActiveIndex(ecosystemIndex)
      setHoldEcosystemPreview(true)
    }
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 1023px)')
    const syncHeroMode = () => setIsMobileHero(mediaQuery.matches)

    syncHeroMode()
    mediaQuery.addEventListener('change', syncHeroMode)

    return () => mediaQuery.removeEventListener('change', syncHeroMode)
  }, [])

  useEffect(() => {
    if (holdEcosystemPreview) return
    if (prefersReducedMotion) return

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % heroSlides.length)
    }, 6000)

    return () => window.clearInterval(timer)
  }, [autoSlideResetKey, holdEcosystemPreview, prefersReducedMotion])

  useEffect(() => {
    setVideoAutoplayBlocked(false)

    if (!activeSlide.video) return

    const video = activeVideoRef.current
    if (!video) return

    video.defaultMuted = true
    video.muted = true
    video.playsInline = true

    const attemptPlayback = () => {
      const playPromise = video.play()

      if (playPromise !== undefined) {
        playPromise
          .then(() => setVideoAutoplayBlocked(false))
          .catch(() => setVideoAutoplayBlocked(true))
      }
    }

    const retryAfterInteraction = () => {
      attemptPlayback()
      window.removeEventListener('pointerdown', retryAfterInteraction)
      window.removeEventListener('touchstart', retryAfterInteraction)
      window.removeEventListener('click', retryAfterInteraction)
    }

    const frame = window.requestAnimationFrame(attemptPlayback)
    video.addEventListener('loadeddata', attemptPlayback)
    video.addEventListener('canplay', attemptPlayback)
    window.addEventListener('pointerdown', retryAfterInteraction, { once: true, passive: true })
    window.addEventListener('touchstart', retryAfterInteraction, { once: true, passive: true })
    window.addEventListener('click', retryAfterInteraction, { once: true })

    return () => {
      window.cancelAnimationFrame(frame)
      video.removeEventListener('loadeddata', attemptPlayback)
      video.removeEventListener('canplay', attemptPlayback)
      window.removeEventListener('pointerdown', retryAfterInteraction)
      window.removeEventListener('touchstart', retryAfterInteraction)
      window.removeEventListener('click', retryAfterInteraction)
    }
  }, [activeSlide.video, activeIndex])

  return (
    <section className="overflow-x-hidden bg-transparent px-[var(--jamm-pad)] pb-6 pt-[clamp(20px,3vw,34px)] sm:pb-8">
      <motion.div
        className={`relative mx-auto max-w-[1240px] cursor-grab touch-pan-y overflow-hidden rounded-[22px] bg-[linear-gradient(135deg,#e0c074_0%,#c4973a_40%,#8b6914_64%,#e8d09a_100%)] p-[1.5px] shadow-[0_30px_70px_-30px_rgba(0,0,0,0.7)] active:cursor-grabbing ${
          isEcosystemSlide ? 'aspect-[16/9] min-h-0' : 'aspect-[5/6] min-h-0 sm:aspect-[16/10] lg:aspect-[16/9]'
        }`}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        drag={prefersReducedMotion ? false : 'x'}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.08}
        onDragEnd={handleDragEnd}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <BorderBeam size={520} duration={13} borderWidth={3} colorFrom="#C4973A" colorTo="#F8E7A6" />
        <div className="absolute inset-[1.5px] overflow-hidden rounded-[20px] bg-[#050403]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide.id}
              className="absolute inset-0 lg:-inset-5"
              style={isMobileHero ? undefined : { x: springX, y: springY }}
              initial={isMobileHero ? { opacity: 0, y: 12 } : { opacity: 0, scale: 1.04 }}
              animate={isMobileHero ? { opacity: 1, y: 0 } : { opacity: 1, scale: 1 }}
              exit={isMobileHero ? { opacity: 0, y: -8 } : { opacity: 0, scale: 1.01 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              whileHover={isMobileHero ? undefined : { scale: 1.025 }}
            >
              {activeSlide.video ? (
                <>
                  <Image
                    src={activeSlide.poster ?? activeSlide.image}
                    alt=""
                    fill
                    sizes="100vw"
                    quality={82}
                    className="bg-[#101112] object-cover object-center"
                    aria-hidden="true"
                  />
                  <video
                    ref={activeVideoRef}
                    className={`hero-video h-full w-full bg-[#101112] object-cover object-center transition-opacity duration-300 ${
                      videoAutoplayBlocked ? 'opacity-0' : 'opacity-100'
                    }`}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    poster={activeSlide.poster ?? activeSlide.image}
                    aria-label={activeTitle}
                    controls={false}
                    disablePictureInPicture
                    onPlaying={() => setVideoAutoplayBlocked(false)}
                    onError={() => setVideoAutoplayBlocked(true)}
                  >
                    <source src={activeSlide.video} type="video/mp4" />
                  </video>
                </>
              ) : (
                <Image
                  src={activeSlide.image}
                  alt={activeTitle}
                  fill
                  sizes="100vw"
                  quality={82}
                  priority={activeIndex === 0}
                  className={`${isEcosystemSlide ? 'object-contain lg:object-cover' : 'object-cover'} bg-[#101112] object-center`}
                  style={{ objectPosition: activeSlide.imagePosition ?? 'center center' }}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="absolute inset-[1.5px] rounded-[20px] border border-[#e7cd8e]/30 bg-[linear-gradient(180deg,rgba(8,7,5,0.30)_0%,rgba(8,7,5,0.10)_32%,rgba(8,7,5,0.62)_74%,rgba(6,5,3,0.95)_100%),linear-gradient(75deg,rgba(6,5,3,0.72)_0%,rgba(6,5,3,0.18)_46%,transparent_70%)]" />
        {isEcosystemSlide && (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_48%,rgba(196,151,58,0.18),transparent_30%),radial-gradient(circle_at_34%_70%,rgba(248,231,166,0.12),transparent_28%)]" />
        )}

        {isEcosystemSlide && (
          <div className="absolute inset-0 z-10">
            {ecosystemHotspots.map((hotspot) => (
              <Link
                key={hotspot.href}
                href={hotspot.href}
                aria-label={hotspot.label}
                className={`group absolute ${hotspot.className} rounded-[18px] outline-none transition duration-300 hover:bg-jamm-gold/10 focus-visible:bg-jamm-gold/14 focus-visible:ring-2 focus-visible:ring-jamm-gold/80`}
                onClick={resetAutoSlideTimer}
              >
                <span className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-jamm-gold/45 bg-jamm-dark/20 opacity-0 shadow-[0_0_22px_rgba(196,151,58,0.32)] backdrop-blur-sm transition duration-300 group-hover:opacity-100 group-focus-visible:opacity-100" />
                <span className="pointer-events-none absolute left-1/2 top-[calc(50%+18px)] -translate-x-1/2 whitespace-nowrap rounded-full border border-jamm-gold/35 bg-jamm-dark/72 px-3 py-1.5 font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-jamm-cream opacity-0 shadow-[0_16px_36px_rgba(0,0,0,0.34)] backdrop-blur-md transition duration-300 group-hover:translate-y-1 group-hover:opacity-100 group-focus-visible:translate-y-1 group-focus-visible:opacity-100">
                  {hotspot.label}
                </span>
              </Link>
            ))}
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col items-start gap-3 p-[clamp(26px,6vw,52px)] sm:gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-6">
          {!isEcosystemSlide && (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide.id}
                className="relative w-full max-w-[640px] overflow-visible border-0 bg-transparent p-0 text-jamm-cream shadow-none backdrop-blur-0"
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="mb-3 hidden items-center gap-3 font-sans text-[11px] font-semibold uppercase tracking-[0.3em] text-jamm-gold-light before:h-px before:w-8 before:bg-jamm-gold-light sm:mb-4 lg:flex">
                  {t(`hero.${activeSlide.i18nKey}.category`)}
                </p>
                <h1 className="mb-3 font-serif text-[clamp(2.7rem,9vw,5rem)] font-semibold leading-[0.98] tracking-[-0.01em] text-white [text-shadow:0_2px_30px_rgba(0,0,0,0.5)] lg:mb-4 lg:text-[clamp(3.4rem,5vw,5.4rem)]">
                  {activeTitle}
                </h1>
                <p className="mb-5 hidden font-sans text-sm leading-relaxed text-jamm-cream/86 sm:text-[15px] md:text-base lg:mb-7 lg:block">
                  {t(`hero.${activeSlide.i18nKey}.subtitle`)}
                </p>
                <Link
                  href={activeSlide.ctaHref}
                  className="inline-flex min-h-11 items-center rounded-[11px] bg-[linear-gradient(135deg,#e0c074_0%,#c4973a_40%,#8b6914_64%,#e8d09a_100%)] px-6 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-[#231c0a] shadow-[0_10px_26px_-14px_rgba(150,110,30,0.85)] transition-transform duration-300 hover:-translate-y-0.5 lg:min-h-12"
                  onClick={resetAutoSlideTimer}
                >
                  {t(`hero.${activeSlide.i18nKey}.cta`)}
                </Link>
                <BorderBeam size={240} duration={9} borderWidth={2.5} colorFrom="#C4973A" colorTo="#F8E7A6" />
              </motion.div>
            </AnimatePresence>
          )}

          <div className="absolute inset-x-0 bottom-4 flex min-w-[120px] items-center justify-center gap-2 py-1 lg:bottom-6">
            {heroSlides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                aria-label={`Show ${t(`hero.${slide.i18nKey}.title`)}`}
                aria-current={index === activeIndex ? true : undefined}
                onClick={() => {
                  setActiveIndex(index)
                  resetAutoSlideTimer()
                }}
                className="flex min-h-8 min-w-8 items-center justify-center"
              >
                <span className={`block h-[9px] rounded-full transition-all duration-300 ${
                  index === activeIndex ? 'w-[30px] bg-[linear-gradient(135deg,#e0c074,#a37d20)]' : 'w-[9px] bg-[#e7cd8e]/35'
                }`} />
              </button>
            ))}
          </div>
          <span className="sr-only" aria-live="polite" aria-atomic="true">
            {activeTitle}
          </span>
        </div>
      </motion.div>
    </section>
  )
}
