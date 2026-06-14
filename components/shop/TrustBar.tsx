'use client'

import { motion } from 'framer-motion'
import { BorderBeam } from '@/components/ui/border-beam'
import { useLocale } from '@/components/i18n/LocaleProvider'

const trustItems = [
  {
    key: 'authentic',
    label: 'Authentic Products',
    detail: 'Every item sourced and verified.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5 text-current" aria-hidden="true">
        <path d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 14.4l-4.8 2.5.9-5.4L4.2 7.7l5.4-.8z" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    key: 'shipping',
    label: 'Reliable Shipping',
    detail: 'Clear delivery options at checkout.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5 text-current" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M2 12h20M12 3a15.3 15.3 0 010 18M12 3a15.3 15.3 0 000 18" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: 'quality',
    label: 'Premium Quality',
    detail: 'Curated with intention.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5 text-current" aria-hidden="true">
        <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
      </svg>
    ),
  },
  {
    key: 'checkout',
    label: 'Secure Checkout',
    detail: 'Your data, protected.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-5 w-5 text-current" aria-hidden="true">
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0110 0v4" strokeLinecap="round" />
      </svg>
    ),
  },
]

export function TrustBar() {
  const { t } = useLocale()
  const localizedTrustItems = trustItems.map((item) => ({
    ...item,
    label: t(`trust.${item.key}.label`),
    detail: t(`trust.${item.key}.detail`),
  }))

  return (
    <section className="bg-transparent px-[var(--jamm-pad)] py-[clamp(48px,8vw,86px)] pt-0">
      <motion.div
        className="relative mx-auto grid max-w-[1240px] grid-cols-2 overflow-hidden rounded-[22px] border-[1.5px] border-transparent bg-[linear-gradient(#fbf8f2,#fbf8f2)_padding-box,linear-gradient(135deg,#e0c074_0%,#c4973a_40%,#8b6914_64%,#e8d09a_100%)_border-box] p-[clamp(26px,4vw,42px)] lg:grid-cols-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.08 } },
        }}
      >
        <BorderBeam size={420} duration={12} borderWidth={2.5} colorFrom="#C4973A" colorTo="#F8E7A6" delay={4} />
        {localizedTrustItems.map(({ label, detail, icon }) => (
          <motion.div
            key={label}
            className="flex flex-col gap-3 p-2 transition-colors duration-300 sm:gap-4 lg:p-3"
            variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-[11px] border border-jamm-gold-deep/50 bg-jamm-gold/6 text-jamm-gold-deep">{icon}</div>
            <div>
              <h4 className="mb-2 font-serif text-[1.3rem] font-semibold leading-[1.05] text-jamm-dark">{label}</h4>
              <p className="font-sans text-sm leading-relaxed text-jamm-muted">{detail}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}
