import { ClassAITrendChart } from "./charts/ClassAITrendChart"
import type {
  ClassTrendPoint,
  ForecastPoint,
  RiskBucket,
  RiskLevel,
} from "./charts/dashboardData"
import { RiskDistributionChart } from "./charts/RiskDistributionChart"
import { StudentForecastChart } from "./charts/StudentForecastChart"

export type OverviewStats = {
  totalStudents?: number
  totalSubmissions?: number
  avgAiPercent?: number
  highRiskCount?: number
  num_students?: number
  num_submissions?: number
  avg_next_ai_percent?: number
  class_risk_score?: number
  class_risk_label?: RiskLevel | string
}

export function AnalyticsSection({
  weeklyTrend,
  forecast,
  aiDistribution,
}: {
  weeklyTrend: ClassTrendPoint[]
  forecast: { points: ForecastPoint[] } | ForecastPoint[]
  aiDistribution: RiskBucket[]
}) {
  void forecast
  // This component is kept for compatibility with the existing mock AdminDashboard.
  // It will be replaced by the API-driven dashboard in a later step.
  return (
    <div className="flex flex-col gap-5">
      <ClassAITrendChart data={weeklyTrend} />
      <RiskDistributionChart data={aiDistribution} />
      <StudentForecastChart student={null} />
    </div>
  )
}
