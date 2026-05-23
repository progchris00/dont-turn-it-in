/**
 * AnalyticsChart — a thin wrapper around Recharts components.
 * Each chart type is isolated so it's easy to swap the library later.
 */
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, ScatterChart, Scatter, CartesianGrid, ReferenceLine,
} from 'recharts'
import type { Analytics } from '@/types'

interface Props { analytics: Analytics }

export function WeeklyTrendChart({ analytics }: Props) {
  return (
    <ResponsiveContainer width="100%" height={160}>
      <LineChart data={analytics.weeklyTrend} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
        <XAxis dataKey="week" tick={{ fontSize: 10 }} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
        <Tooltip formatter={(v: number) => `${v}%`} />
        <Line type="monotone" dataKey="avgAI" stroke="#ea3a07" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}

export function PredictiveForecastChart({ analytics }: Props) {
  return (
    <ResponsiveContainer width="100%" height={160}>
      <LineChart data={analytics.predictiveForecast} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
        <XAxis dataKey="week" tick={{ fontSize: 10 }} />
        <YAxis tick={{ fontSize: 10 }} />
        <Tooltip />
        <ReferenceLine y={100} stroke="#f59e0b" strokeDasharray="4 2" />
        <Line type="monotone" dataKey="avgAI" stroke="#ea3a07" strokeWidth={2} dot={false} strokeDasharray="5 3" />
      </LineChart>
    </ResponsiveContainer>
  )
}

export function AIDistributionChart({ analytics }: Props) {
  const COLORS: Record<string, string> = {
    'Very High': '#ef4444',
    Moderate:    '#f97316',
    Low:         '#f59e0b',
    'Very Low':  '#d1d5db',
  }
  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart data={analytics.aiDistribution} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
        <XAxis dataKey="label" tick={{ fontSize: 9 }} />
        <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
        <Tooltip />
        <Bar dataKey="count" radius={[4, 4, 0, 0]}
          fill="#ea3a07"
          label={{ position: 'top', fontSize: 10 }}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function GradeVsAIChart({ analytics }: Props) {
  return (
    <ResponsiveContainer width="100%" height={160}>
      <ScatterChart margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="aiPct" name="AI %" type="number" domain={[0, 100]} tick={{ fontSize: 10 }} />
        <YAxis dataKey="grade" name="Grade %" domain={[0, 100]} tick={{ fontSize: 10 }} />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        <Scatter data={analytics.gradeVsAI} fill="#ea3a07" fillOpacity={0.7} />
      </ScatterChart>
    </ResponsiveContainer>
  )
}
