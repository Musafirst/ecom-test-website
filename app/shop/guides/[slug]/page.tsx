import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { GuideCard } from '@/components/shop/GuideCard'
import { absoluteSiteUrl, site, siteUrl } from '@/lib/site'
import { getGuideArticle, getGuideArticles, getRelatedGuideArticles } from '@/lib/articles'

type GuidePageProps = {
  params: Promise<{
    slug: string
  }>
}

export function generateStaticParams() {
  return getGuideArticles().map((article) => ({
    slug: article.slug,
  }))
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params
  const article = getGuideArticle(slug)

  if (!article) {
    return {
      title: 'Fragrance Guide Not Found | Jamm Trade',
    }
  }

  const url = absoluteSiteUrl(`/shop/guides/${article.slug}`)

  return {
    title: `${article.title} | Jamm Trade Fragrance Guides`,
    description: article.excerpt,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      url,
      type: 'article',
      images: article.heroImage ? [absoluteSiteUrl(article.heroImage)] : undefined,
    },
  }
}

export default async function GuideArticlePage({ params }: GuidePageProps) {
  const { slug } = await params
  const article = getGuideArticle(slug)

  if (!article) notFound()

  const relatedArticles = getRelatedGuideArticles(article.slug, 3)
  const articleUrl = `${siteUrl}/shop/guides/${article.slug}`
  const articleSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${articleUrl}#article`,
        headline: article.title,
        description: article.excerpt,
        datePublished: article.date,
        dateModified: article.date,
        image: article.heroImage ? [absoluteSiteUrl(article.heroImage)] : undefined,
        author: {
          '@type': 'Organization',
          name: site.name,
        },
        publisher: {
          '@type': 'Organization',
          name: site.name,
          url: siteUrl,
        },
        mainEntityOfPage: articleUrl,
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${articleUrl}#breadcrumbs`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Shop',
            item: `${siteUrl}/shop`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Fragrance Guides',
            item: `${siteUrl}/shop/guides`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: article.title,
            item: articleUrl,
          },
        ],
      },
    ],
  }

  return (
    <main className="px-3 pb-12 pt-4 sm:px-4 lg:pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <article className="mx-auto max-w-[1120px] overflow-hidden rounded-[18px] border border-jamm-gold/25 bg-[#EDE8DC] shadow-[0_18px_50px_rgba(12,11,9,0.06)] sm:rounded-[22px]">
        {article.heroImage && (
          <div className="relative aspect-[16/9] bg-jamm-dark md:aspect-[21/9]">
            <Image
              src={article.heroImage}
              alt=""
              fill
              priority
              sizes="(max-width: 1120px) 100vw, 1120px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(12,11,9,0.72),rgba(12,11,9,0.1)_64%)]" />
          </div>
        )}

        <div className="px-5 py-8 sm:px-8 md:px-12 lg:px-16 lg:py-12">
          <Link href="/shop/guides" className="font-sans text-sm font-medium text-jamm-dark/50 transition-colors hover:text-jamm-gold">
            Fragrance Guides
          </Link>
          <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-jamm-dark/42">
            <span className="text-jamm-gold">{article.category}</span>
            <time dateTime={article.date}>
              {new Intl.DateTimeFormat('en', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              }).format(new Date(`${article.date}T00:00:00`))}
            </time>
            <span>{article.readTime}</span>
          </div>
          <h1 className="mt-4 max-w-4xl font-sans text-4xl font-semibold leading-tight text-jamm-dark sm:text-5xl lg:text-6xl">
            {article.title}
          </h1>
          <p className="mt-5 max-w-3xl font-sans text-lg leading-relaxed text-jamm-dark/62">
            {article.excerpt}
          </p>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_280px] lg:items-start">
            <div className="space-y-9">
              {article.content.map((section) => (
                <section key={section.heading}>
                  <h2 className="font-sans text-2xl font-semibold leading-tight text-jamm-dark">
                    {section.heading}
                  </h2>
                  {section.image && (
                    <figure className="mt-5 overflow-hidden rounded-lg border border-jamm-gold/20 bg-[#FAF7F2]/70">
                      <div className="relative aspect-[4/3] bg-[#F6F1E8] sm:aspect-[16/10]">
                        <Image
                          src={section.image.src}
                          alt={section.image.alt}
                          fill
                          sizes="(max-width: 1024px) 100vw, 720px"
                          className="object-contain p-5 sm:p-8"
                        />
                      </div>
                      {section.image.caption && (
                        <figcaption className="border-t border-jamm-gold/15 px-4 py-3 font-sans text-xs font-medium uppercase tracking-[0.14em] text-jamm-dark/45">
                          {section.image.caption}
                        </figcaption>
                      )}
                    </figure>
                  )}
                  <div className="mt-4 space-y-4">
                    {section.body.map((paragraph) => (
                      <p key={paragraph} className="font-sans text-base leading-8 text-jamm-dark/68">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                  {(section.notes?.length || section.bestFor) && (
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      {section.notes?.length && (
                        <div className="rounded-lg border border-jamm-gold/20 bg-[#FAF7F2]/70 p-4">
                          <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-jamm-dark/45">
                            Scent Notes
                          </h3>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {section.notes.map((note) => (
                              <span key={note} className="rounded-full border border-jamm-gold/25 bg-white/45 px-3 py-1.5 font-sans text-xs font-medium text-jamm-dark/64">
                                {note}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {section.bestFor && (
                        <div className="rounded-lg border border-jamm-gold/20 bg-[#FAF7F2]/70 p-4">
                          <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-jamm-dark/45">
                            Best For
                          </h3>
                          <p className="mt-3 font-sans text-sm font-medium leading-relaxed text-jamm-dark/68">
                            {section.bestFor}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </section>
              ))}
            </div>

            <aside className="rounded-lg border border-jamm-gold/20 bg-[#FAF7F2]/70 p-5">
              <h2 className="font-sans text-sm font-semibold uppercase tracking-[0.16em] text-jamm-dark/48">
                {article.relatedProducts?.length ? 'Available at Jamm Trade' : 'Shop Fragrances'}
              </h2>
              <div className="mt-4 flex flex-col gap-3">
                {article.relatedProducts?.map((product) => (
                  product.handle ? (
                    <Link
                      key={product.label}
                      href={`/shop/product/${product.handle}`}
                      className="rounded-md border border-jamm-gold/20 bg-white/40 px-4 py-3 font-sans text-sm font-medium text-jamm-dark/68 transition-colors hover:border-jamm-gold/45 hover:text-jamm-gold"
                    >
                      {product.label}
                    </Link>
                  ) : (
                    <Link
                      key={product.label}
                      href="/shop#fragrance"
                      className="rounded-md border border-jamm-gold/20 bg-white/40 px-4 py-3 font-sans text-sm font-medium text-jamm-dark/68 transition-colors hover:border-jamm-gold/45 hover:text-jamm-gold"
                    >
                      {product.label}
                    </Link>
                  )
                ))}
                {!article.relatedProducts?.length && (
                  <Link href="/shop#fragrance" className="font-sans text-sm font-medium text-jamm-gold">
                    Browse fragrances
                  </Link>
                )}
              </div>
            </aside>
          </div>
        </div>
      </article>

      <section className="mx-auto mt-8 max-w-[1120px] rounded-[18px] border border-jamm-gold/25 bg-jamm-dark px-5 py-8 text-jamm-cream sm:px-8 md:px-10">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-jamm-gold">
              Jamm Trade
            </p>
            <h2 className="mt-2 font-sans text-2xl font-semibold">Shop Trending Fragrances</h2>
          </div>
          <Link
            href="/shop#fragrance"
            className="inline-flex min-h-11 w-fit items-center rounded-md bg-jamm-gold px-5 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-jamm-dark transition-colors duration-200 hover:bg-jamm-cream"
          >
            Explore Fragrances
          </Link>
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-[1120px]">
        <div className="mb-5 flex items-end justify-between gap-4">
          <h2 className="font-sans text-2xl font-semibold text-jamm-dark">Related Fragrance Guides</h2>
          <Link href="/shop/guides" className="font-sans text-sm font-medium text-jamm-dark/50 transition-colors hover:text-jamm-gold">
            View all
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {relatedArticles.map((related) => (
            <GuideCard key={related.slug} article={related} compact />
          ))}
        </div>
      </section>
    </main>
  )
}
