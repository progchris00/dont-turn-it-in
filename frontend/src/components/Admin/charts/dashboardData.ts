export type RiskLevel = "Low" | "Moderate" | "High"

export type ClassTrendPoint = {
  week: number
  avgAiPercent: number
}

export type ForecastPoint = {
  week: number | string
  aiPercent: number
  isForecast: boolean
}

export type PerformanceStudent = {
  id: string
  name: string
  riskLevel: RiskLevel
  riskScore: 1 | 2 | 3

  avgAiPercent: number
  gradePercent: number
  submissions: number

  actionableRemark: string
  predictiveFlag: RiskLevel

  // For StudentForecastChart
  forecastData: ForecastPoint[]
}

export type RiskBucket = {
  label: RiskLevel
  color: string
  count: number
}

export const RISK_COLORS: Record<RiskLevel, string> = {
  Low: "#10b981", // green
  Moderate: "#f59e0b", // amber
  High: "#ef4444", // red
}

export const RISK_BG: Record<RiskLevel, string> = {
  Low: "bg-green-50 text-green-700",
  Moderate: "bg-amber-50 text-amber-700",
  High: "bg-red-50 text-red-700",
}

// Minimal fallback mocks so dev server can compile even before API wiring.
// These will be replaced by real API-driven data in AdminDashboard.
export const MOCK_CLASS_TREND: ClassTrendPoint[] = [
  { week: 1, avgAiPercent: 40 },
  { week: 2, avgAiPercent: 45 },
  { week: 3, avgAiPercent: 35 },
  { week: 4, avgAiPercent: 38 },
  { week: 5, avgAiPercent: 42 },
]

export const MOCK_RISK_BUCKETS: RiskBucket[] = [
  { label: "Low", color: RISK_COLORS.Low, count: 0 },
  { label: "Moderate", color: RISK_COLORS.Moderate, count: 0 },
  { label: "High", color: RISK_COLORS.High, count: 0 },
]

export const MOCK_PERFORMANCE_STUDENTS: PerformanceStudent[] = [
  {
    id: "student-1",
    name: "Student A",
    riskLevel: "Moderate",
    riskScore: 2,
    avgAiPercent: 45,
    gradePercent: 55,
    submissions: 2,
    actionableRemark:
      "Schedule periodic check-ins; targeted practice sessions may help",
    predictiveFlag: "Moderate",
    forecastData: [
      { week: 1, aiPercent: 40, isForecast: false },
      { week: 2, aiPercent: 45, isForecast: false },
      { week: "Next", aiPercent: 48, isForecast: true },
    ],
  },
]
