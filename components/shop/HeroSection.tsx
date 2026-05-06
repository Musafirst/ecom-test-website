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
        className="mx-auto flex max-w-[1560px] flex-col gap-3 rounded-[24px] bg-transparent lg:relative lg:block lg:min-h-[620px] lg:overflow-hidden lg:bg-[#101112] lg:rounded-[28px]"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      >
        <img
          src={heroImage}
          alt="Luxurious oud perfume bottle with rose petals"
          className="relative h-[360px] w-full rounded-[24px] object-cover lg:absolute lg:inset-0 lg:h-full lg:rounded-none"
          fetchPriority="high"
        />
        <div className="hidden lg:absolute lg:inset-0 lg:block lg:bg-gradient-to-r lg:from-black/45 lg:via-black/10 lg:to-transparent" />

        <motion.button
          type="button"
          aria-label="Oud concentration detail"
          className={`${hotspotClass} left-[54%] top-[32%] hidden lg:flex`}
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          +
        </motion.button>
        <motion.button
          type="button"
          aria-label="Bottle detail"
          className={`${hotspotClass} right-[28%] top-[48%] hidden lg:flex`}
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 2.4, delay: 0.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          +
        </motion.button>

        <div className="flex flex-col justify-between gap-4 lg:absolute lg:inset-x-0 lg:bottom-0 lg:gap-6 lg:p-8 lg:flex-row lg:items-end">
          <motion.div
            className="w-full rounded-[14px] bg-white p-6 text-jamm-dark shadow-sm lg:max-w-[430px] lg:p-9 lg:shadow-2xl"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="mb-4 font-sans text-[11px] font-medium uppercase tracking-[0.22em] text-jamm-muted">
              Jamm Trade fragrances
            </p>
            <h1 className="mb-4 font-sans text-[32px] font-medium leading-tight tracking-[-0.02em] text-jamm-dark sm:text-[42px]">
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

          <div className="hidden items-center justify-center gap-2 lg:flex lg:pb-3">
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
