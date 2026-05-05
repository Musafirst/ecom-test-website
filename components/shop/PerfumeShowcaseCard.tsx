'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { PlaceholderImage } from '@/components/ui/PlaceholderImage'

export function PerfumeShowcaseCard() {
  return (
    <motion.div
      className="relative w-72 xl:w-80"
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 7, ease: 'easeInOut', repeat: Infinity }}
    >
      <motion.div
        className="absolute -bottom-3 -right-3 w-full h-full border border-jamm-gold/20"
        initial={{ opacity: 0, x: 10, y: 10 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      />

      <motion.div
        className="relative bg-[#161310] border border-jamm-gold/25 shadow-2xl overflow-hidden"
        whileHover={{ scale: 1.025 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="relative">
          <PlaceholderImage
            variant="perfume"
            theme="dark"
            aspectRatio="3/4"
            bottleSize="lg"
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
            Signature Oud
          </h3>
          <p className="text-jamm-muted text-xs font-sans mb-3">
            Deep oud on a bed of amber and musk.
          </p>
          <div className="flex items-center justify-between">
            <span className="text-jamm-gold font-sans text-base font-medium">$89.00</span>
            <Link
              href="/shop/product/signature-oud"
              className="text-[10px] tracking-[0.18em] uppercase font-sans text-jamm-dark bg-jamm-gold px-4 py-2 hover:bg-jamm-gold-light transition-colors duration-200"
            >
              View
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
