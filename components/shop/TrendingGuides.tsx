import Link from 'next/link'
import { getFeaturedGuideArticles } from '@/lib/articles'
import { GuideCard } from '@/components/shop/GuideCard'

export function TrendingGuides() {
  const articles = getFeaturedGuideArticles()

  return (
    <section className="section" id="guides" style={{ paddingTop: 0 }}>
      <div className="container">
        <div className="section-head">
          <div className="head-left reveal">
            <p className="eyebrow">Fragrance Guides</p>
            <h2 className="section-title">Trending Fragrance Guides</h2>
          </div>
          <Link className="link-arrow reveal" href="/shop/guides">
            View all guides
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </Link>
          <div className="rule" />
        </div>

        <div className="guides-grid">
          {articles.map((article) => (
            <GuideCard key={article.slug} article={article} />
          ))}
        </div>
      </div>
    </section>
  )
}
