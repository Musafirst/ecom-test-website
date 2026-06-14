import Link from 'next/link'
import { getFeaturedGuideArticles } from '@/lib/articles'
import { GuideCard } from '@/components/shop/GuideCard'

export function TrendingGuides() {
  const articles = getFeaturedGuideArticles()

  return (
    <section className="bg-transparent px-[var(--jamm-pad)] py-[clamp(48px,8vw,86px)] pt-0">
      <div className="mx-auto max-w-[1240px]">
        <div className="mb-[clamp(26px,4vw,40px)]">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="mb-0 font-sans text-[11px] font-bold uppercase tracking-[0.24em] text-jamm-gold-deep">
                Fragrance Guides
              </p>
              <h2 className="mt-2 font-serif text-[clamp(2.3rem,6vw,3.5rem)] font-semibold leading-[1.02] tracking-[-0.005em] text-jamm-dark">
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
          <div className="mt-6 h-px bg-[linear-gradient(90deg,#c4973a_0_60px,rgba(28,22,10,0.12)_60px)] lg:hidden" />
        </div>

        <div className="grid gap-[clamp(16px,3vw,22px)] md:grid-cols-3">
          {articles.map((article) => (
            <GuideCard key={article.slug} article={article} compact />
          ))}
        </div>
      </div>
    </section>
  )
}
