import Link from 'next/link'
import { getFeaturedGuideArticles } from '@/lib/articles'
import { GuideCard } from '@/components/shop/GuideCard'

export function TrendingGuides() {
  const articles = getFeaturedGuideArticles()

  return (
    <section className="bg-transparent px-3 py-10 sm:px-4 lg:py-16">
      <div className="mx-auto max-w-[1560px]">
        <div className="mb-5 sm:mb-7">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="mb-2 font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-jamm-gold">
                Fragrance Guides
              </p>
              <h2 className="font-sans text-2xl font-semibold text-jamm-dark sm:text-4xl">
                Trending Fragrance Guides
              </h2>
            </div>
            <Link
              href="/shop/guides"
              className="inline-flex items-center gap-1.5 font-sans text-sm font-medium text-jamm-dark/50 transition-[color] duration-150 hover:text-jamm-gold"
            >
              View all guides
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5" aria-hidden>
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
          <div className="mt-5 h-px bg-gradient-to-r from-jamm-gold/40 via-jamm-gold/15 to-transparent" />
        </div>

        <div className="grid gap-4 md:grid-cols-3 lg:gap-5">
          {articles.map((article) => (
            <GuideCard key={article.slug} article={article} compact />
          ))}
        </div>
      </div>
    </section>
  )
}
