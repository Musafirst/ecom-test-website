'use client'

import Link from 'next/link'
import Image from 'next/image'
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
      imageClassName: 'object-contain object-center p-4 sm:p-6',
    },
    {
      id: 'amber',
      name: 'Amber',
      copy: 'Warm vanilla, soft spice, skin-close depth.',
      count: counts.amber,
      href: '/shop/collection/amber',
      image: '/images/collections/featured-amber.png',
      imageClassName: 'object-contain object-center p-4 sm:p-6',
    },
    {
      id: 'daily',
      name: 'Daily',
      copy: 'Clean signatures for repeat wear.',
      count: counts.daily,
      href: '/shop/collection/daily',
      image: '/images/collections/featured-daily.png',
      imageClassName: 'object-contain object-center p-4 sm:p-6',
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
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link href={col.href} className="group block transition-transform duration-150 active:scale-[0.98]">
                <div className="relative min-h-[260px] overflow-hidden rounded-[18px] border border-jamm-gold/35 bg-[#EDE8DC] shadow-[0_18px_45px_rgba(12,11,9,0.08)] transition-[border-color,box-shadow] duration-200 group-hover:border-jamm-gold/70 group-hover:shadow-[0_24px_70px_rgba(12,11,9,0.14)] sm:min-h-[320px] sm:rounded-[20px] lg:min-h-[440px]">
                  <BorderBeam size={360} duration={12} borderWidth={2.5} colorFrom="#C4973A" colorTo="#F8E7A6" delay={index * 2} />
                  <Image
                    src={col.image}
                    alt={`${col.name} perfume collection`}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    quality={78}
                    className={`${col.imageClassName} transition-transform duration-500 ease-out group-hover:scale-[1.025]`}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 z-10 bg-[linear-gradient(to_top,rgba(0,0,0,0.82)_0%,rgba(0,0,0,0.56)_45%,rgba(0,0,0,0.18)_100%)]" />
                  <div className="absolute left-0 top-0 z-20 rounded-br-[16px] bg-jamm-gold px-4 py-2 font-sans text-xs font-semibold text-jamm-dark sm:px-5 sm:text-sm">
                    {col.name}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 z-20 p-5 sm:p-7 lg:p-8">
                    <p className="mb-2 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-jamm-gold">
                      {col.count}
                    </p>
                    <h3 className="mb-2 font-sans text-2xl font-semibold text-jamm-cream [text-shadow:0_3px_20px_rgba(0,0,0,0.72)] sm:text-3xl">
                      {col.name}
                    </h3>
                    <p className="mb-5 max-w-sm font-sans text-sm font-semibold leading-relaxed text-jamm-cream [text-shadow:0_2px_14px_rgba(0,0,0,0.72)]">
                      {col.copy}
                    </p>
                    <span className="inline-flex rounded-full border border-jamm-gold/60 bg-jamm-dark/26 px-4 py-2 font-sans text-[11px] font-medium uppercase tracking-[0.14em] text-jamm-cream backdrop-blur-sm transition-[background-color,color] duration-150 group-hover:bg-jamm-cream group-hover:text-jamm-dark">
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
