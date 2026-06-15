import Link from 'next/link'
import type { JammProduct } from '@/types/product'

interface SecondaryCategoriesProps {
  electronicsProducts: JammProduct[]
}

const clothingImage = 'https://cdn.shopify.com/s/files/1/0795/9379/9907/files/unisex-heavyweight-hooded-sweatshirt-black-front-6a18dc6bbde52.jpg?v=1780014207'
const electronicsFallbackImage = 'https://cdn.shopify.com/s/files/1/0795/9379/9907/files/6c64ba8bb8e9c9b48f05aa6bc781d8f4a4aaeaf837568040ae191a5112c5343a.jpg?v=1779056822'

export function SecondaryCategories({ electronicsProducts }: SecondaryCategoriesProps) {
  const electronicsImage = electronicsProducts[0]?.image ?? electronicsFallbackImage

  return (
    <section className="section" id="beyond" style={{ paddingTop: 0 }}>
      <div className="container">
        <div className="section-head">
          <div className="head-left reveal">
            <p className="eyebrow">Also Available</p>
            <h2 className="section-title">Beyond fragrance</h2>
            <p className="section-sub">A small selection of essentials that fits the same curated standard.</p>
          </div>
          <div className="rule" />
        </div>

        <div className="beyond">
          <article className="collection reveal">
            <div className="collection__inner">
              <div className="collection__img"><img src={clothingImage} alt="Jamm Trade Heritage Hoodie" loading="lazy" /></div>
              <span className="collection__tab">Clothing</span>
              <div className="collection__content">
                <span className="collection__count">Wear the mark.</span>
                <h3 className="collection__name">Clothing</h3>
                <p className="collection__desc">Hoodies, tees, and essentials with the Jamm Trade lotus mark.</p>
                <Link className="btn btn--ghost" href="/shop/collection/clothing">Shop Clothing</Link>
              </div>
            </div>
          </article>

          <article className="collection reveal">
            <div className="collection__inner">
              <div className="collection__img"><img src={electronicsImage} alt="Premium audio and electronics" loading="lazy" /></div>
              <span className="collection__tab">Electronics</span>
              <div className="collection__content">
                <span className="collection__count">Precision essentials.</span>
                <h3 className="collection__name">Electronics</h3>
                <p className="collection__desc">Premium audio and everyday electronics selected for quality and focus.</p>
                <Link className="btn btn--ghost" href="/shop/category/electronics">Shop Electronics</Link>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
