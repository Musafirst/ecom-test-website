'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'

type Interactive3DHeroProps = {
  splineUrl?: string
  fallbackImage?: string
}

type DeviceProfile = {
  canUse3D: boolean
  canUseSpline: boolean
}

const defaultFallbackImage = '/images/hero-perfumes.webp'

function getDeviceProfile(): DeviceProfile {
  if (typeof window === 'undefined') {
    return { canUse3D: false, canUseSpline: false }
  }

  const isMobile = window.matchMedia('(max-width: 767px)').matches
  const reduceData = 'connection' in navigator
    && Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData)
  const lowMemory = 'deviceMemory' in navigator
    && Number((navigator as Navigator & { deviceMemory?: number }).deviceMemory) <= 4

  return {
    canUse3D: !isMobile && !reduceData,
    canUseSpline: !isMobile && !reduceData && !lowMemory,
  }
}

function useDeviceProfile(reduceMotion: boolean): DeviceProfile {
  const [profile, setProfile] = useState<DeviceProfile>({ canUse3D: false, canUseSpline: false })

  useEffect(() => {
    if (reduceMotion) {
      setProfile({ canUse3D: false, canUseSpline: false })
      return
    }

    setProfile(getDeviceProfile())
  }, [reduceMotion])

  return profile
}

function SplineFrame({ src }: { src: string }) {
  const [shouldLoad, setShouldLoad] = useState(false)

  useEffect(() => {
    const load = () => setShouldLoad(true)

    if ('requestIdleCallback' in window) {
      const idleId = window.requestIdleCallback(load, { timeout: 1800 })
      return () => window.cancelIdleCallback(idleId)
    }

    const timeoutId = globalThis.setTimeout(load, 900)
    return () => globalThis.clearTimeout(timeoutId)
  }, [])

  if (!shouldLoad) return null

  return (
    <iframe
      title="Interactive Jamm Trade product scene"
      src={src}
      loading="lazy"
      className="absolute inset-0 h-full w-full border-0"
      allow="autoplay; fullscreen; xr-spatial-tracking"
    />
  )
}

function PlaceholderBottle({ active }: { active: boolean }) {
  return (
    <motion.div
      aria-hidden
      className="relative h-[360px] w-[220px] transform-gpu [transform-style:preserve-3d]"
      animate={active ? { rotateY: [0, 8, 0, -7, 0] } : undefined}
      transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
    >
      <div className="absolute left-1/2 top-2 h-16 w-28 -translate-x-1/2 rounded-[18px_18px_10px_10px] border border-jamm-gold/45 bg-[linear-gradient(135deg,rgba(196,151,58,0.85),rgba(244,239,228,0.28),rgba(12,11,9,0.92))] shadow-[0_18px_34px_rgba(196,151,58,0.14)]" />
      <div className="absolute left-1/2 top-[54px] h-12 w-16 -translate-x-1/2 rounded-sm border border-jamm-gold/35 bg-[#1A1712] shadow-[inset_0_0_22px_rgba(196,151,58,0.14)]" />
      <div className="absolute inset-x-0 bottom-0 mx-auto h-[270px] w-[190px] rounded-[38px_38px_24px_24px] border border-jamm-gold/45 bg-[radial-gradient(circle_at_35%_18%,rgba(244,239,228,0.32),transparent_28%),linear-gradient(120deg,rgba(244,239,228,0.1),rgba(196,151,58,0.22)_34%,rgba(12,11,9,0.94)_72%)] shadow-[0_42px_80px_rgba(0,0,0,0.45),inset_18px_0_36px_rgba(244,239,228,0.08),inset_-22px_0_42px_rgba(0,0,0,0.48)]" />
      <div className="absolute left-1/2 top-[154px] flex h-28 w-32 -translate-x-1/2 items-center justify-center rounded-md border border-jamm-gold/35 bg-[#0C0B09]/82 shadow-[inset_0_0_28px_rgba(196,151,58,0.1)]">
        <span className="font-serif text-2xl font-light tracking-[0.12em] text-jamm-gold">JT</span>
      </div>
      <div className="absolute bottom-7 left-1/2 h-4 w-44 -translate-x-1/2 rounded-full bg-black/50 blur-md" />
    </motion.div>
  )
}

export function Interactive3DHero({
  splineUrl = process.env.NEXT_PUBLIC_SPLINE_HERO_URL,
  fallbackImage = defaultFallbackImage,
}: Interactive3DHeroProps) {
  const reduceMotion = useReducedMotion()
  const profile = useDeviceProfile(Boolean(reduceMotion))
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 70, damping: 24, mass: 0.4 })
  const springY = useSpring(mouseY, { stiffness: 70, damping: 24, mass: 0.4 })
  const rotateY = useTransform(springX, [-0.5, 0.5], [-8, 8])
  const rotateX = useTransform(springY, [-0.5, 0.5], [5, -5])
  const useSpline = Boolean(splineUrl && profile.canUseSpline)

  const sceneLabel = useMemo(
    () => useSpline ? 'Spline scene ready' : profile.canUse3D ? 'Lightweight 3D preview' : 'Image fallback',
    [profile.canUse3D, useSpline],
  )

  function handlePointerMove(event: React.PointerEvent<HTMLElement>) {
    if (!profile.canUse3D || reduceMotion) return

    const rect = event.currentTarget.getBoundingClientRect()
    mouseX.set((event.clientX - rect.left) / rect.width - 0.5)
    mouseY.set((event.clientY - rect.top) / rect.height - 0.5)
  }

  function resetPointer() {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <section
      className="relative overflow-hidden bg-[#0C0B09] px-3 py-5 text-jamm-cream sm:px-4 lg:py-7"
      aria-label="Experimental interactive Jamm Trade hero"
    >
      <div
        className="relative mx-auto grid min-h-[620px] max-w-[1560px] overflow-hidden rounded-[22px] border border-jamm-gold/30 bg-[radial-gradient(circle_at_72%_34%,rgba(196,151,58,0.24),transparent_28%),linear-gradient(135deg,#18140f_0%,#0c0b09_58%,#241b10_100%)] shadow-[0_28px_90px_rgba(12,11,9,0.34)] lg:grid-cols-[0.92fr_1.08fr]"
        onPointerMove={handlePointerMove}
        onPointerLeave={resetPointer}
      >
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,11,9,0.88)_0%,rgba(12,11,9,0.56)_42%,rgba(12,11,9,0.08)_100%)]" />
        <div className="relative z-10 flex flex-col justify-end px-6 pb-10 pt-24 sm:px-10 sm:pb-12 lg:px-14 lg:pb-16">
          <p className="mb-4 font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-jamm-gold">
            Experimental Hero
          </p>
          <h2 className="max-w-2xl font-serif text-[48px] font-light leading-[0.96] tracking-normal text-jamm-cream sm:text-[72px] lg:text-[92px]">
            Fragrance with presence.
          </h2>
          <p className="mt-6 max-w-lg font-sans text-sm leading-7 text-jamm-cream/76 sm:text-base">
            A cinematic product stage for the Jamm Trade edit, built to stay quiet on mobile and come alive only when the device can afford it.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-jamm-gold/45 px-5 py-3 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-jamm-gold">
              Optional Variant
            </span>
            <span className="font-sans text-xs text-jamm-cream/52">{sceneLabel}</span>
          </div>
        </div>

        <div className="relative z-0 min-h-[380px] lg:min-h-[620px]">
          <Image
            src={fallbackImage}
            alt="Jamm Trade fragrance hero fallback"
            fill
            sizes="(max-width: 767px) 100vw, 55vw"
            quality={82}
            className={`object-cover object-center transition-opacity duration-500 ${profile.canUse3D ? 'opacity-16' : 'opacity-72'}`}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(196,151,58,0.28),transparent_32%),linear-gradient(180deg,transparent,rgba(12,11,9,0.76))]" />

          {useSpline ? (
            <SplineFrame src={splineUrl!} />
          ) : profile.canUse3D ? (
            <motion.div
              className="absolute inset-0 flex items-center justify-center [perspective:1100px]"
              style={{ rotateX, rotateY }}
            >
              <PlaceholderBottle active={!reduceMotion} />
            </motion.div>
          ) : null}
        </div>
      </div>
    </section>
  )
}

export default Interactive3DHero
