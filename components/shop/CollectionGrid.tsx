'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { BorderBeam } from '@/components/ui/border-beam'

interface CollectionGridProps {
  counts: Record<'oud' | 'amber' | 'daily', string>
}

export function CollectionGrid({ counts }: CollectionGridProps) {
  const collections = [
    {
      id: 'oud',
      name: 'Oud',
      copy: 'Resinous, dark, and long lasting.',
      count: counts.oud,
      href: '/shop/collection/oud',
      image: '/images/collections/featured-oud.png',
    },
    {
      id: 'amber',
      name: 'Amber',
      copy: 'Warm vanilla, soft spice, skin-close depth.',
      count: counts.amber,
      href: '/shop/collection/amber',
      image: '/images/collections/featured-amber.png',
    },
    {
      id: 'daily',
      name: 'Daily',
      copy: 'Clean signatures for repeat wear.',
      count: counts.daily,
      href: '/shop/collection/daily',
      image: '/images/collections/featured-daily.png',
    },
  ]

  return (
    <section id="collections" className="bg-transparent px-3 py-10 sm:px-4 lg:py-16">
      <div className="mx-auto max-w-[1560px]">
        <motion.div
          className="mb-5 sm:mb-7"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mb-2 font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-jamm-gold">Collections</p>
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <h2 className="font-sans text-2xl font-semibold text-jamm-dark sm:text-4xl">
              Shop by scent family
            </h2>
            <p className="max-w-md font-sans text-sm leading-relaxed text-jamm-muted">
              Choose by mood first, then explore the products inside each edit.
            </p>
          </div>
          <div className="mt-5 h-px bg-gradient-to-r from-jamm-gold/40 via-jamm-gold/15 to-transparent" />
        </motion.div>

        <motion.div
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          {collections.map((col, index) => (
            <motion.div
              key={col.id}
              variants={{ hidden: { opacity: 0, y: 26 }, visible: { opacity: 1, y: 0 } }}
              whileHover={{ y: -7 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link href={col.href} className="group block">
                <div className="relative min-h-[280px] overflow-hidden rounded-[18px] border border-jamm-gold/35 bg-[#EDE8DC] shadow-[0_18px_45px_rgba(12,11,9,0.08)] transition duration-300 group-hover:border-jamm-gold/70 group-hover:shadow-[0_24px_70px_rgba(12,11,9,0.14)] sm:min-h-[380px] sm:rounded-[20px] lg:min-h-[440px]">
                  <BorderBeam size={360} duration={12} borderWidth={2.5} colorFrom="#C4973A" colorTo="#F8E7A6" delay={index * 2} />
                  <img
                    src={col.image}
                    alt={`${col.name} perfume collection`}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/20 to-transparent" />
                  <div className="absolute left-0 top-0 rounded-br-[16px] bg-jamm-gold px-4 py-2 font-sans text-xs font-semibold text-jamm-dark sm:px-5 sm:text-sm">
                    {col.name}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                    <p className="mb-2 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-jamm-gold">
                      {col.count}
                    </p>
                    <h3 className="mb-2 font-sans text-2xl font-semibold text-white sm:text-3xl">
                      {col.name}
                    </h3>
                    <p className="mb-5 max-w-sm font-sans text-sm font-medium leading-relaxed text-white/86">
                      {col.copy}
                    </p>
                    <span className="inline-flex rounded-full border border-jamm-gold/60 px-4 py-2 font-sans text-[11px] font-medium uppercase tracking-[0.14em] text-jamm-gold transition-colors duration-200 group-hover:bg-jamm-gold group-hover:text-jamm-dark">
                      Explore
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
