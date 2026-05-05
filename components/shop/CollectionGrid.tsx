'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const collections = [
  {
    id: 'oud',
    name: 'Oud',
    copy: 'Resinous, dark, and long lasting.',
    count: '18 fragrances',
    href: '/shop/collection/oud',
    image: 'https://images.pexels.com/photos/33820345/pexels-photo-33820345.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'amber',
    name: 'Amber',
    copy: 'Warm vanilla, soft spice, skin-close depth.',
    count: '12 fragrances',
    href: '/shop/collection/amber',
    image: 'https://images.pexels.com/photos/15926320/pexels-photo-15926320.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
  {
    id: 'daily',
    name: 'Daily',
    copy: 'Clean signatures for repeat wear.',
    count: '24 fragrances',
    href: '/shop/collection/daily',
    image: 'https://images.pexels.com/photos/16266287/pexels-photo-16266287.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
]

export function CollectionGrid() {
  return (
    <section id="collections" className="bg-[#FAF7F2] px-3 py-12 sm:px-4 lg:py-16">
      <div className="mx-auto max-w-[1560px]">
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mb-2 font-sans text-sm text-jamm-gold">Collections</p>
          <h2 className="font-sans text-3xl font-medium tracking-[-0.02em] text-jamm-dark sm:text-4xl">
            Shop by scent family
          </h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 gap-4 lg:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          {collections.map((col) => (
            <motion.div
              key={col.id}
              variants={{ hidden: { opacity: 0, y: 26 }, visible: { opacity: 1, y: 0 } }}
              whileHover={{ y: -7 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link href={col.href} className="group block">
                <div className="relative min-h-[420px] overflow-hidden rounded-[20px] bg-[#EDE8DC]">
                  <img
                    src={col.image}
                    alt={`${col.name} perfume collection`}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.035]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div className="absolute left-0 top-0 rounded-br-[18px] bg-jamm-gold px-5 py-2 font-sans text-sm font-medium text-jamm-dark">
                    {col.name}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <p className="mb-2 font-sans text-[11px] uppercase tracking-[0.2em] text-jamm-gold/80">
                      {col.count}
                    </p>
                    <h3 className="mb-2 font-sans text-3xl font-medium tracking-[-0.02em] text-jamm-cream">
                      {col.name}
                    </h3>
                    <p className="mb-5 max-w-sm font-sans text-sm leading-relaxed text-jamm-cream/70">
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
