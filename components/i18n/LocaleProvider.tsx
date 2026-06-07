'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  dictionaries,
  localeLabels,
  normalizeLocale,
  supportedLocales,
  type SupportedLocale,
  type TranslationKey,
} from '@/lib/i18n'

type LocaleContextValue = {
  locale: SupportedLocale
  setLocale: (locale: SupportedLocale) => void
  t: (key: TranslationKey | string) => string
}

const LocaleContext = createContext<LocaleContextValue | null>(null)
const storageKey = 'jamm-trade-locale'

function detectBrowserLocale() {
  if (typeof window === 'undefined') return 'en'

  const fromQuery = new URLSearchParams(window.location.search).get('lang')
  if (fromQuery) return normalizeLocale(fromQuery)

  const saved = window.localStorage.getItem(storageKey)
  if (saved) return normalizeLocale(saved)

  return normalizeLocale(window.navigator.languages?.[0] ?? window.navigator.language)
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<SupportedLocale>('en')

  useEffect(() => {
    setLocaleState(detectBrowserLocale())
  }, [])

  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr'
    window.localStorage.setItem(storageKey, locale)
  }, [locale])

  const value = useMemo<LocaleContextValue>(() => {
    const activeDictionary: Record<string, string> = dictionaries[locale]
    const fallbackDictionary: Record<string, string> = dictionaries.en

    return {
      locale,
      setLocale: setLocaleState,
      t: (key) => activeDictionary[key] ?? fallbackDictionary[key] ?? key,
    }
  }, [locale])

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  const context = useContext(LocaleContext)
  if (!context) {
    throw new Error('useLocale must be used within LocaleProvider')
  }
  return context
}

export function LanguageSelector({ className = '' }: { className?: string }) {
  const { locale, setLocale } = useLocale()

  return (
    <label className={`inline-flex items-center gap-2 font-sans text-xs text-jamm-dark/55 ${className}`}>
      <span className="sr-only">Language</span>
      <select
        value={locale}
        onChange={(event) => setLocale(event.target.value as SupportedLocale)}
        className="h-9 rounded-md border border-jamm-gold/25 bg-[#FAF7F2]/82 px-2 font-sans text-xs font-medium text-jamm-dark outline-none transition-colors hover:border-jamm-gold focus:border-jamm-gold"
        aria-label="Language"
      >
        {supportedLocales.map((code) => (
          <option key={code} value={code}>
            {localeLabels[code]}
          </option>
        ))}
      </select>
    </label>
  )
}
