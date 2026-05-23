import { RiskLevel } from '@/types'
import { RISK_THRESHOLDS } from '@/constants'

/** Format ISO datetime to a readable string */
export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'numeric',
    day:   'numeric',
    year:  'numeric',
    hour:  'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

/** Format ISO date only */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'numeric',
    day:   'numeric',
    year:  'numeric',
  })
}

/** Derive risk level from an AI likelihood percentage */
export function getRiskLevel(aiPct: number): RiskLevel {
  if (aiPct >= RISK_THRESHOLDS.HIGH) return 'High'
  if (aiPct >= RISK_THRESHOLDS.MED)  return 'Med'
  if (aiPct >= RISK_THRESHOLDS.LOW)  return 'Low'
  return 'Low'
}

/** Clamp a number between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/** Return tailwind color class based on AI likelihood */
export function aiLikelihoodColor(pct: number): string {
  if (pct >= RISK_THRESHOLDS.HIGH) return 'text-risk-high'
  if (pct >= RISK_THRESHOLDS.MED)  return 'text-risk-med'
  return 'text-risk-low'
}

/** Truncate file name for display */
export function truncateFileName(name: string, max = 28): string {
  if (name.length <= max) return name
  const ext = name.split('.').pop() ?? ''
  return `${name.slice(0, max - ext.length - 4)}...${ext}`
}
