import Link from 'next/link'

interface PolicySection {
  heading: string
  body: string[]
}

interface PolicyPageProps {
  label?: string
  title: string
  intro?: string
  sections?: PolicySection[]
  /** Raw HTML body fetched live from Shopify. When present, replaces intro + sections. */
  html?: string
  updated?: string
}

export function PolicyPage({ label = 'Shop policy', title, intro, sections, html, updated = 'May 18, 2026' }: PolicyPageProps) {
  return (
    <section className="bg-transparent px-3 py-10 text-jamm-dark sm:px-4 lg:py-16">
      <div className="mx-auto max-w-[900px] rounded-lg border border-jamm-gold/20 bg-[#FAF7F2]/92 px-6 py-10 shadow-[0_18px_50px_rgba(12,11,9,0.06)] sm:px-10 sm:py-12">
        <p className="mb-3 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-jamm-gold">
          {label}
        </p>
        <h1 className="font-serif text-4xl font-light leading-tight text-jamm-dark sm:text-6xl">
          {title}
        </h1>
        <p className="mt-3 font-sans text-xs text-jamm-muted">
          Last updated: {updated}
        </p>

        {html ? (
          /* Live content fetched from Shopify admin */
          <div
            className="mt-8 border-t border-jamm-gold/18 pt-8 font-sans text-sm leading-relaxed text-jamm-dark/68
              [&_a]:text-jamm-gold [&_a:hover]:underline
              [&_h2]:mb-3 [&_h2]:mt-7 [&_h2]:font-sans [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-jamm-dark [&_h2:first-child]:mt-0
              [&_p]:mb-3
              [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-5
              [&_li]:mb-1"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          /* Static fallback */
          <>
            {intro && (
              <p className="mt-4 font-sans text-sm leading-relaxed text-jamm-dark/68 sm:text-base">
                {intro}
              </p>
            )}
            <div className="mt-8 space-y-7 border-t border-jamm-gold/18 pt-8">
              {sections?.map((section) => (
                <section key={section.heading}>
                  <h2 className="font-sans text-base font-semibold text-jamm-dark">
                    {section.heading}
                  </h2>
                  <div className="mt-3 space-y-3 font-sans text-sm leading-relaxed text-jamm-dark/68">
                    {section.body.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </>
        )}

        <Link
          href="/shop/contact"
          className="mt-8 inline-flex rounded-md bg-jamm-dark px-5 py-3 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition-colors duration-200 hover:bg-jamm-gold hover:text-jamm-dark"
        >
          Contact Jamm Trade
        </Link>
      </div>
    </section>
  )
}
