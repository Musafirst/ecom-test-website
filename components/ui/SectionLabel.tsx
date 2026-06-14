interface SectionLabelProps {
  children: React.ReactNode
  className?: string
}

// Deep, legible gold on light backgrounds (was text-jamm-gold / no weight).
// Use this for kickers/eyebrows that sit on the cream page — NOT on dark surfaces.
export function SectionLabel({ children, className = '' }: SectionLabelProps) {
  return (
    <p className={`text-jamm-gold-deep text-[11px] font-semibold tracking-[0.32em] uppercase font-sans ${className}`}>
      {children}
    </p>
  )
}
