import { useCallback, useEffect, useState } from "react"

import { fetchDashboardData } from "./charts/api"
import type {
  ClassTrendPoint,
  PerformanceStudent,
  RiskBucket,
  RiskLevel,
} from "./charts/dashboardData"
import { StudentPerformanceDashboard } from "./charts/StudentPerformanceDashboard"
import { OverviewPanel } from "./OverviewPanel"
import { SimulatePanel } from "./SimulatePanel"

type DashboardData = Awaited<ReturnType<typeof fetchDashboardData>>

type ClassTrendPointCompat = ClassTrendPoint
type RiskBucketCompat = RiskBucket

function safeLabelToRiskLevel(label: RiskLevel | string): RiskLevel {
  if (label === "Low" || label === "Moderate" || label === "High") return label
  return "Moderate"
}

export function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSimulating, setIsSimulating] = useState(false)

  const [classTrend, setClassTrend] = useState<ClassTrendPointCompat[]>([])
  const [riskBuckets, setRiskBuckets] = useState<RiskBucketCompat[]>([])
  const [students, setStudents] = useState<PerformanceStudent[]>([])
  const [overview, setOverview] = useState({
    num_students: 0,
    num_submissions: 0,
    avg_next_ai_percent: 0,
    class_risk_score: 0,
    class_risk_label: "Moderate",
  })

  const load = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const data: DashboardData = await fetchDashboardData()

      setOverview(data.overview || {})
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

  const handleSimulate = async () => {
    setIsSimulating(true)
    try {
      // Simulate a delay for the button feedback
      await new Promise((resolve) => setTimeout(resolve, 1000))
      // Reload the data after simulation
      await load()
    } catch (e) {
      console.error("Simulation failed:", e)
    } finally {
      setIsSimulating(false)
    }
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-600">
        Loading analytics…
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">
        {error}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Top row: Overview and Simulate panels side-by-side */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <OverviewPanel stats={overview} />
        <SimulatePanel onSimulate={handleSimulate} isSimulating={isSimulating} />
      </div>

      {/* Analytics section: full width below */}
      <StudentPerformanceDashboard
        classTrend={classTrend}
        aiDistribution={riskBuckets}
        students={students}
      />
    </div>
  )
}

export default AdminDashboard