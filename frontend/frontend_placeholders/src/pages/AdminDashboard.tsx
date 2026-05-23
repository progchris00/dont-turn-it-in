import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Navbar } from '@/components/layout/Navbar'
import { DashboardCard } from '@/components/ui/DashboardCard'
import { StudentMonitorTable } from '@/components/tables/StudentMonitorTable'
import {
  WeeklyTrendChart,
  PredictiveForecastChart,
  AIDistributionChart,
  GradeVsAIChart,
} from '@/components/dashboard/AnalyticsChart'
import { useDashboard } from '@/hooks/useDashboard'
import { useAnalytics } from '@/hooks/useAnalytics'
import { Loader2, AlertCircle, Settings, Zap } from 'lucide-react'
import { ROUTES } from '@/constants'

type ChartTab = 'weekly' | 'forecast' | 'distribution' | 'gradeVsAI'

const CHART_TABS: Array<{ id: ChartTab; label: string }> = [
  { id: 'weekly',       label: 'Weekly AI Trend'    },
  { id: 'forecast',     label: 'Predictive Forecast' },
  { id: 'distribution', label: 'AI Distribution'    },
  { id: 'gradeVsAI',   label: 'Grade vs AI'         },
]

export default function AdminDashboard() {
  const navigate                            = useNavigate()
  const [chartTab, setChartTab]             = useState<ChartTab>('weekly')
  const [simulating, setSimulating]         = useState(false)

  const { stats, students, loading: dLoading, error: dError, refetch } = useDashboard()
  const { analytics, loading: aLoading, error: aError, refetch: refetchAnalytics } = useAnalytics()

  const handleSimulate = async () => {
    setSimulating(true)
    // TODO: call POST /submissions/simulate when backend is ready
    await new Promise((r) => setTimeout(r, 1200))
    await Promise.all([refetch(), refetchAnalytics()])
    setSimulating(false)
  }

  const loading = dLoading || aLoading
  const error   = dError || aError

  return (
    <div className="min-h-screen bg-surface-bg font-sans">
      <Navbar role="admin" onSwitchRole={() => navigate(ROUTES.HOME)} />

      {/* Role header */}
      <div className="bg-white border-b border-gray-100 px-6 py-3 flex items-center gap-3">
        <span className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm">👤</span>
        <span className="text-sm font-medium text-gray-700">User Admin</span>
      </div>

      <main className="max-w-screen-xl mx-auto px-4 py-8 space-y-6">
        {error && (
          <div className="flex items-center gap-2 text-red-600 bg-red-50 rounded-xl px-4 py-3 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Top row: Overview + Simulate */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Overview card */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-card overflow-hidden">
            <div className="px-6 py-3 border-b border-gray-100 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Overview</span>
              <AlertCircle className="w-4 h-4 text-gray-300" />
            </div>
            {loading || !stats ? (
              <div className="flex items-center justify-center py-10 text-gray-400 gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
            ) : (
              <div className="flex divide-x divide-gray-100">
                <DashboardCard label="Students"    value={stats.totalStudents}    className="flex-1" />
                <DashboardCard label="Submissions" value={stats.totalSubmissions} className="flex-1" />
                <DashboardCard label="Avg AI"      value={`${stats.avgAIPct}%`}  className="flex-1" />
                <DashboardCard
                  label="High Risk"
                  value={stats.highRiskCount}
                  valueClass="text-risk-high"
                  className="flex-1"
                />
              </div>
            )}
          </div>

          {/* Simulate */}
          <div className="bg-white rounded-2xl shadow-card overflow-hidden">
            <div className="px-6 py-3 border-b border-gray-100 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
                Simulate Submission
              </span>
              <Settings className="w-4 h-4 text-gray-300" />
            </div>
            <div className="p-5 space-y-3">
              <button
                onClick={handleSimulate}
                disabled={simulating}
                className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-60
                  text-white font-semibold py-3 rounded-xl transition-colors text-sm"
              >
                {simulating
                  ? <Loader2 className="w-4 h-4 animate-spin" />
                  : <Zap className="w-4 h-4" />
                }
                {simulating ? 'Simulating…' : 'Simulate New Submission'}
              </button>
              <div className="w-full text-center text-xs text-gray-400 bg-surface-muted rounded-xl py-2.5 font-medium">
                Real-Time impact in all charts
              </div>
            </div>
          </div>
        </div>

        {/* Analytics */}
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <div className="px-6 py-3 border-b border-gray-100 flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Analytics</span>
            <div className="flex gap-1">
              {CHART_TABS.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => setChartTab(id)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors
                    ${chartTab === id ? 'bg-brand-100 text-brand-700' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="p-6">
            {aLoading || !analytics ? (
              <div className="flex items-center justify-center py-16 text-gray-400 gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm">Loading analytics…</span>
              </div>
            ) : (
              <>
                {chartTab === 'weekly'       && <WeeklyTrendChart       analytics={analytics} />}
                {chartTab === 'forecast'     && <PredictiveForecastChart analytics={analytics} />}
                {chartTab === 'distribution' && <AIDistributionChart    analytics={analytics} />}
                {chartTab === 'gradeVsAI'   && <GradeVsAIChart         analytics={analytics} />}
              </>
            )}
          </div>
        </div>

        {/* Student Table */}
        {dLoading || !students ? (
          <div className="flex items-center justify-center py-10 text-gray-400 gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
        ) : (
          <StudentMonitorTable students={students} />
        )}
      </main>
    </div>
  )
}
