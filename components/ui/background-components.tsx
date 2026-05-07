'use client'

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface BackgroundComponentsProps {
  children?: ReactNode
  className?: string
}

export const Component = ({ children, className }: BackgroundComponentsProps) => {
  return (
    <div className={cn('relative min-h-screen w-full overflow-hidden bg-[#fafafa] text-gray-900', className)}>
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at center, #FFF991 0%, transparent 70%)
          `,
          opacity: 0.6,
          mixBlendMode: 'multiply',
        }}
      />
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            repeating-linear-gradient(45deg, rgba(0, 0, 0, 0.1) 0, rgba(0, 0, 0, 0.1) 1px, transparent 1px, transparent 20px),
            repeating-linear-gradient(-45deg, rgba(0, 0, 0, 0.1) 0, rgba(0, 0, 0, 0.1) 1px, transparent 1px, transparent 20px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
      <div className="relative z-10 min-h-screen">{children}</div>
    </div>
  )
}

export default Component
