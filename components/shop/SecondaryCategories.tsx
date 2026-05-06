'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

const categories = [
  {
    id: 'clothing',
    name: 'Clothing',
    copy: 'Wear the mark.',
    sub: 'Hoodies, tees, and essentials with the Jamm Trade lotus mark.',
    href: '/shop/category/clothing',
    image: '/product-images/jamm-hoodie.png',
  },
  {
    id: 'electronics',
    name: 'Electronics',
    copy: 'Precision essentials.',
    sub: 'Premium audio and everyday electronics selected for quality and focus.',
    href: '/shop/category/electronics',
    image: 'https://images.pexels.com/photos/33481395/pexels-photo-33481395.jpeg?auto=compress&cs=tinysrgb&w=1200',
  },
]

export function SecondaryCategories() {
  return (
    <section className="bg-[#FAF7F2] px-3 py-12 sm:px-4 lg:py-16">
      <div className="mx-auto max-w-[1560px]">
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mb-2 font-sans text-sm text-jamm-gold">Also available</p>
          <h2 className="font-sans text-3xl font-medium tracking-[-0.02em] text-jamm-dark sm:text-4xl">
            Beyond fragrance
          </h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 gap-4 lg:grid-cols-2"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          {categories.map((cat) => (
            <motion.div
              key={cat.id}
              id={cat.id}
              variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link href={cat.href} className="group block">
                <div className="relative min-h-[320px] overflow-hidden rounded-[20px] bg-[#EDE8DC] sm:min-h-[380px] lg:min-h-[460px]">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                  <div className="absolute left-0 top-0 rounded-br-[18px] bg-jamm-gold px-5 py-2 font-sans text-sm font-medium text-jamm-dark">
                    {cat.name}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent p-6">
                    <p className="mb-2 font-sans text-[11px] uppercase tracking-[0.2em] text-jamm-gold/80">
                      {cat.copy}
                    </p>
                    <h3 className="mb-2 font-sans text-3xl font-medium tracking-[-0.02em] text-jamm-cream">
                      {cat.name}
                    </h3>
                    <p className="mb-5 max-w-sm font-sans text-sm leading-relaxed text-jamm-cream/65">
                      {cat.sub}
                    </p>
                    <span className="inline-flex rounded-full border border-jamm-gold/60 px-4 py-2 font-sans text-[11px] font-medium uppercase tracking-[0.14em] text-jamm-gold transition-colors duration-200 group-hover:bg-jamm-gold group-hover:text-jamm-dark">
                      Shop {cat.name}
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
