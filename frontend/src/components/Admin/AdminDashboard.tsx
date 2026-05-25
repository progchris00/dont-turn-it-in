import { UserCircle2 } from "lucide-react"
import { useCallback, useEffect, useState } from "react"

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

type UserRole = "admin" | "student" | "guest"

// ─── RoleBar sub-component ─────
interface RoleBarProps {
  userName: string
  role: UserRole
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
  return "Moderate"
}

export function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [role] = useState<UserRole>("admin")

  const [classTrend, setClassTrend] = useState<ClassTrendPointCompat[]>([])
  const [riskBuckets, setRiskBuckets] = useState<RiskBucketCompat[]>([])
  const [students, setStudents] = useState<PerformanceStudent[]>([])

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const data: DashboardData = await fetchDashboardData()

      setClassTrend((data.classTrend ?? []) as ClassTrendPointCompat[])
      setRiskBuckets((data.aiDistribution ?? []) as RiskBucketCompat[])

      const studentById = new Map<string, PerformanceStudent>()

      for (const s of (data.studentTable ?? []) as any[]) {
        const riskLevel = safeLabelToRiskLevel(
          s.riskLevel ?? s.predictiveFlag ?? "Moderate",
        )

        studentById.set(String(s.studentName ?? s.id), {
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
          forecastData: [],
        })
      }

      const forecastLineSeries = (data.forecastLine ?? []) as any[]

      for (const series of forecastLineSeries) {
        const target = [...studentById.values()].find(
          (x) => x.name === series.studentName,
        )

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

  const handleSwitchRole = useCallback(() => {
    window.location.href = "/portal-select"
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-[#fdf4f0]">
      {/* ✅ FIX: no props here */}
      <Navbar />

      <RoleBar
        role={role}
        userName="User Admin"
        onSwitchRole={handleSwitchRole}
      />

      <main className="flex-1">
        {loading && (
          <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
            <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-600">
              Loading analytics…
            </div>
          </div>
        )}

        {error && (
          <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
            <div className="rounded-xl border border-red-200 bg-white p-6 text-sm text-red-700">
              {error}
            </div>
          </div>
        )}

        {!loading && !error && (
          <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">
                Student Performance Analytics
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Comprehensive overview of class trends and individual student forecasts
              </p>
            </div>

            {/* Quick Stats Section */}
            <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Total Students
                </h3>
                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {students.length}
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  High Risk
                </h3>
                <p className="mt-2 text-2xl font-bold text-red-600">
                  {students.filter((s) => s.riskLevel === "High").length}
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Moderate Risk
                </h3>
                <p className="mt-2 text-2xl font-bold text-yellow-600">
                  {students.filter((s) => s.riskLevel === "Moderate").length}
                </p>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Low Risk
                </h3>
                <p className="mt-2 text-2xl font-bold text-green-600">
                  {students.filter((s) => s.riskLevel === "Low").length}
                </p>
              </div>
            </section>

            {/* Charts & Analytics */}
            <StudentPerformanceDashboard
              classTrend={classTrend}
              aiDistribution={riskBuckets}
              students={students}
            />
          </div>
        )}
      </main>
    </div>
  )
}

export default AdminDashboard