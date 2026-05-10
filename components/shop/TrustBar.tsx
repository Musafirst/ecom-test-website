'use client'

import { motion } from 'framer-motion'
import { BorderBeam } from '@/components/ui/border-beam'

const trustItems = [
  {
    label: 'Authentic Products',
    detail: 'Every item sourced and verified.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5 text-jamm-gold" aria-hidden="true">
        <path d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 14.4l-4.8 2.5.9-5.4L4.2 7.7l5.4-.8z" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: 'Ships Worldwide',
    detail: 'Fast delivery, every country.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5 text-jamm-gold" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M2 12h20M12 3a15.3 15.3 0 010 18M12 3a15.3 15.3 0 000 18" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: 'Premium Quality',
    detail: 'Curated with intention.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5 text-jamm-gold" aria-hidden="true">
        <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
      </svg>
    ),
  },
  {
    label: 'Secure Checkout',
    detail: 'Your data, protected.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5 text-jamm-gold" aria-hidden="true">
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0110 0v4" strokeLinecap="round" />
      </svg>
    ),
  },
]

export function TrustBar() {
  return (
    <section className="bg-transparent px-3 py-10 sm:px-4 lg:pb-20 lg:pt-12">
      <motion.div
        className="relative mx-auto grid max-w-[1560px] grid-cols-2 overflow-hidden rounded-[18px] border border-jamm-gold/35 bg-[#EDE8DC] shadow-[0_18px_50px_rgba(12,11,9,0.08)] sm:rounded-[20px] lg:grid-cols-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.08 } },
        }}
      >
        <BorderBeam size={420} duration={12} borderWidth={2.5} colorFrom="#C4973A" colorTo="#F8E7A6" delay={4} />
        {trustItems.map(({ label, detail, icon }) => (
          <motion.div
            key={label}
            className="flex flex-col gap-3 border-b border-r border-jamm-gold/15 p-4 transition-colors duration-300 even:border-r-0 hover:bg-white/28 sm:flex-row sm:items-start sm:gap-4 sm:p-6 lg:border-b-0 lg:border-r lg:even:border-r lg:last:border-r-0"
            variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md border border-jamm-gold/25 bg-white/35 sm:mt-0.5 sm:h-10 sm:w-10">{icon}</div>
            <div>
              <h4 className="mb-1 font-sans text-sm font-semibold leading-tight text-jamm-dark sm:text-base sm:font-medium">{label}</h4>
              <p className="font-sans text-xs leading-relaxed text-jamm-dark/55 sm:text-sm sm:text-jamm-dark/50">{detail}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
