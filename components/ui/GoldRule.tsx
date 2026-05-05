interface GoldRuleProps {
  className?: string
}

export function GoldRule({ className = '' }: GoldRuleProps) {
  return (
    <div
      className={`h-px bg-gradient-to-r from-transparent via-jamm-gold/30 to-transparent ${className}`}
    />
  )
}
