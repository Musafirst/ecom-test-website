'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { BorderBeam } from '@/components/ui/border-beam'

const showcaseProduct = {
  title: 'Lattafa Oud for Glory',
  href: '/product/lattafa-oud-for-glory',
  image: 'https://www.lattafaindia.com/cdn/shop/files/01_3a1ef9ac-0b1d-4876-a18e-99a5e7da2425.png?v=1768815486&width=913',
  imageAlt: 'Lattafa Oud for Glory perfume bottle',
}

export function PerfumeShowcaseCard() {
  return (
    <motion.div
      className="relative w-full sm:w-72 xl:w-80"
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 7, ease: 'easeInOut', repeat: Infinity }}
    >
      <motion.div
        className="absolute -bottom-3 -right-3 h-full w-full border border-jamm-gold/35"
        initial={{ opacity: 0, x: 10, y: 10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      />

      <motion.div
        className="relative overflow-hidden border border-jamm-gold/35 bg-[#161310] shadow-2xl"
        whileHover={{ scale: 1.025 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <BorderBeam size={300} duration={11} borderWidth={2.5} colorFrom="#C4973A" colorTo="#F8E7A6" />
        <div className="relative aspect-[3/4] bg-[#EDE8DC]">
          <Image
            src={showcaseProduct.image}
            alt={showcaseProduct.imageAlt}
            fill
            sizes="(min-width: 1280px) 320px, 288px"
            quality={90}
            className="object-contain p-7 mix-blend-multiply"
            priority
          />
          <div className="absolute top-4 left-4">
            <span className="bg-jamm-gold text-jamm-dark text-[9px] tracking-[0.2em] uppercase font-sans font-medium px-2.5 py-1">
              Bestseller
            </span>
          </div>
        </div>

        <div className="p-5 border-t border-jamm-gold/15">
          <p className="text-jamm-gold/60 text-[10px] tracking-[0.3em] uppercase font-sans mb-1.5">
            Oud Collection
          </p>
          <h3 className="font-serif text-xl text-jamm-cream font-light mb-1">
            {showcaseProduct.title}
          </h3>
          <p className="text-jamm-muted text-xs font-sans mb-3">
            Bold oud selected for depth and evening presence.
          </p>
          <div className="flex items-center justify-between">
            <span className="text-jamm-gold font-sans text-base font-medium">$39.00</span>
            <Link
              href={showcaseProduct.href}
              className="rounded-sm text-[10px] tracking-[0.18em] uppercase font-sans text-jamm-dark bg-jamm-gold px-4 py-2 hover:bg-jamm-gold-light transition-colors duration-200"
            >
              View
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
