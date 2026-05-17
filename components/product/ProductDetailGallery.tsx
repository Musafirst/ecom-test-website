'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ProductPhoto } from '@/components/ui/ProductPhoto'

interface ProductDetailGalleryProps {
  images: string[]
  alt: string
  imageClassName: string
  aspectRatio: string
}

export function ProductDetailGallery({ images, alt, imageClassName, aspectRatio }: ProductDetailGalleryProps) {
  const galleryImages = images.length > 0 ? images : []
  const [activeIndex, setActiveIndex] = useState(0)

  const goTo = useCallback((index: number) => {
    setActiveIndex(index)
  }, [])

  const goPrev = useCallback(() => {
    setActiveIndex((i) => (i === 0 ? galleryImages.length - 1 : i - 1))
  }, [galleryImages.length])

  const goNext = useCallback(() => {
    setActiveIndex((i) => (i === galleryImages.length - 1 ? 0 : i + 1))
  }, [galleryImages.length])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goPrev, goNext])

  if (galleryImages.length === 0) return null

  const activeImage = galleryImages[activeIndex]

  return (
    <div className="grid gap-3 sm:grid-cols-[86px_1fr] sm:gap-4">
      <div className="order-2 flex snap-x gap-2.5 overflow-x-auto pb-1 sm:order-1 sm:flex-col sm:gap-3 sm:overflow-visible sm:pb-0">
        {galleryImages.slice(0, 5).map((image, index) => (
          <button
            key={`${image}-${index}`}
            type="button"
            onClick={() => goTo(index)}
            className={`relative h-[68px] w-[68px] flex-none snap-start overflow-hidden rounded-md border bg-[#F4EFE4] transition-all duration-200 sm:h-auto sm:w-auto sm:aspect-square ${
              activeIndex === index
                ? 'border-jamm-gold shadow-[0_0_0_2px_rgba(196,151,58,0.22)] scale-[1.04]'
                : 'border-black/10 opacity-70 hover:opacity-100 hover:border-jamm-gold/50 hover:scale-[1.02]'
            }`}
            aria-label={`View product image ${index + 1}`}
          >
            <ProductPhoto
              src={image}
              alt={alt}
              aspectRatio="1/1"
              className="h-full"
              imageClassName={imageClassName}
              sizes="86px"
              quality={75}
            />
          </button>
        ))}
      </div>

      <div className="relative order-1 overflow-hidden rounded-lg border border-black/10 bg-[#F4EFE4] shadow-[0_20px_54px_rgba(12,11,9,0.08)] sm:order-2 sm:rounded-xl sm:shadow-[0_24px_70px_rgba(12,11,9,0.08)]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="w-full"
          >
            <ProductPhoto
              src={activeImage}
              alt={alt}
              aspectRatio={aspectRatio}
              imageClassName={imageClassName}
              sizes="(min-width: 1024px) 48vw, 100vw"
              quality={84}
            />
          </motion.div>
        </AnimatePresence>

        {/* Prev / Next arrows */}
        {galleryImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white/84 text-jamm-dark/60 backdrop-blur-sm transition hover:border-jamm-gold/50 hover:bg-white hover:text-jamm-dark sm:h-10 sm:w-10"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden="true">
                <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Next image"
              className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white/84 text-jamm-dark/60 backdrop-blur-sm transition hover:border-jamm-gold/50 hover:bg-white hover:text-jamm-dark sm:h-10 sm:w-10"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden="true">
                <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </>
        )}

        {galleryImages.length > 1 && (
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {galleryImages.slice(0, 5).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to image ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  i === activeIndex
                    ? 'h-1.5 w-5 bg-jamm-gold'
                    : 'h-1.5 w-1.5 bg-black/25 hover:bg-black/40'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
