import Link from 'next/link'

interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'outline' | 'ghost'
  href?: string
  onClick?: () => void
  className?: string
  type?: 'button' | 'submit'
  external?: boolean
}

export function Button({
  children,
  variant = 'primary',
  href,
  onClick,
  className = '',
  type = 'button',
  external = false,
}: ButtonProps) {
  const base =
    'inline-block text-[11px] tracking-[0.22em] uppercase font-sans font-medium transition-all duration-300 cursor-pointer'

  const variants = {
    primary: 'bg-jamm-gold text-jamm-dark px-8 py-4 hover:bg-jamm-gold-light',
    outline:
      'border border-jamm-gold/40 text-jamm-gold px-8 py-4 hover:bg-jamm-gold hover:text-jamm-dark hover:border-jamm-gold',
    ghost: 'text-jamm-cream/50 hover:text-jamm-cream/80',
  }

  const classes = `${base} ${variants[variant]} ${className}`

  if (href) {
    return (
      <Link
        href={href}
        className={classes}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
      >
        {children}
      </Link>
    )
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  )
}
