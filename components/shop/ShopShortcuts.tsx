import Link from 'next/link'

interface ShopShortcutsProps {
  collectionCounts: { oud: string; amber: string; daily: string }
}

const arrow = (
  <svg className="qcard__arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M7 17 17 7M9 7h8v8" />
  </svg>
)

export function ShopShortcuts({ collectionCounts }: ShopShortcutsProps) {
  const cards = [
    { name: 'Perfumes', eyebrow: 'Oud · Amber · Daily', href: '/shop/category/perfumes' },
    { name: 'Oud', eyebrow: collectionCounts.oud, href: '/shop/collection/oud' },
    { name: 'Electronics', eyebrow: 'Audio · Tech', href: '/shop/category/electronics' },
    { name: 'Clothing', eyebrow: 'Wear the mark', href: '/shop/category/clothing' },
  ]

  return (
    <section className="quicklinks">
      <div className="container">
        <div className="quicklinks__scroll">
          {cards.map((card) => (
            <Link className="qcard" href={card.href} key={card.name}>
              <span className="qcard__eyebrow">{card.eyebrow}</span>
              <span className="qcard__row">
                <span className="qcard__name">{card.name}</span>
                {arrow}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
