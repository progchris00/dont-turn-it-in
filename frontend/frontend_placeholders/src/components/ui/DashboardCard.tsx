import clsx from 'clsx'
import type { ReactNode } from 'react'

interface DashboardCardProps {
  label:       string
  value:       string | number
  valueClass?: string
  icon?:       ReactNode
  className?:  string
}

export function DashboardCard({
  label,
  value,
  valueClass,
  icon,
  className,
}: DashboardCardProps) {
  return (
    <div
      className={clsx(
        'flex flex-col gap-1 px-6 py-5 border-r border-gray-100 last:border-r-0',
        className
      )}
    >
      <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
        {label}
      </span>
      <div className="flex items-end gap-2 mt-1">
        {icon && <span className="mb-0.5">{icon}</span>}
        <span className={clsx('text-3xl font-bold tabular-nums', valueClass ?? 'text-gray-900')}>
          {value}
        </span>
      </div>
    </div>
  )
}
