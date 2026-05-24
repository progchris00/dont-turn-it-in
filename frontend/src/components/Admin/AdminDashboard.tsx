import { UserCircle2 } from "lucide-react"
import { useCallback, useEffect, useMemo, useState } from "react"

import { Navbar } from "@/components/Common/Navbar"
import { fetchDashboardData } from "./charts/api"
import type {
  ClassTrendPoint,
  PerformanceStudent,
  RiskBucket,
  RiskLevel,
} from "./charts/dashboardData"
import { StudentPerformanceDashboard } from "./charts/StudentPerformanceDashboard"

type DashboardData = Awaited<ReturnType<typeof fetchDashboardData>>

type ClassTrendPointCompat = ClassTrendPoint

type RiskBucketCompat = RiskBucket

// ─── RoleBar sub-component ─────
interface RoleBarProps {
  userName: string
  role: string
  onSwitchRole: () => void
}

function RoleBar({ userName, role, onSwitchRole }: RoleBarProps) {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-2">
      <div className="flex items-center gap-2 text-sm text-gray-700">
        <UserCircle2 className="h-7 w-7 text-gray-400" aria-hidden="true" />
        <span className="font-medium">{userName}</span>
      </div>
      <button
        type="button"
        onClick={onSwitchRole}
        className="rounded border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 active:bg-gray-100"
      >
        Switch Role: {role}
      </button>
    </div>
  )
}

function safeLabelToRiskLevel(label: RiskLevel | string): RiskLevel {
  if (label === "Low" || label === "Moderate" || label === "High") return label
  // default fallback
  return "Moderate"
}

export function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [role, setRole] = useState("Admin")
  // We keep StudentPerformanceDashboard (which currently expects MOCK_* inside)
  // but we will pass real data by building the props it uses.
  const [classTrend, setClassTrend] = useState<ClassTrendPointCompat[]>([])
  const [riskBuckets, setRiskBuckets] = useState<RiskBucketCompat[]>([])
  const [students, setStudents] = useState<PerformanceStudent[]>([])

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data: DashboardData = await fetchDashboardData()

      setClassTrend((data.classTrend ?? []) as ClassTrendPointCompat[])

      // Server provides bucket color inconsistently; reuse chart color mapping by label.
      // StudentPerformanceDashboard currently uses MOCK_* and dashboardData colors for styling,
      // so we only need correct labels/counts.
      setRiskBuckets((data.aiDistribution ?? []) as RiskBucketCompat[])

      // Build student rows compatible with StudentPerformanceDashboard.
      // Backend returns student-table rows with predictedAiPercent; forecast series is a separate endpoint.
      const studentById = new Map<string, PerformanceStudent>()
      for (const s of (data.studentTable ?? []) as any[]) {
        const riskLevel = safeLabelToRiskLevel(
          s.riskLevel ?? s.predictiveFlag ?? "Moderate",
        )
        const forecastData = [] as any[]
        studentById.set(String(s.riskScore ?? s.studentId ?? s.studentName), {
          id: String(s.studentName ?? s.id ?? Math.random()),
          name: String(s.studentName ?? "Student"),
          riskLevel,
          riskScore:
            s.riskScore === 1 || s.riskScore === 2 || s.riskScore === 3
              ? s.riskScore
              : 2,
          avgAiPercent: Number(s.avgAiPercent ?? 0),
          gradePercent: Number(100 - Number(s.avgAiPercent ?? 0)),
          submissions: Number(s.numSubmissions ?? 0),
          actionableRemark: String(s.actionableRemark ?? ""),
          predictiveFlag: safeLabelToRiskLevel(s.predictiveFlag ?? riskLevel),
          forecastData,
        })
      }

      // Attach forecast points per studentId.
      const forecastLineSeries = (data.forecastLine ?? []) as any[]
      for (const series of forecastLineSeries) {
        // since our PerformanceStudent id is not guaranteed to match studentId, fall back to name match.
        const target =
          [...studentById.values()].find(
            (x) => x.name === series.studentName,
          ) ?? null

        if (!target) continue
        target.forecastData = (series.points ?? []).map(
          (pt: any, idx: number) => ({
            week: typeof pt.x === "number" ? pt.x : idx,
            aiPercent: Number(pt.y ?? 0),
            isForecast:
              pt.x === "Next" || pt.isForecast === true || pt.week === "Next",
          }),
        )
      }

      setStudents([...studentById.values()])
    } catch (e: any) {
      setError(e?.message ?? "Failed to load analytics")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const handleSwitchRole = useMemo(
    () => () => {
      window.location.href = "/portal-select"
    },
    [],
  )

  return (
    <div className="flex min-h-screen flex-col bg-[#fdf4f0]">
      <Navbar />

      <RoleBar role={role} userName="User Admin" onSwitchRole={handleSwitchRole} />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-4 px-4 py-6 sm:px-6 lg:px-8">
        {loading && (
          <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-600">
            Loading analytics…
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-white p-6 text-sm text-red-700">
            {error}
          </div>
        )}

        <StudentPerformanceDashboard
          classTrend={classTrend}
          aiDistribution={riskBuckets}
          students={students}
        />
      </main>
    </div>
  )
}

export default AdminDashboard
