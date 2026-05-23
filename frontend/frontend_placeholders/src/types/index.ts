// ─── Auth / Roles ────────────────────────────────────────────────────────────

export type Role = 'student' | 'admin' | 'guest'

export interface User {
  id: string
  name: string
  email: string
  role: Role
  avatarUrl?: string
}

export interface Student extends User {
  role: 'student'
  enrolledCourseIds: string[]
}

export interface Admin extends User {
  role: 'admin'
  department?: string
}

// ─── Assignments ─────────────────────────────────────────────────────────────

export interface Assignment {
  id: string
  title: string
  description: string
  dueDate: string           // ISO date string
  courseId: string
  allowedFileTypes: string[]
  maxFileSizeMb: number
}

// ─── Submissions ─────────────────────────────────────────────────────────────

export type SubmissionStatus = 'pending' | 'processing' | 'graded' | 'flagged'

export interface Submission {
  id: string
  assignmentId: string
  assignmentTitle: string
  studentName: string
  studentId: string
  submittedAt: string       // ISO datetime string
  fileUrl?: string
  fileName?: string
  aiLikelihood: number      // 0–100
  grade: number             // 0–100
  status: SubmissionStatus
  feedback?: string
}

// ─── Analytics ───────────────────────────────────────────────────────────────

export type RiskLevel = 'Low' | 'Med' | 'High' | 'Very High'

export interface WeeklyTrendPoint {
  week: number
  avgAI: number
}

export interface AIDistributionBucket {
  label: 'Very High' | 'Moderate' | 'Low' | 'Very Low'
  count: number
}

export interface GradeAIPoint {
  aiPct: number
  grade: number
  studentName: string
}

export interface Analytics {
  avgAI: number
  riskCount: number                         // high-risk student count
  weeklyTrend: WeeklyTrendPoint[]
  predictiveForecast: WeeklyTrendPoint[]
  aiDistribution: AIDistributionBucket[]
  gradeVsAI: GradeAIPoint[]
}

// ─── Dashboard Stats ─────────────────────────────────────────────────────────

export interface DashboardStats {
  totalStudents: number
  totalSubmissions: number
  avgAIPct: number
  highRiskCount: number
}

// ─── Student Monitoring Row ──────────────────────────────────────────────────

export interface StudentMonitorRow {
  studentId: string
  studentName: string
  riskScore: number           // 0–100
  submissionsCount: number
  avgAIPct: number
  gradeTrend: number          // latest grade %
  gradeTrendDirection: 'up' | 'down' | 'stable'
  predictiveFlag: RiskLevel
  actionableRemark: string
}

// ─── API Responses ───────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

// ─── Form Payloads ───────────────────────────────────────────────────────────

export interface SubmitAssignmentPayload {
  assignmentId: string
  studentName: string
  file: File
}
