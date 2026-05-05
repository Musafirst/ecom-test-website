interface SectionLabelProps {
  children: React.ReactNode
  className?: string
}

export function SectionLabel({ children, className = '' }: SectionLabelProps) {
  return (
    <p className={`text-jamm-gold text-[11px] tracking-[0.35em] uppercase font-sans ${className}`}>
      {children}
    </p>
  )
}
