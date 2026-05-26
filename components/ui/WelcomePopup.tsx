'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const STORAGE_KEY   = 'jamm-welcome-claimed'   // localStorage — never show again after code claimed
const SESSION_KEY   = 'jamm-welcome-dismissed' // sessionStorage — skip for this browser session
const DISCOUNT_CODE = 'WELCOME20'

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden>
      <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
    </svg>
  )
}

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.')
      return
    }
    setError('')

    try {
      const res  = await fetch('/api/subscribe', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email }),
      })
      const data = await res.json() as { code?: string; error?: string; alreadyClaimed?: boolean }

      if (!res.ok) {
        setError(data.error ?? 'Something went wrong. Please try again.')
        return
      }

      localStorage.setItem(STORAGE_KEY, '1')
      setClaimed(true)
    } catch {
      setError('Network error. Please try again.')
    }
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

          {/* Flex wrapper — handles centering without transform conflict */}
          <div className="pointer-events-none fixed inset-0 z-[201] flex items-end justify-center sm:items-center sm:p-6">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="welcome-popup-title"
              className={[
                // base — mobile bottom sheet
                'pointer-events-auto w-full overflow-hidden',
                'rounded-t-3xl border-t border-x border-jamm-gold/20',
                'bg-[#FAF7F2] shadow-[0_-12px_50px_rgba(12,11,9,0.2)]',
                // desktop modal
                'sm:max-w-sm sm:rounded-2xl sm:border sm:shadow-[0_24px_80px_rgba(12,11,9,0.22)]',
              ].join(' ')}
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0, transition: { duration: 0.26, ease: [0.32, 0.72, 0, 1] } }}
              transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
            >

              {/* ── Top bar: drag handle (mobile) + label + close button ── */}
              <div className="flex items-center justify-between px-6 pb-2 pt-4 sm:px-8 sm:pt-6 sm:pb-0">
                <div className="flex flex-col items-start gap-2">
                  {/* Drag handle — mobile only */}
                  <div className="h-[3px] w-9 rounded-full bg-jamm-dark/20 sm:hidden" aria-hidden />
                  <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-jamm-gold">
                    Welcome offer
                  </p>
                </div>

                {/* Close — large tap target, visible background */}
                <button
                  type="button"
                  onClick={handleClose}
                  aria-label="Close offer"
                  className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-jamm-dark/8 text-jamm-dark/50 transition-colors duration-200 hover:bg-jamm-dark/14 hover:text-jamm-dark"
                >
                  <CloseIcon />
                </button>
              </div>

              {/* ── Content ── */}
              <div className="px-6 pb-8 pt-3 sm:px-8 sm:pb-8 sm:pt-4">
                <h2
                  id="welcome-popup-title"
                  className="font-serif text-[2rem] font-light leading-tight text-jamm-dark sm:text-3xl"
                >
                  20% off your<br />first order
                </h2>
                <p className="mt-2.5 font-sans text-sm leading-relaxed text-jamm-dark/55">
                  Enter your email to unlock your exclusive discount code.
                </p>

                {!claimed ? (
                  /* ── Email form ── */
                  <form onSubmit={handleSubmit} className="mt-5 space-y-3" noValidate>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError('') }}
                      placeholder="your@email.com"
                      autoComplete="email"
                      className="w-full rounded-xl border border-jamm-dark/15 bg-white px-4 py-3.5 font-sans text-sm text-jamm-dark placeholder:text-jamm-dark/30 focus:border-jamm-gold/60 focus:outline-none focus:ring-2 focus:ring-jamm-gold/20"
                    />
                    {error && (
                      <p className="font-sans text-xs text-red-500">{error}</p>
                    )}
                    <button
                      type="submit"
                      className="w-full rounded-xl bg-jamm-dark py-3.5 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition-colors duration-200 hover:bg-jamm-gold hover:text-jamm-dark"
                    >
                      Unlock 20% off
                    </button>

                    {/* No thanks link */}
                    <div className="flex items-center justify-center pt-1">
                      <button
                        type="button"
                        onClick={handleClose}
                        className="font-sans text-[11px] text-jamm-dark/35 underline-offset-2 transition-colors hover:text-jamm-dark/60 hover:underline"
                      >
                        No thanks
                      </button>
                    </div>
                  </form>
                ) : (
                  /* ── Code reveal ── */
                  <div className="mt-5">
                    <p className="mb-2 font-sans text-xs font-medium uppercase tracking-[0.1em] text-jamm-dark/45">
                      Your discount code
                    </p>

                    <div className="flex items-stretch gap-2">
                      <div className="flex flex-1 items-center justify-center rounded-xl border border-jamm-gold/30 bg-[#EDE8DC] px-4 py-3.5 font-sans text-xl font-bold tracking-[0.24em] text-jamm-dark">
                        {DISCOUNT_CODE}
                      </div>
                      <button
                        type="button"
                        onClick={handleCopy}
                        title={copied ? 'Copied!' : 'Copy code'}
                        aria-label={copied ? 'Copied!' : 'Copy discount code'}
                        className="flex w-14 flex-shrink-0 items-center justify-center rounded-xl border border-jamm-gold/30 bg-[#EDE8DC] text-jamm-dark/50 transition-colors duration-200 hover:border-jamm-gold hover:text-jamm-dark"
                      >
                        {copied ? (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="h-4 w-4 text-jamm-gold" aria-hidden>
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
                      className="mt-4 w-full rounded-xl bg-jamm-dark py-3.5 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition-colors duration-200 hover:bg-jamm-gold hover:text-jamm-dark"
                    >
                      Start shopping →
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
