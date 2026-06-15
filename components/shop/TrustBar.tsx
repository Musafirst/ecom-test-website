const items = [
  {
    name: 'Authentic Products',
    desc: 'Every item sourced and verified.',
    icon: <><path d="M12 3l7 3v5c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6z" /><path d="M9 12l2 2 4-4" /></>,
  },
  {
    name: 'Reliable Shipping',
    desc: 'Clear delivery options at checkout.',
    icon: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" /></>,
  },
  {
    name: 'Premium Quality',
    desc: 'Curated with intention.',
    icon: <path d="M12 3l2.4 5 5.6.7-4 4 1 5.6L12 20l-5 2.3 1-5.6-4-4 5.6-.7z" />,
  },
  {
    name: 'Secure Checkout',
    desc: 'Your data, protected.',
    icon: <><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>,
  },
]

export function TrustBar() {
  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="container">
        <div className="trust reveal">
          <div className="trust__grid">
            {items.map((item) => (
              <div className="trust__item" key={item.name}>
                <span className="trust__icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">{item.icon}</svg>
                </span>
                <span className="trust__name">{item.name}</span>
                <span className="trust__desc">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
