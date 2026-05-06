'use client'

import { motion } from 'framer-motion'

interface ComingSoonPageProps {
  headline: string
  subtext: string
}

export function ComingSoonPage({ headline, subtext }: ComingSoonPageProps) {
  return (
    <section className="bg-white px-3 py-10 sm:px-4 lg:py-16">
      <motion.div
        className="mx-auto flex min-h-[calc(100vh-190px)] max-w-[1560px] items-center justify-center overflow-hidden rounded-[28px] bg-[#f6f6f6] px-6 py-16"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="w-full max-w-3xl text-center">
          <motion.h1
            className="mx-auto mb-4 max-w-3xl font-sans text-3xl font-medium leading-tight tracking-[-0.04em] text-jamm-dark sm:text-5xl lg:text-7xl"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            {headline}
          </motion.h1>

          <motion.p
            className="mx-auto mb-9 max-w-xl font-sans text-base leading-relaxed text-jamm-dark/60 sm:text-lg"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            {subtext}
          </motion.p>

          <motion.form
            className="mx-auto flex max-w-xl flex-col gap-3 rounded-[18px] bg-white p-2 shadow-sm ring-1 ring-black/10 sm:flex-row"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
            onSubmit={(event) => event.preventDefault()}
          >
            <input
              type="email"
              required
              placeholder="Enter your email"
              className="min-h-12 flex-1 rounded-[14px] border-0 bg-[#f6f6f6] px-4 font-sans text-sm text-jamm-dark outline-none ring-1 ring-transparent transition focus:bg-white focus:ring-jamm-dark/20"
            />
            <button
              type="submit"
              className="min-h-12 rounded-[14px] bg-jamm-dark px-6 font-sans text-sm font-medium text-white transition-colors duration-200 hover:bg-jamm-gold hover:text-jamm-dark"
            >
              Notify Me
            </button>
          </motion.form>
        </div>
      </motion.div>
    </section>
  )
}
