'use client'

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface BackgroundComponentsProps {
  children?: ReactNode
  className?: string
}

export const Component = ({ children, className }: BackgroundComponentsProps) => {
  return (
    <div className={cn('relative min-h-screen w-full text-gray-900', className)}>
      <div className="relative z-10 min-h-screen">{children}</div>
    </div>
  )
}

export default Component
