import Link from 'next/link'
import type { GuideArticle } from '@/lib/articles'

type GuideCardProps = {
  article: GuideArticle
  compact?: boolean
}

export function GuideCard({ article }: GuideCardProps) {
  return (
    <article className="guide reveal">
      <div className="guide__meta">
        <span className="tag">{article.category}</span>
        <span className="read">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
          {article.readTime}
        </span>
      </div>
      <h3 className="guide__title">
        <Link href={`/shop/guides/${article.slug}`}>{article.title}</Link>
      </h3>
      <p className="guide__excerpt">{article.excerpt}</p>
      <Link className="btn btn--dark" href={`/shop/guides/${article.slug}`}>Read Guide</Link>
    </article>
  )
}
