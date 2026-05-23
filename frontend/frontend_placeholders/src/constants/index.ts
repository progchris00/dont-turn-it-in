export const ALLOWED_FILE_TYPES = ['.pdf', '.docx', '.txt']
export const MAX_FILE_SIZE_MB = 10

export const RISK_THRESHOLDS = {
  LOW: 40,
  MED: 65,
  HIGH: 80,
} as const

export const ROUTES = {
  HOME:              '/',
  STUDENT_DASHBOARD: '/student',
  ADMIN_DASHBOARD:   '/admin',
} as const

export const AI_DISTRIBUTION_LABELS = [
  'Very High',
  'Moderate',
  'Low',
  'Very Low',
] as const
