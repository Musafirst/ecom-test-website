'use client'

import { motion } from 'framer-motion'

const trustItems = [
  ['Authentic Products', 'Every item sourced and verified.'],
  ['Ships Worldwide', 'Fast delivery, every country.'],
  ['Premium Quality', 'Curated with intention.'],
  ['Secure Checkout', 'Your data, protected.'],
]

export function TrustBar() {
  return (
    <section className="bg-[#FAF7F2] px-3 py-12 sm:px-4 lg:pb-20">
      <motion.div
        className="mx-auto grid max-w-[1560px] grid-cols-1 overflow-hidden rounded-[20px] border border-jamm-gold/25 bg-[#EDE8DC] sm:grid-cols-2 lg:grid-cols-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.08 } },
        }}
      >
        {trustItems.map(([label, detail]) => (
          <motion.div
            key={label}
            className="border-b border-jamm-gold/15 p-6 last:border-b-0 sm:odd:border-r lg:border-b-0 lg:border-r lg:last:border-r-0"
            variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <h4 className="mb-1 font-sans text-base font-medium text-jamm-dark">{label}</h4>
            <p className="font-sans text-sm leading-relaxed text-jamm-dark/50">{detail}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
