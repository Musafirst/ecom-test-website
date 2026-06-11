import Image from 'next/image'
import Link from 'next/link'
import type { GuideArticle } from '@/lib/articles'

type GuideCardProps = {
  article: GuideArticle
  compact?: boolean
}

export function GuideCard({ article, compact = false }: GuideCardProps) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-jamm-gold/20 bg-[#EDE8DC]/70 shadow-[0_16px_38px_rgba(12,11,9,0.06)] transition-[border-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-jamm-gold/45 hover:shadow-[0_22px_48px_rgba(12,11,9,0.09)]">
      {article.heroImage && !compact && (
        <Link href={`/shop/guides/${article.slug}`} className="relative block aspect-[16/9] overflow-hidden bg-jamm-dark">
          <Image
            src={article.heroImage}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover opacity-88 transition-transform duration-500 group-hover:scale-[1.035]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(12,11,9,0.58),transparent_58%)]" />
        </Link>
      )}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-jamm-dark/42">
          <span className="text-jamm-gold">{article.category}</span>
          <span>{article.readTime}</span>
        </div>
        <h3 className="font-sans text-xl font-semibold leading-tight text-jamm-dark sm:text-2xl">
          <Link href={`/shop/guides/${article.slug}`} className="transition-colors duration-150 hover:text-jamm-gold">
            {article.title}
          </Link>
        </h3>
        <p className="mt-3 flex-1 font-sans text-sm leading-relaxed text-jamm-dark/58">
          {article.excerpt}
        </p>
        <Link
          href={`/shop/guides/${article.slug}`}
          className="mt-5 inline-flex min-h-11 w-fit items-center rounded-md bg-jamm-dark px-4 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-jamm-cream transition-colors duration-200 hover:bg-jamm-gold hover:text-jamm-dark"
        >
          Read Guide
        </Link>
      </div>
    </article>
  )
}
