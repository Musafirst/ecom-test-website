import Link from 'next/link'

interface CollectionGridProps {
  counts: { oud: string; amber: string; daily: string }
}

const collections = [
  { key: 'oud', name: 'Oud', tab: 'Oud', desc: 'Resinous, dark, and long lasting.', bg: 'radial-gradient(110% 90% at 70% 8%,#3a2b1c,#1c150d 58%,#0c0907)', lotusOpacity: 0.08, image: '/images/collections/featured-oud.png', alt: 'Oud fragrance collection' },
  { key: 'amber', name: 'Amber', tab: 'Amber', desc: 'Warm vanilla, soft spice, skin-close depth.', bg: 'radial-gradient(110% 90% at 70% 8%,#4a3a1e,#241a0d 58%,#0d0a06)', lotusOpacity: 0.08, image: '/images/collections/featured-amber.png', alt: 'Amber fragrance collection' },
  { key: 'daily', name: 'Daily', tab: 'Daily', desc: 'Clean signatures for repeat wear.', bg: 'radial-gradient(110% 90% at 70% 8%,#2f3230,#181917 58%,#0a0b0a)', lotusOpacity: 0.07, image: '/images/collections/featured-daily.png', alt: 'Daily fragrance collection' },
] as const

export function CollectionGrid({ counts }: CollectionGridProps) {
  return (
    <section className="section" id="collections" style={{ paddingTop: 0 }}>
      <div className="container">
        <div className="section-head">
          <div className="head-left reveal">
            <p className="eyebrow">Collections</p>
            <h2 className="section-title">Shop by scent family</h2>
            <p className="section-sub">Choose by mood first, then explore the products inside each edit.</p>
          </div>
          <div className="rule" />
        </div>

        <div className="collections">
          {collections.map((c) => (
            <Link
              className="collection reveal"
              href={`/shop/collection/${c.key}`}
              key={c.key}
              aria-label={`Explore ${c.name} collection`}
            >
              <div className="collection__inner">
                <div className="collection__media-fallback" style={{ background: c.bg }} />
                <img src="/design/logo-gold.png" alt="" className="slide__lotus" style={{ opacity: c.lotusOpacity, right: '-8%', bottom: '-10%', width: '70%' }} />
                <div className="collection__img collection__img--scent">
                  <img src={c.image} alt={c.alt} loading="lazy" />
                </div>
                <span className="collection__tab">{c.tab}</span>
                <div className="collection__content">
                  <span className="collection__count">{counts[c.key]}</span>
                  <h3 className="collection__name">{c.name}</h3>
                  <p className="collection__desc">{c.desc}</p>
                  <span className="btn btn--ghost">Explore</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
