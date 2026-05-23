import { useState } from 'react'
import { Search, ChevronUp, ChevronDown, Minus } from 'lucide-react'
import { RiskBadge } from '@/components/ui/RiskBadge'
import { ActionRemarkTag } from '@/components/ui/ActionRemarkTag'
import type { StudentMonitorRow, RiskLevel } from '@/types'
import clsx from 'clsx'

interface StudentMonitorTableProps {
  students: StudentMonitorRow[]
}

const RISK_OPTIONS: Array<RiskLevel | 'All'> = ['All', 'Low', 'Med', 'High']

export function StudentMonitorTable({ students }: StudentMonitorTableProps) {
  const [search,     setSearch]     = useState('')
  const [riskFilter, setRiskFilter] = useState<RiskLevel | 'All'>('All')

  const filtered = students.filter((s) => {
    const matchSearch = s.studentName.toLowerCase().includes(search.toLowerCase())
    const matchRisk   = riskFilter === 'All' || s.predictiveFlag === riskFilter
    return matchSearch && matchRisk
  })

  return (
    <section className="bg-white rounded-2xl shadow-card overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 flex flex-wrap items-center justify-between gap-3 border-b border-gray-100">
        <div>
          <span className="font-bold text-gray-900 text-sm uppercase tracking-wider">
            Student Table
          </span>
          <span className="ml-2 text-xs text-gray-400 font-medium">Manage & Monitor</span>
        </div>
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search student..."
              className="pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-brand-500 w-44"
            />
          </div>
          {/* Risk filter */}
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value as RiskLevel | 'All')}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:border-brand-500"
          >
            {RISK_OPTIONS.map((o) => (
              <option key={o} value={o}>Filter: {o}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-muted text-gray-500 text-xs uppercase tracking-wider">
              {['Student', 'Risk Score', 'Submissions', 'Avg AI%', 'Grade Trend', 'Predictive Flag', 'Actionable Remark'].map(
                (h) => (
                  <th key={h} className="px-5 py-3 text-left font-semibold whitespace-nowrap">
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-gray-400">
                  No students match your filters.
                </td>
              </tr>
            ) : (
              filtered.map((row) => (
                <StudentRow key={row.studentId} row={row} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function StudentRow({ row }: { row: StudentMonitorRow }) {
  const TrendIcon =
    row.gradeTrendDirection === 'up'
      ? ChevronUp
      : row.gradeTrendDirection === 'down'
        ? ChevronDown
        : Minus

  const trendColor = clsx(
    row.gradeTrendDirection === 'up'   && 'text-risk-low',
    row.gradeTrendDirection === 'down' && 'text-risk-high',
    row.gradeTrendDirection === 'stable' && 'text-gray-400'
  )

  return (
    <tr className="hover:bg-surface-muted/40 transition-colors">
      <td className="px-5 py-3.5 font-medium text-gray-900 whitespace-nowrap">
        {row.studentName}
      </td>
      <td className="px-5 py-3.5 tabular-nums font-semibold text-gray-700">
        {row.riskScore}%
      </td>
      <td className="px-5 py-3.5 tabular-nums text-gray-600">{row.submissionsCount}</td>
      <td className="px-5 py-3.5 tabular-nums text-gray-600">{row.avgAIPct}%</td>
      <td className="px-5 py-3.5">
        <span className={`flex items-center gap-1 font-semibold tabular-nums ${trendColor}`}>
          {row.gradeTrend}%
          <TrendIcon className="w-4 h-4" />
        </span>
      </td>
      <td className="px-5 py-3.5">
        <RiskBadge level={row.predictiveFlag} />
      </td>
      <td className="px-5 py-3.5">
        <ActionRemarkTag remark={row.actionableRemark} />
      </td>
    </tr>
  )
}
