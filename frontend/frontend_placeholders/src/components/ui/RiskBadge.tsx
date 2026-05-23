import clsx from 'clsx'
import type { RiskLevel } from '@/types'

interface RiskBadgeProps {
  level: RiskLevel
  className?: string
}

const CONFIG: Record<RiskLevel, { dot: string; text: string; bg: string }> = {
  Low:       { dot: 'bg-risk-low',  text: 'text-risk-low',  bg: 'bg-green-50' },
  Med:       { dot: 'bg-risk-med',  text: 'text-risk-med',  bg: 'bg-amber-50' },
  High:      { dot: 'bg-risk-high', text: 'text-risk-high', bg: 'bg-red-50'   },
  'Very High': { dot: 'bg-risk-high', text: 'text-risk-high', bg: 'bg-red-50' },
}

export function RiskBadge({ level, className }: RiskBadgeProps) {
  const { dot, text, bg } = CONFIG[level]
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium',
        bg,
        text,
        className
      )}
    >
      <span className={clsx('w-1.5 h-1.5 rounded-full', dot)} />
      {level}
    </span>
  )
}
