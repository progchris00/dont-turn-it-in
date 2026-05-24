import type { OverviewStats } from "./AnalyticsSection"

export function OverviewPanel({ stats }: { stats: OverviewStats }) {
  // Compatibility wrapper; the real API-driven dashboard will replace this.
  const totalStudents =
    stats.totalStudents ?? stats.num_students ?? stats.num_students ?? 0
  const totalSubmissions = stats.totalSubmissions ?? stats.num_submissions ?? 0
  const avgAiPercent = stats.avgAiPercent ?? stats.avg_next_ai_percent ?? 0
  const highRiskCount = stats.highRiskCount ?? 0

  return (
    <section className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <header className="border-b border-gray-100 px-5 py-4">
        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-800">
          Overview
        </h2>
      </header>
      <div className="p-5">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-gray-500">Students</p>
            <p className="text-lg font-semibold text-gray-900">
              {totalStudents}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Submissions</p>
            <p className="text-lg font-semibold text-gray-900">
              {totalSubmissions}
            </p>
          </div>
          <div className="col-span-2">
            <p className="text-xs text-gray-500">Avg AI</p>
            <p className="text-lg font-semibold text-gray-900">
              {Number(avgAiPercent).toFixed(0)}%
            </p>
          </div>
        </div>
        {highRiskCount ? (
          <p className="mt-3 text-xs text-risk-high">
            High Risk: {highRiskCount}
          </p>
        ) : null}
      </div>
    </section>
  )
}
