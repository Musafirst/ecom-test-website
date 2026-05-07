'use client'

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface BackgroundComponentsProps {
  children?: ReactNode
  className?: string
}

export const Component = ({ children, className }: BackgroundComponentsProps) => {
  return (
    <div className={cn('relative min-h-screen w-full overflow-hidden bg-[#FAF7F2] text-gray-900', className)}>
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: `
            repeating-linear-gradient(22.5deg, transparent, transparent 2px, rgba(75, 85, 99, 0.06) 2px, rgba(75, 85, 99, 0.06) 3px, transparent 3px, transparent 8px),
            repeating-linear-gradient(67.5deg, transparent, transparent 2px, rgba(107, 114, 128, 0.05) 2px, rgba(107, 114, 128, 0.05) 3px, transparent 3px, transparent 8px),
            repeating-linear-gradient(112.5deg, transparent, transparent 2px, rgba(55, 65, 81, 0.04) 2px, rgba(55, 65, 81, 0.04) 3px, transparent 3px, transparent 8px),
            repeating-linear-gradient(157.5deg, transparent, transparent 2px, rgba(31, 41, 55, 0.03) 2px, rgba(31, 41, 55, 0.03) 3px, transparent 3px, transparent 8px)
          `,
        }}
      />
      <div className="relative z-10 min-h-screen">{children}</div>
    </div>
  )
}

export default Component
