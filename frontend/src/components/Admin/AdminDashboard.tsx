import { useCallback, useEffect, useState } from "react"

import { BarChart3, Sparkles, Users } from "lucide-react"

import { fetchDashboardData } from "./charts/api"
import type {
  ClassTrendPoint,
  PerformanceStudent,
  RiskBucket,
  RiskLevel,
} from "./charts/dashboardData"
import { StudentPerformanceDashboard } from "./charts/StudentPerformanceDashboard"
import { SimulatePanel } from "./SimulatePanel"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

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
      <Card>
        <CardContent className="py-6 text-sm text-muted-foreground">
          Loading analytics…
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-destructive/20 bg-destructive/5">
        <CardHeader>
          <CardTitle className="text-base text-destructive">
            Analytics unavailable
          </CardTitle>
          <CardDescription className="text-destructive/80">
            {error}
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="space-y-4 rounded-2xl border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-3">
            <Badge variant="secondary" className="gap-1.5 px-3 py-1">
              <Sparkles className="h-3.5 w-3.5" />
              Admin dashboard
            </Badge>
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight">
                Analytics built for quick scans and deeper review.
              </h1>
              <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
                Track submission volume, class risk, and student forecasts from
                one dashboard that follows the app&apos;s shared card and surface
                system.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="gap-1.5 px-3 py-1">
              <Users className="h-3.5 w-3.5" />
              {overview.num_students} students
            </Badge>
            <Badge variant="outline" className="gap-1.5 px-3 py-1">
              <BarChart3 className="h-3.5 w-3.5" />
              {overview.num_submissions} submissions
            </Badge>
          </div>
        </div>

        <StatWidget
          stats={[
            {
              label: "Students",
              value: overview.num_students,
              helper: "Active learners in the class",
            },
            {
              label: "Submissions",
              value: overview.num_submissions,
              helper: "Tracked across the current term",
            },
            {
              label: "Avg AI next",
              value: `${Number(overview.avg_next_ai_percent).toFixed(0)}%`,
              helper: "Forecasted next-submission AI rate",
            },
            {
              label: "Risk score",
              value: Number(overview.class_risk_score).toFixed(1),
              helper: overview.class_risk_label,
            },
          ]}
        />
      </section>

      <Card className="overflow-hidden">
        <CardHeader className="border-b bg-muted/30">
          <CardTitle className="text-lg">Student performance</CardTitle>
          <CardDescription>
            Forecasts, AI distribution, and class trend signals.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <StudentPerformanceDashboard
            classTrend={classTrend}
            aiDistribution={riskBuckets}
            students={students}
          />
        </CardContent>
      </Card>

      <SimulatePanel onSimulate={handleSimulate} isSimulating={isSimulating} />
    </div>
  )
}

function StatWidget({
  stats,
}: {
  stats: Array<{
    label: string
    value: string | number
    helper: string
  }>
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl border bg-muted/25 p-4 shadow-sm"
        >
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            {stat.label}
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
            {stat.value}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">{stat.helper}</p>
        </div>
      ))}
    </div>
  )
}

export default AdminDashboard