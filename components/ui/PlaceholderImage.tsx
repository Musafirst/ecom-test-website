export type PlaceholderVariant = 'perfume' | 'clothing' | 'electronics' | 'collection' | 'generic'
export type PlaceholderTheme = 'cream' | 'dark'

function PerfumeBottleSVG({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const cls = size === 'lg' ? 'w-28 h-44' : size === 'sm' ? 'w-10 h-16' : 'w-16 h-24'
  return (
    <svg viewBox="0 0 120 210" fill="none" xmlns="http://www.w3.org/2000/svg" className={cls} aria-hidden="true">
      {/* Cap */}
      <rect x="42" y="26" width="36" height="20" rx="5" fill="rgba(196,151,58,0.22)" stroke="rgba(196,151,58,0.55)" strokeWidth="1.3" />
      {/* Spray nozzle */}
      <rect x="88" y="32" width="14" height="7" rx="2" fill="rgba(196,151,58,0.3)" stroke="rgba(196,151,58,0.5)" strokeWidth="1" />
      {/* Neck */}
      <rect x="50" y="44" width="20" height="26" rx="3" fill="rgba(196,151,58,0.14)" stroke="rgba(196,151,58,0.48)" strokeWidth="1.3" />
      {/* Shoulder */}
      <path d="M36 70 Q60 58 84 70" stroke="rgba(196,151,58,0.48)" strokeWidth="1.3" fill="rgba(196,151,58,0.1)" />
      {/* Body */}
      <rect x="26" y="70" width="68" height="122" rx="10" fill="rgba(196,151,58,0.09)" stroke="rgba(196,151,58,0.42)" strokeWidth="1.3" />
      {/* Label frame */}
      <rect x="34" y="92" width="52" height="76" rx="2" fill="rgba(196,151,58,0.06)" stroke="rgba(196,151,58,0.22)" strokeWidth="1" />
      {/* Label lines */}
      <line x1="42" y1="112" x2="78" y2="112" stroke="rgba(196,151,58,0.38)" strokeWidth="0.9" />
      <line x1="47" y1="122" x2="73" y2="122" stroke="rgba(196,151,58,0.28)" strokeWidth="0.8" />
      <line x1="50" y1="131" x2="70" y2="131" stroke="rgba(196,151,58,0.22)" strokeWidth="0.7" />
      {/* Brand dot */}
      <circle cx="60" cy="100" r="3" fill="rgba(196,151,58,0.45)" />
      {/* Bottom detail */}
      <line x1="34" y1="178" x2="86" y2="178" stroke="rgba(196,151,58,0.22)" strokeWidth="0.8" />
    </svg>
  )
}

function HoodieSVG() {
  return (
    <svg viewBox="0 0 140 130" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-24 h-20" aria-hidden="true">
      {/* Left sleeve */}
      <path d="M26 56 L4 90 L22 97 L36 62" fill="rgba(196,151,58,0.1)" stroke="rgba(196,151,58,0.48)" strokeWidth="1.3" strokeLinejoin="round" />
      {/* Right sleeve */}
      <path d="M114 56 L136 90 L118 97 L104 62" fill="rgba(196,151,58,0.1)" stroke="rgba(196,151,58,0.48)" strokeWidth="1.3" strokeLinejoin="round" />
      {/* Body */}
      <path d="M26 56 L16 118 L124 118 L114 56" fill="rgba(196,151,58,0.08)" stroke="rgba(196,151,58,0.45)" strokeWidth="1.3" strokeLinejoin="round" />
      {/* Hood left */}
      <path d="M48 56 Q28 36 38 16 Q55 2 70 18" fill="rgba(196,151,58,0.1)" stroke="rgba(196,151,58,0.48)" strokeWidth="1.3" />
      {/* Hood right */}
      <path d="M92 56 Q112 36 102 16 Q85 2 70 18" fill="rgba(196,151,58,0.1)" stroke="rgba(196,151,58,0.48)" strokeWidth="1.3" />
      {/* Neckline */}
      <path d="M48 56 Q70 46 92 56" stroke="rgba(196,151,58,0.45)" strokeWidth="1.3" fill="none" />
      {/* Logo mark */}
      <circle cx="70" cy="82" r="8" stroke="rgba(196,151,58,0.4)" strokeWidth="1" fill="rgba(196,151,58,0.08)" />
      <circle cx="70" cy="82" r="3" fill="rgba(196,151,58,0.35)" />
    </svg>
  )
}

function HeadphonesSVG() {
  return (
    <svg viewBox="0 0 140 110" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-24 h-16" aria-hidden="true">
      {/* Headband */}
      <path d="M22 68 Q22 16 70 16 Q118 16 118 68" stroke="rgba(196,151,58,0.52)" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      {/* Left cup */}
      <rect x="8" y="60" width="26" height="36" rx="9" fill="rgba(196,151,58,0.12)" stroke="rgba(196,151,58,0.48)" strokeWidth="1.3" />
      <rect x="13" y="65" width="16" height="26" rx="6" fill="rgba(196,151,58,0.08)" stroke="rgba(196,151,58,0.28)" strokeWidth="0.9" />
      {/* Right cup */}
      <rect x="106" y="60" width="26" height="36" rx="9" fill="rgba(196,151,58,0.12)" stroke="rgba(196,151,58,0.48)" strokeWidth="1.3" />
      <rect x="111" y="65" width="16" height="26" rx="6" fill="rgba(196,151,58,0.08)" stroke="rgba(196,151,58,0.28)" strokeWidth="0.9" />
      {/* Center accent */}
      <circle cx="70" cy="16" r="5" fill="rgba(196,151,58,0.3)" stroke="rgba(196,151,58,0.5)" strokeWidth="1" />
    </svg>
  )
}

function GenericSVG() {
  return (
    <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" aria-hidden="true">
      <rect x="10" y="10" width="60" height="60" rx="6" stroke="rgba(196,151,58,0.35)" strokeWidth="1.2" fill="rgba(196,151,58,0.06)" />
      <circle cx="40" cy="40" r="12" stroke="rgba(196,151,58,0.35)" strokeWidth="1" fill="rgba(196,151,58,0.08)" />
      <circle cx="40" cy="40" r="4" fill="rgba(196,151,58,0.4)" />
    </svg>
  )
}

interface PlaceholderImageProps {
  label?: string
  aspectRatio?: string
  className?: string
  variant?: PlaceholderVariant
  theme?: PlaceholderTheme
  bottleSize?: 'sm' | 'md' | 'lg'
}

// Development placeholder. Replace by adding `images: string[]` to JammProduct
// and rendering next/image with the first image URL in ProductCard.
export function PlaceholderImage({
  label,
  aspectRatio = '1/1',
  className = '',
  variant = 'generic',
  theme = 'cream',
  bottleSize = 'md',
}: PlaceholderImageProps) {
  const bgDark = 'bg-gradient-to-b from-[#1C1812] to-[#0C0B09]'
  const bgCream = 'bg-gradient-to-b from-[#EDE8DF] to-[#E4DDD1]'

  const bg = theme === 'cream' ? bgCream : bgDark

  return (
    <div
      className={`relative flex flex-col items-center justify-center w-full overflow-hidden ${bg} ${className}`}
      style={{ aspectRatio }}
    >
      {/* Lotus pattern — very faint */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: "url('/brand_assets/patterns/jammtrade-lotus-repeat-pattern-dark.png')",
          backgroundRepeat: 'repeat',
          backgroundSize: '80px',
        }}
      />

      {/* Gold border */}
      <div className="absolute inset-0 border border-jamm-gold/15" />

      {/* SVG illustration */}
      <div className="relative z-10 flex flex-col items-center gap-3">
        {variant === 'perfume' && <PerfumeBottleSVG size={bottleSize} />}
        {variant === 'clothing' && <HoodieSVG />}
        {variant === 'electronics' && <HeadphonesSVG />}
        {(variant === 'generic' || variant === 'collection') && <GenericSVG />}

        {label && (
          <span className="text-jamm-gold/40 text-[9px] font-sans tracking-[0.18em] uppercase text-center px-4 leading-relaxed">
            {label}
          </span>
        )}
      </div>
    </div>
  )
}
