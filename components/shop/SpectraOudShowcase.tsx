'use client'

import { useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion'

const images = [
  { id: 1, url: 'https://www.intenseoud.com/cdn/shop/files/7_3ee3a409-cfc3-4b59-b5d7-11461f8ff120_large.jpg?v=1774780006', label: 'Front View' },
  { id: 2, url: 'https://www.intenseoud.com/cdn/shop/files/2_adbf0dd1-883b-4c94-8a64-2b001b8ea11f_large.jpg?v=1774780019', label: 'Side View' },
  { id: 3, url: 'https://www.intenseoud.com/cdn/shop/files/8_8b128f1a-07ea-4e27-bc3d-a185cd9bdc77_large.jpg?v=1774780021', label: 'Detail' },
  { id: 4, url: 'https://www.intenseoud.com/cdn/shop/files/4_f4a4a3b5-a18f-408d-9dc8-9cd9da3e2487_large.jpg?v=1774780023', label: 'Cap Close-up' },
  { id: 5, url: 'https://www.intenseoud.com/cdn/shop/files/5_5e221f29-84da-4179-a0b4-b3f15ae4a627_large.jpg?v=1774780025', label: 'Angle View' },
  { id: 6, url: 'https://www.intenseoud.com/cdn/shop/files/6_ac64f28b-b101-4a03-b3f4-9863d39c4480_large.jpg?v=1774780028', label: 'Full Set' },
]

const slideVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 60 : -60, scale: 0.97 }),
  center: { opacity: 1, x: 0, scale: 1 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -60 : 60, scale: 0.97 }),
}

export function SpectraOudShowcase() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const cardRef = useRef<HTMLDivElement>(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useSpring(useTransform(mouseY, [-150, 150], [10, -10]), { stiffness: 200, damping: 20 })
  const rotateY = useSpring(useTransform(mouseX, [-150, 150], [-10, 10]), { stiffness: 200, damping: 20 })

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set(e.clientX - rect.left - rect.width / 2)
    mouseY.set(e.clientY - rect.top - rect.height / 2)
  }, [mouseX, mouseY])

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0)
    mouseY.set(0)
  }, [mouseX, mouseY])

  const goTo = (index: number) => {
    setDirection(index > activeIndex ? 1 : -1)
    setActiveIndex(index)
  }

  const prev = () => goTo((activeIndex - 1 + images.length) % images.length)
  const next = () => goTo((activeIndex + 1) % images.length)

  return (
    <section className="min-h-screen bg-[#0d0b09] px-4 py-12 lg:py-20">
      <div className="mx-auto max-w-[1200px]">

        <div className="mb-10 text-center">
          <p className="mb-2 font-sans text-[11px] font-medium uppercase tracking-[0.3em] text-jamm-gold">
            Oud Collection
          </p>
          <h1 className="font-sans text-4xl font-medium tracking-[-0.03em] text-jamm-cream sm:text-5xl lg:text-6xl">
            Spectra Oud
          </h1>
          <p className="mt-3 font-sans text-sm leading-relaxed text-jamm-cream/50">
            Drag, hover, or tap to explore every angle.
          </p>
        </div>

        <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-start lg:gap-10">

          {/* 3D tilt main image */}
          <motion.div
            ref={cardRef}
            className="relative w-full max-w-[480px] cursor-grab active:cursor-grabbing lg:flex-1"
            style={{ perspective: 900, rotateX, rotateY, transformStyle: 'preserve-3d' }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.1}
            onDragEnd={(_, info) => {
              if (info.offset.x < -50) next()
              else if (info.offset.x > 50) prev()
            }}
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] bg-[#1a1612] shadow-[0_40px_80px_rgba(0,0,0,0.6)]">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.img
                  key={images[activeIndex].id}
                  src={images[activeIndex].url}
                  alt={images[activeIndex].label}
                  className="absolute inset-0 h-full w-full object-cover"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                />
              </AnimatePresence>

              {/* Gloss overlay that follows tilt */}
              <motion.div
                className="pointer-events-none absolute inset-0 rounded-[24px]"
                style={{
                  background: useTransform(
                    [mouseX, mouseY],
                    ([x, y]: number[]) =>
                      `radial-gradient(circle at ${50 + x / 6}% ${50 + y / 6}%, rgba(255,220,130,0.08) 0%, transparent 65%)`
                  ),
                }}
              />

              {/* Image label */}
              <div className="absolute bottom-4 left-4">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={activeIndex}
                    className="inline-block rounded-full bg-black/50 px-3 py-1 font-sans text-[10px] uppercase tracking-[0.18em] text-jamm-gold/80 backdrop-blur-sm"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25 }}
                  >
                    {images[activeIndex].label}
                  </motion.span>
                </AnimatePresence>
              </div>

              {/* Prev / Next arrows */}
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white/70 backdrop-blur-sm transition hover:bg-black/60 hover:text-white"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4"><path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white/70 backdrop-blur-sm transition hover:bg-black/60 hover:text-white"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4"><path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            </div>

            {/* Dot indicators */}
            <div className="mt-4 flex justify-center gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === activeIndex ? 'h-2 w-6 bg-jamm-gold' : 'h-2 w-2 bg-white/25 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          </motion.div>

          {/* Info panel + thumbnail strip */}
          <div className="flex w-full flex-col gap-6 lg:w-[320px] lg:pt-2">

            <div className="rounded-[20px] border border-jamm-gold/15 bg-[#1a1612] p-6">
              <p className="mb-1 font-sans text-[10px] uppercase tracking-[0.25em] text-jamm-gold/60">Unisex · Eau de Parfum</p>
              <h2 className="mb-3 font-sans text-2xl font-medium text-jamm-cream">Spectra Oud Intense</h2>
              <p className="mb-5 font-sans text-sm leading-relaxed text-jamm-cream/55">
                Deep resinous oud anchored by smoky amber, black musk, and a whisper of rose. Rich, long-lasting, and unmistakably luxurious.
              </p>
              <div className="mb-5 flex flex-wrap gap-2">
                {['Oud', 'Amber', 'Musk', 'Rose', 'Incense'].map((note) => (
                  <span key={note} className="rounded-full border border-jamm-gold/20 px-3 py-1 font-sans text-[10px] tracking-[0.1em] text-jamm-gold/70">
                    {note}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between border-t border-jamm-gold/10 pt-5">
                <span className="font-sans text-2xl font-medium text-jamm-gold">$89.00</span>
                <Link
                  href="mailto:contact@jammtrade.com"
                  className="rounded-full bg-jamm-gold px-5 py-2.5 font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-jamm-dark transition-colors hover:bg-jamm-gold/80"
                >
                  Request
                </Link>
              </div>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-3 gap-2">
              {images.map((img, i) => (
                <motion.button
                  key={img.id}
                  onClick={() => goTo(i)}
                  className="relative aspect-square overflow-hidden rounded-[12px]"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.2 }}
                >
                  <img src={img.url} alt={img.label} className="h-full w-full object-cover" />
                  <motion.div
                    className="absolute inset-0 rounded-[12px] ring-2 ring-jamm-gold"
                    animate={{ opacity: i === activeIndex ? 1 : 0 }}
                    transition={{ duration: 0.2 }}
                  />
                  {i !== activeIndex && (
                    <div className="absolute inset-0 rounded-[12px] bg-black/40" />
                  )}
                </motion.button>
              ))}
            </div>

          </div>
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 font-sans text-[11px] uppercase tracking-[0.2em] text-jamm-cream/35 transition-colors hover:text-jamm-gold"
          >
            <span className="h-px w-5 bg-current" />
            Back to shop
          </Link>
        </div>
      </div>
    </section>
  )
}
