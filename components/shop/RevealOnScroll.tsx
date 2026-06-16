'use client'

import { useEffect } from 'react'

export function RevealOnScroll() {
  useEffect(() => {
    document.body.classList.add('reveal-on')

    const revealAll = () =>
      document.querySelectorAll('.reveal:not(.is-in)').forEach((el) => el.classList.add('is-in'))

    if (!('IntersectionObserver' in window)) {
      revealAll()
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in')
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    )

    document.querySelectorAll('.reveal').forEach((el) => io.observe(el))
    const safety = window.setTimeout(revealAll, 4000)

    return () => {
      io.disconnect()
      window.clearTimeout(safety)
      // Clear the hidden state so it can never linger on a later page that has
      // no observer running.
      document.body.classList.remove('reveal-on')
    }
  }, [])

  return null
}
