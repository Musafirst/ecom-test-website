'use client'

import { useEffect, useState } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion, type PanInfo } from 'framer-motion'
import { heroSlides } from '@/lib/heroSlides'
import { BorderBeam } from '@/components/ui/border-beam'

const swipeConfidenceThreshold = 80

export function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isMobileHero, setIsMobileHero] = useState(false)
  const [autoSlideResetKey, setAutoSlideResetKey] = useState(0)
  const [parallaxOffset, setParallaxOffset] = useState({ x: 0, y: 0 })
  const activeSlide = heroSlides[activeIndex]

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
    if (isMobileHero) return

    const bounds = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width - 0.5
    const y = (event.clientY - bounds.top) / bounds.height - 0.5

    setParallaxOffset({ x: x * 18, y: y * 12 })
  }

  const handleMouseLeave = () => {
    setParallaxOffset({ x: 0, y: 0 })
  }

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 1023px)')
    const syncHeroMode = () => setIsMobileHero(mediaQuery.matches)

    syncHeroMode()
    mediaQuery.addEventListener('change', syncHeroMode)

    return () => mediaQuery.removeEventListener('change', syncHeroMode)
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % heroSlides.length)
    }, 6000)

    return () => window.clearInterval(timer)
  }, [autoSlideResetKey])

  return (
    <section className="overflow-x-hidden bg-transparent px-3 pb-10 pt-1 sm:px-4 sm:pb-14 lg:pb-20">
      <motion.div
        className="relative mx-auto h-[480px] max-w-[1560px] cursor-grab touch-pan-y overflow-hidden rounded-[20px] border border-jamm-gold/35 bg-[#101112] shadow-[0_24px_70px_rgba(12,11,9,0.12)] active:cursor-grabbing sm:h-[560px] sm:rounded-[24px] md:h-[600px] lg:min-h-[620px] lg:rounded-[28px]"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.08}
        onDragEnd={handleDragEnd}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <BorderBeam size={520} duration={13} borderWidth={3} colorFrom="#C4973A" colorTo="#F8E7A6" />
        <div className="absolute inset-0 h-full overflow-hidden bg-[#101112]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide.id}
              className="absolute -inset-3 lg:-inset-5"
              style={isMobileHero ? undefined : { x: parallaxOffset.x, y: parallaxOffset.y }}
              initial={isMobileHero ? { opacity: 0, scale: 1.03, y: 12 } : { opacity: 0, scale: 1.04 }}
              animate={isMobileHero ? { opacity: 1, scale: 1, y: 0 } : { opacity: 1, scale: 1 }}
              exit={isMobileHero ? { opacity: 0, scale: 1.01, y: -8 } : { opacity: 0, scale: 1.01 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              whileHover={isMobileHero ? undefined : { scale: 1.025 }}
            >
              <img
                src={activeSlide.image}
                alt={activeSlide.title}
                className="h-full w-full object-cover object-center"
                fetchPriority={activeIndex === 0 ? 'high' : undefined}
              />
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/22 to-transparent lg:bg-gradient-to-r lg:from-black/52 lg:via-black/12 lg:to-transparent" />

        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 p-3 sm:gap-4 sm:p-5 md:p-6 lg:flex-row lg:items-end lg:justify-between lg:gap-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide.id}
              className="relative w-full max-w-[440px] overflow-hidden rounded-[14px] border border-white/16 bg-black/38 p-4 text-jamm-cream shadow-sm backdrop-blur-md sm:w-[90%] sm:p-6 lg:w-full lg:max-w-[430px] lg:bg-black/30 lg:p-8 lg:shadow-2xl"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="mb-3 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-jamm-gold sm:mb-4 sm:text-[11px]">
                {activeSlide.category}
              </p>
              <h1 className="mb-3 font-sans text-[28px] font-semibold leading-tight text-jamm-cream sm:mb-4 sm:text-[36px] md:text-[40px] lg:text-[42px]">
                {activeSlide.title}
              </h1>
              <p className="mb-5 font-sans text-sm leading-relaxed text-jamm-cream/86 sm:text-[15px] md:text-base lg:mb-7">
                {activeSlide.subtitle}
              </p>
              <Link
                href={activeSlide.ctaHref}
                className="inline-flex min-h-11 items-center rounded-md bg-jamm-gold px-4 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-jamm-dark transition-colors duration-200 hover:bg-jamm-cream lg:bg-transparent lg:px-0 lg:text-sm lg:normal-case lg:tracking-normal lg:text-jamm-cream lg:border-b lg:border-jamm-gold lg:rounded-none lg:hover:bg-transparent lg:hover:text-jamm-gold"
              >
                {activeSlide.ctaLabel}
              </Link>
              <BorderBeam size={240} duration={9} borderWidth={2.5} colorFrom="#C4973A" colorTo="#F8E7A6" />
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-center gap-2 py-1 lg:pb-3">
            {heroSlides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                aria-label={`Show ${slide.category} hero slide`}
                onClick={() => {
                  setActiveIndex(index)
                  resetAutoSlideTimer()
                }}
                className={`h-3 rounded-full transition-all duration-300 lg:h-2.5 ${
                  index === activeIndex ? 'w-8 bg-jamm-gold lg:w-7' : 'w-3 bg-white/55 lg:w-2.5 lg:bg-white/45'
                }`}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}
