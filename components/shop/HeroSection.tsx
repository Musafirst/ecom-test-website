'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const heroImage =
  'https://images.pexels.com/photos/30618765/pexels-photo-30618765.jpeg?auto=compress&cs=tinysrgb&w=1800'

const hotspotClass =
  'absolute flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-jamm-dark shadow-lg ring-1 ring-black/10 backdrop-blur-sm'

export function HeroSection() {
  return (
    <section className="bg-[#FAF7F2] px-3 pb-14 sm:px-4 lg:pb-20">
      <motion.div
        className="relative mx-auto min-h-[620px] max-w-[1560px] overflow-hidden rounded-[24px] bg-[#101112] sm:rounded-[28px]"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      >
        <img
          src={heroImage}
          alt="Luxurious oud perfume bottle with rose petals"
          className="absolute inset-0 h-full w-full object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/10 to-transparent" />

        <motion.button
          type="button"
          aria-label="Oud concentration detail"
          className={`${hotspotClass} left-[54%] top-[32%]`}
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          +
        </motion.button>
        <motion.button
          type="button"
          aria-label="Bottle detail"
          className={`${hotspotClass} right-[28%] top-[48%] hidden sm:flex`}
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2.4, delay: 0.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          +
        </motion.button>

        <div className="absolute inset-x-0 bottom-0 flex flex-col justify-between gap-6 p-5 sm:p-8 lg:flex-row lg:items-end">
          <motion.div
            className="max-w-[430px] rounded-[14px] bg-white p-7 text-jamm-dark shadow-2xl sm:p-9"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="mb-4 font-sans text-[11px] font-medium uppercase tracking-[0.22em] text-jamm-muted">
              Jamm Trade fragrances
            </p>
            <h1 className="mb-4 font-sans text-[34px] font-medium leading-tight tracking-[-0.02em] text-jamm-dark sm:text-[42px]">
              From essentials to enterprise.
            </h1>
            <p className="mb-7 font-sans text-base leading-relaxed text-jamm-dark/60">
              Curated fragrances, fashion, and everyday goods selected with intention.
            </p>
            <Link
              href="#perfumes"
              className="inline-flex border-b border-jamm-dark pb-1 font-sans text-sm font-medium text-jamm-dark transition-colors duration-200 hover:text-jamm-gold"
            >
              Shop Perfumes
            </Link>
          </motion.div>

          <div className="flex items-center justify-center gap-2 lg:pb-3">
            {[0, 1, 2].map((dot) => (
              <span
                key={dot}
                className={`h-2.5 w-2.5 rounded-full ${dot === 0 ? 'bg-white' : 'bg-white/45'}`}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}
