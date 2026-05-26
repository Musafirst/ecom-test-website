'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const STORAGE_KEY   = 'jamm-welcome-claimed'   // localStorage — never show again after code claimed
const SESSION_KEY   = 'jamm-welcome-dismissed' // sessionStorage — skip for this browser session
const DISCOUNT_CODE = 'WELCOME20'

export function WelcomePopup() {
  const [visible, setVisible] = useState(false)
  const [email, setEmail]     = useState('')
  const [claimed, setClaimed] = useState(false)
  const [copied, setCopied]   = useState(false)
  const [error, setError]     = useState('')

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (localStorage.getItem(STORAGE_KEY)) return    // already claimed
    if (sessionStorage.getItem(SESSION_KEY)) return  // dismissed this session

    const timer = setTimeout(() => setVisible(true), 4000)
    return () => clearTimeout(timer)
  }, [])

  function handleClose() {
    sessionStorage.setItem(SESSION_KEY, '1')
    setVisible(false)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.')
      return
    }
    setError('')
    localStorage.setItem(STORAGE_KEY, '1')
    setClaimed(true)
  }

  function handleCopy() {
    navigator.clipboard.writeText(DISCOUNT_CODE).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[200] bg-jamm-dark/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.22 } }}
            onClick={handleClose}
            aria-hidden
          />

          {/* Flex wrapper handles centering — no transform conflict with Framer */}
          <div className="pointer-events-none fixed inset-0 z-[201] flex items-end justify-center sm:items-center sm:p-6">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="welcome-popup-title"
              className={[
                'pointer-events-auto w-full bg-[#FAF7F2] shadow-[0_-8px_40px_rgba(12,11,9,0.18)]',
                'rounded-t-2xl border-t border-x border-jamm-gold/20 p-6 pb-8',
                'sm:max-w-sm sm:rounded-2xl sm:border sm:p-8 sm:shadow-[0_24px_80px_rgba(12,11,9,0.22)]',
              ].join(' ')}
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0, transition: { duration: 0.26, ease: [0.32, 0.72, 0, 1] } }}
              transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Close button */}
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close offer"
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-jamm-dark/35 transition-colors duration-200 hover:bg-jamm-dark/6 hover:text-jamm-dark"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden>
                  <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
                </svg>
              </button>

              {/* Drag handle visible on mobile */}
              <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-jamm-dark/15 sm:hidden" aria-hidden />

              {/* Header */}
              <p className="mb-2 font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-jamm-gold">
                Welcome offer
              </p>
              <h2 id="welcome-popup-title" className="font-serif text-3xl font-light leading-tight text-jamm-dark">
                20% off your<br />first order
              </h2>
              <p className="mt-2.5 font-sans text-sm leading-relaxed text-jamm-dark/55">
                Enter your email to unlock your exclusive discount code.
              </p>

              {!claimed ? (
                /* ── Email capture form ── */
                <form onSubmit={handleSubmit} className="mt-6 space-y-3" noValidate>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError('') }}
                    placeholder="your@email.com"
                    autoComplete="email"
                    className="w-full rounded-lg border border-jamm-dark/15 bg-white px-4 py-3 font-sans text-sm text-jamm-dark placeholder:text-jamm-dark/30 focus:border-jamm-gold/60 focus:outline-none focus:ring-2 focus:ring-jamm-gold/20"
                  />
                  {error && (
                    <p className="font-sans text-xs text-red-500">{error}</p>
                  )}
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-jamm-dark py-3 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition-colors duration-200 hover:bg-jamm-gold hover:text-jamm-dark"
                  >
                    Unlock 20% off
                  </button>
                  <p className="text-center font-sans text-[10px] text-jamm-dark/30">
                    No spam. Unsubscribe any time.
                  </p>
                </form>
              ) : (
                /* ── Code reveal ── */
                <div className="mt-6">
                  <p className="mb-2 font-sans text-xs font-medium uppercase tracking-[0.1em] text-jamm-dark/45">
                    Your discount code
                  </p>

                  <div className="flex items-stretch gap-2">
                    <div className="flex flex-1 items-center justify-center rounded-lg border border-jamm-gold/30 bg-[#EDE8DC] px-4 py-3 font-sans text-xl font-bold tracking-[0.24em] text-jamm-dark">
                      {DISCOUNT_CODE}
                    </div>
                    <button
                      type="button"
                      onClick={handleCopy}
                      title={copied ? 'Copied!' : 'Copy code'}
                      aria-label={copied ? 'Copied!' : 'Copy discount code'}
                      className="flex w-12 flex-shrink-0 items-center justify-center rounded-lg border border-jamm-gold/30 bg-[#EDE8DC] text-jamm-dark/50 transition-colors duration-200 hover:border-jamm-gold hover:text-jamm-dark"
                    >
                      {copied ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 text-jamm-gold" aria-hidden>
                          <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4" aria-hidden>
                          <rect x="9" y="9" width="13" height="13" rx="2" />
                          <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" strokeLinecap="round" />
                        </svg>
                      )}
                    </button>
                  </div>

                  <p className="mt-3 font-sans text-xs leading-relaxed text-jamm-dark/45">
                    Apply at checkout to save 20% on your first order. Valid for new customers only.
                  </p>

                  <button
                    type="button"
                    onClick={handleClose}
                    className="mt-4 w-full rounded-lg bg-jamm-dark py-3 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition-colors duration-200 hover:bg-jamm-gold hover:text-jamm-dark"
                  >
                    Start shopping →
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
