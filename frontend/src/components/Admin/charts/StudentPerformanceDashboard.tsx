import { useState } from "react"

import { ClassAITrendChart } from "./ClassAITrendChart"
import type { PerformanceStudent } from "./dashboardData"
import { RISK_BG } from "./dashboardData"
import { RiskDistributionChart } from "./RiskDistributionChart"
import { StudentForecastChart } from "./StudentForecastChart"
import type { StudentPerformanceDashboardApiProps } from "./StudentPerformanceDashboardApi"

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Reusable section card wrapper */
function Card({
  title,
  subtitle,
  children,
  className = "",
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section
      className={`overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm ${className}`}
    >
      <header className="border-b border-gray-100 px-5 py-4">
        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-800">
          {title}
        </h2>
        {subtitle && <p className="mt-0.5 text-xs text-gray-400">{subtitle}</p>}
      </header>
      <div className="p-5">{children}</div>
    </section>
  )
}

// ─── Student table row ────────────────────────────────────────────────────────

interface StudentRowProps {
  student: PerformanceStudent
  isSelected: boolean
  onSelect: (student: PerformanceStudent) => void
}

function StudentTableRow({ student, isSelected, onSelect }: StudentRowProps) {
  const riskCls = RISK_BG[student.riskLevel]

  return (
    <tr
      onClick={() => onSelect(student)}
      className={`cursor-pointer border-b border-gray-100 text-sm transition-colors last:border-0 ${
        isSelected
          ? "bg-orange-50 outline outline-1 outline-orange-200"
          : "hover:bg-gray-50"
      }`}
      aria-selected={isSelected}
    >
      <td className="py-3 pl-4 pr-3 font-medium text-gray-800">
        {student.name}
      </td>

      <td className="px-3 py-3">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${riskCls}`}
        >
          {student.riskLevel}
        </span>
      </td>

      <td className="px-3 py-3 tabular-nums text-gray-700">
        {student.avgAiPercent}%
      </td>

      <td className="px-3 py-3 tabular-nums text-gray-700">
        {student.gradePercent}%
      </td>

      <td className="px-3 py-3 tabular-nums text-gray-500">
        {student.submissions}
      </td>

      <td className="py-3 pl-3 pr-4 text-gray-500">
        {student.actionableRemark}
      </td>
    </tr>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

/**
 * StudentPerformanceDashboard
 * Three-section performance tracking dashboard: can remove if not needed
 *
 *  ┌─────────────────────────────────────────┐
 *  │  1. Class AI Trend (line chart)          │
 *  ├─────────────────────────────────────────┤
 *  │  2. Risk Distribution (bar chart)        │
 *  ├──────────────────────┬──────────────────┤
 *  │  3a. Student Table   │  3b. Forecast    │
 *  └──────────────────────┴──────────────────┘
 *
 * Selecting a table row updates the forecast chart (3b) in real time.
 * Selecting a row also highlights its corresponding risk-level bar (2).
 *
 * Replace MOCK_* constants with API calls when backend is ready.
 */
export function StudentPerformanceDashboard({
  classTrend,
  aiDistribution,
  students,
}: StudentPerformanceDashboardApiProps) {
  // kept for future table/forecast wiring
  void students
  const [selectedStudent, setSelectedStudent] =
    useState<PerformanceStudent | null>(null)

  function handleSelect(student: PerformanceStudent) {
    // Deselect if same row clicked again
    setSelectedStudent((prev) => (prev?.id === student.id ? null : student))
  }

  return (
    <div className="flex flex-col gap-5">
      {/* ── Sections 1 & 2: Side-by-side charts ── */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Section 1: Class-wide AI trend */}
        <Card
          title="Class AI Usage Trend"
          subtitle="Average AI % across all students — weekly"
          className="min-h-[320px]"
        >
          <div className="min-h-[280px]">
            <ClassAITrendChart data={classTrend} />
          </div>
        </Card>

        {/* Section 2: Risk level distribution */}
        <Card
          title="Risk Level Distribution"
          subtitle={
            selectedStudent
              ? `Highlighting: ${selectedStudent.riskLevel}`
              : "Number of students per risk category"
          }
          className="min-h-[320px]"
        >
          <div className="min-h-[260px]">
            <RiskDistributionChart
              data={aiDistribution}
              highlightLabel={selectedStudent?.riskLevel}
            />
          </div>
        </Card>
      </div>

      {/* ── Section 3: Forecast above table ── */}
      <div className="flex flex-col gap-5">
        {/* 3b — Dynamic per-student forecast */}
        <section className="min-h-[360px] rounded-xl border border-gray-200 bg-white shadow-sm">
          <header className="border-b border-gray-100 px-5 py-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-800">
              Predictive Forecast
            </h2>
            <p className="mt-0.5 min-h-[1rem] text-xs text-gray-400 transition-all">
              {selectedStudent
                ? `${selectedStudent.name} — ${selectedStudent.riskLevel} risk`
                : "No student selected"}
            </p>
          </header>

          <div className="p-5">
            <div className="min-h-[260px]">
              <StudentForecastChart student={selectedStudent} />
            </div>

            {/* Legend */}
            {selectedStudent && (
              <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1.5">
                  <span className="inline-block h-0.5 w-5 rounded bg-gray-400" />
                  Historical
                </span>
                <span className="flex items-center gap-1.5">
                  <span
                    className="inline-block h-0.5 w-5 rounded"
                    style={{
                      background: `repeating-linear-gradient(90deg,
                        ${selectedStudent ? "#9ca3af" : "#d1d5db"} 0,
                        ${selectedStudent ? "#9ca3af" : "#d1d5db"} 5px,
                        transparent 5px, transparent 8px)`,
                    }}
                  />
                  Forecast
                </span>
              </div>
            )}
          </div>
        </section>

        {/* 3a — Student table */}
        <section className="min-h-[360px] rounded-xl border border-gray-200 bg-white shadow-sm">
          <header className="border-b border-gray-100 px-5 py-4">
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-800">
              Student Directory
            </h2>
            <p className="mt-0.5 text-xs text-gray-400">
              Click a row to load their predictive forecast →
            </p>
          </header>

          <div className="overflow-x-auto">
            <table
              className="w-full text-left"
              aria-label="Student performance table"
            >
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  <th className="py-3 pl-4 pr-3">Student</th>
                  <th className="px-3 py-3">Risk Level</th>
                  <th className="px-3 py-3">Avg AI %</th>
                  <th className="px-3 py-3">Grade %</th>
                  <th className="px-3 py-3">Submissions</th>
                  <th className="py-3 pl-3 pr-4">Remark</th>
                </tr>
              </thead>

              <tbody>
                {students.map((student) => (
                  <StudentTableRow
                    key={student.id}
                    student={student}
                    isSelected={selectedStudent?.id === student.id}
                    onSelect={handleSelect}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Selection hint */}
          {!selectedStudent && (
            <p className="border-t border-gray-50 px-5 py-3 text-center text-xs text-gray-300">
              ↑ Select any row to load the student's forecast
            </p>
          )}
        </section>
      </div>
    </div>
  )
}

export default StudentPerformanceDashboard
