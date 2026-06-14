'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { BorderBeam } from '@/components/ui/border-beam'
import { useLocale } from '@/components/i18n/LocaleProvider'
import type { JammProduct } from '@/types/product'

interface SecondaryCategoriesProps {
  electronicsProducts: JammProduct[]
}

export function SecondaryCategories({ electronicsProducts }: SecondaryCategoriesProps) {
  const { t } = useLocale()
  const featuredElectronicsProduct =
    electronicsProducts.find((product) => product.handle === 'sony-wh-1000xm5') ?? electronicsProducts[0]
  const categories = [
    {
      id: 'clothing',
      name: t('shortcut.clothing'),
      copy: t('secondary.clothing.copy'),
      sub: t('secondary.clothing.sub'),
      href: '/shop/collection/clothing',
      image: '/product-images/jamm-hoodie.png',
      imageClassName: 'object-contain object-center p-4 sm:p-6',
    },
    {
      id: 'electronics',
      name: t('shortcut.electronics'),
      copy: t('secondary.electronics.copy'),
      sub: t('secondary.electronics.sub'),
      href: '/shop/category/electronics',
      image: featuredElectronicsProduct?.image ?? '/product-images/placeholders/audio.webp',
      imageClassName: 'object-contain object-center p-6 sm:p-8',
    },
  ]

  return (
    <section className="bg-transparent px-[var(--jamm-pad)] py-[clamp(48px,8vw,86px)] pt-0">
      <div className="mx-auto max-w-[1240px]">
        <motion.div
          className="mb-[clamp(26px,4vw,40px)]"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mb-0 font-sans text-[11px] font-bold uppercase tracking-[0.24em] text-jamm-gold-deep">{t('secondary.kicker')}</p>
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <h2 className="mt-2 font-serif text-[clamp(2.3rem,6vw,3.5rem)] font-semibold leading-[1.02] tracking-[-0.005em] text-jamm-dark">
              {t('secondary.title')}
            </h2>
            <p className="max-w-md font-sans text-sm leading-relaxed text-jamm-muted">
              {t('secondary.copy')}
            </p>
          </div>
          <div className="mt-6 h-px bg-[linear-gradient(90deg,#c4973a_0_60px,rgba(28,22,10,0.12)_60px)] lg:hidden" />
        </motion.div>

        <motion.div
          className="grid grid-cols-1 gap-[clamp(16px,3vw,22px)] lg:grid-cols-2"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          {categories.map((cat, index) => (
            <motion.div
              key={cat.id}
              id={cat.id}
              variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0 } }}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link href={cat.href} className="group block">
                <div className="relative min-h-[360px] overflow-hidden rounded-[16px] bg-[linear-gradient(160deg,rgba(216,181,106,0.6),rgba(193,154,69,0.15)_45%,rgba(216,181,106,0.5))] p-[1.5px] transition-transform duration-300 group-hover:-translate-y-1">
                  <BorderBeam size={420} duration={13} borderWidth={2.5} colorFrom="#C4973A" colorTo="#F8E7A6" delay={index * 3} />
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    quality={78}
                    className={`${cat.imageClassName} transition-transform duration-700 group-hover:scale-[1.025]`}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 z-10 bg-[linear-gradient(to_top,rgba(0,0,0,0.72)_0%,rgba(0,0,0,0.42)_45%,rgba(0,0,0,0.08)_100%)]" />
                  <div className="absolute left-[1.5px] top-[1.5px] z-20 rounded-br-[14px] bg-[linear-gradient(135deg,#e0c074,#a37d20)] px-4 py-2 font-sans text-xs font-semibold text-[#241c08] sm:px-5 sm:text-sm">
                    {cat.name}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 z-20 p-5 sm:p-7 lg:p-8">
                    <p className="mb-2 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-jamm-gold">
                      {cat.copy}
                    </p>
                    <h3 className="mb-2 font-serif text-2xl font-semibold text-jamm-cream [text-shadow:0_2px_18px_rgba(0,0,0,0.45)] sm:text-3xl">
                      {cat.name}
                    </h3>
                    <p className="mb-5 max-w-sm font-sans text-sm font-semibold leading-relaxed text-jamm-cream [text-shadow:0_2px_14px_rgba(0,0,0,0.72)]">
                      {cat.sub}
                    </p>
                    <span className="inline-flex rounded-full border border-jamm-gold/60 bg-jamm-dark/26 px-4 py-2 font-sans text-[11px] font-medium uppercase tracking-[0.14em] text-jamm-cream backdrop-blur-sm transition-colors duration-200 group-hover:bg-jamm-cream group-hover:text-jamm-dark">
                      {t('secondary.shop')} {cat.name}
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
