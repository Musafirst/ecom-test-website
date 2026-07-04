import type { Metadata } from 'next'
import { GuideCard } from '@/components/shop/GuideCard'
import { getGuideArticles } from '@/lib/articles'

export const metadata: Metadata = {
  title: 'Fragrance Guides | Jamm Trade',
  description: 'Premium fragrance guides, reviews, and buying advice from Jamm Trade.',
  alternates: {
    canonical: '/shop/guides',
  },
}

export default function GuidesPage() {
  const articles = getGuideArticles()

  return (
    <main className="px-3 pb-12 pt-4 sm:px-4 lg:pb-20">
      <section className="mx-auto max-w-[1560px]">
        <div className="rounded-[18px] border border-jamm-gold/25 bg-[#EDE8DC] px-5 py-10 shadow-[0_18px_50px_rgba(12,11,9,0.06)] sm:rounded-[22px] sm:px-8 md:px-10 lg:py-14">
          <p className="mb-3 font-sans text-[11px] font-semibold uppercase tracking-[0.22em] text-jamm-gold">
            Fragrance Guides
          </p>
          <h1 className="max-w-3xl font-serif text-4xl font-light leading-[1.08] text-jamm-dark sm:text-5xl">
            Reviews and buying guides for curated fragrances.
          </h1>
          <p className="mt-4 max-w-2xl font-sans text-base leading-relaxed text-jamm-dark/58">
            Practical notes on Arabic fragrances, scent profiles, alternatives, and how to choose the right bottle from the Jamm Trade edit.
          </p>
        </div>
      </section>

      <section className="mx-auto mt-8 grid max-w-[1560px] gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
        {articles.map((article) => (
          <GuideCard key={article.slug} article={article} />
        ))}
      </section>
    </main>
  )
}
