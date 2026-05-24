import type {
  ClassTrendPoint,
  PerformanceStudent,
  RiskBucket,
} from "./dashboardData"

export type StudentPerformanceDashboardApiProps = {
  classTrend: ClassTrendPoint[]
  aiDistribution: RiskBucket[]
  students: PerformanceStudent[]
}
