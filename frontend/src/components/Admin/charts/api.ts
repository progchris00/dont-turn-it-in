import type { ClassTrendPoint, RiskBucket, RiskLevel } from "./dashboardData"

const API_BASE = "/api/v1/admin/analytics"

async function fetchJSON<T>(url: string): Promise<T> {
  const token = localStorage.getItem("access_token")
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const res = await fetch(url, {
    method: "GET",
    headers,
  })

  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(`Request failed: ${res.status} ${res.statusText} ${text}`)
  }

  return (await res.json()) as T
}

export type OverviewResponse = {
  num_students: number
  num_submissions: number
  avg_next_ai_percent: number
  class_risk_score: number
  class_risk_label: RiskLevel | string
}

export async function fetchOverview(): Promise<OverviewResponse> {
  return fetchJSON<OverviewResponse>(`${API_BASE}/overview`)
}

export async function fetchAiDistribution(): Promise<{
  distribution: Array<{
    riskScore: 1 | 2 | 3
    riskLevel: RiskLevel | string
    studentCount: number
  }>
}> {
  return fetchJSON(`${API_BASE}/ai-distribution`)
}

export type StudentTableRow = {
  studentName: string
  riskScore: 1 | 2 | 3
  riskLevel: RiskLevel | string
  numSubmissions: number
  avgAiPercent: number
  predictiveFlag: RiskLevel | string
  actionableRemark: string
  predictedAiPercent: number
}

export async function fetchStudentTable(): Promise<{
  rows: StudentTableRow[]
}> {
  return fetchJSON(`${API_BASE}/student-table`)
}

export async function fetchStudentForecastLine(): Promise<{
  series: Array<{
    studentId: string
    studentName: string
    points: Array<{ x: number; y: number }>
  }>
}> {
  return fetchJSON(`${API_BASE}/student-forecast-line`)
}

export async function fetchClassTrend(): Promise<{
  points: ClassTrendPoint[]
}> {
  return fetchJSON(`${API_BASE}/class-trend`)
}

export async function fetchForecastPointsForStudentLine(): Promise<any> {
  // placeholder; the actual mapping is done by combining student-table and forecast-line
  return null
}

export async function fetchDashboardData() {
  const [
    overviewRes,
    distRes,
    classTrendRes,
    studentTableRes,
    forecastLineRes,
  ] = await Promise.all([
    fetchOverview(),
    fetchJSON<{
      distribution: Array<{
        riskScore: 1 | 2 | 3
        riskLevel: RiskLevel | string
        studentCount: number
      }>
    }>(`${API_BASE}/ai-distribution`),
    fetchJSON<{ points: ClassTrendPoint[] }>(`${API_BASE}/class-trend`),
    fetchJSON<{ rows: StudentTableRow[] }>(`${API_BASE}/student-table`),
    fetchJSON<{
      series: Array<{
        studentId: string
        studentName: string
        points: Array<{ x: number; y: number }>
      }>
    }>(`${API_BASE}/student-forecast-line`),
  ])

  const distribution = distRes.distribution || []
  const aiDistribution: RiskBucket[] = distribution.map((d) => ({
    label: d.riskLevel as RiskLevel,
    color: "#000000",
    count: d.studentCount,
  }))

  return {
    overview: overviewRes,
    aiDistribution,
    classTrend: classTrendRes.points,
    studentTable: studentTableRes.rows,
    forecastLine: forecastLineRes.series,
  }
}
