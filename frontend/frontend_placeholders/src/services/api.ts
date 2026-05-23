/**
 * Centralized API service.
 *
 * Every function targets `VITE_API_URL` from the environment.
 * While no real backend exists, each function falls back to realistic
 * mock data so the frontend renders correctly out-of-the-box.
 *
 * When a backend is ready:
 *  1. Set VITE_API_URL in your .env.local
 *  2. Remove the mock blocks (marked with // MOCK)
 *  3. The rest of the app needs zero changes.
 */

import axios from 'axios'
import type {
  Assignment,
  Submission,
  DashboardStats,
  Analytics,
  StudentMonitorRow,
  SubmitAssignmentPayload,
  ApiResponse,
} from '@/types'

// ─── Axios instance ───────────────────────────────────────────────────────────

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1'

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Attach auth token if present (swap with your auth strategy)
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ─── Mock helpers ─────────────────────────────────────────────────────────────

const delay = (ms = 600) => new Promise((r) => setTimeout(r, ms))

// ─── Assignments ──────────────────────────────────────────────────────────────

export async function getAssignments(): Promise<Assignment[]> {
  // MOCK — replace with: return (await apiClient.get('/assignments')).data.data
  await delay()
  return [
    {
      id: 'asn-001',
      title: 'Persuasive Essay: Climate Change',
      description:
        'Write a 1500-word persuasive essay arguing for or against a specific climate policy.',
      dueDate: '2026-05-21T23:59:00Z',
      courseId: 'crs-101',
      allowedFileTypes: ['.pdf', '.docx', '.txt'],
      maxFileSizeMb: 10,
    },
    {
      id: 'asn-002',
      title: 'Research Paper: Renewable Energy',
      description:
        'Analyze three renewable energy sources and evaluate their economic feasibility.',
      dueDate: '2026-06-05T23:59:00Z',
      courseId: 'crs-101',
      allowedFileTypes: ['.pdf', '.docx'],
      maxFileSizeMb: 10,
    },
  ]
}

// ─── Submit Assignment ────────────────────────────────────────────────────────

export async function submitAssignment(
  payload: SubmitAssignmentPayload
): Promise<ApiResponse<Submission>> {
  // MOCK — replace with multipart upload:
  // const form = new FormData()
  // form.append('assignmentId', payload.assignmentId)
  // form.append('studentName',  payload.studentName)
  // form.append('file',         payload.file)
  // return (await apiClient.post('/submissions', form, { headers: { 'Content-Type': 'multipart/form-data' } })).data

  await delay(900)
  const mock: Submission = {
    id:              `sub-${Date.now()}`,
    assignmentId:    payload.assignmentId,
    assignmentTitle: 'Persuasive Essay: Climate Change',
    studentName:     payload.studentName,
    studentId:       'stu-mock',
    submittedAt:     new Date().toISOString(),
    fileName:        payload.file.name,
    aiLikelihood:    Math.floor(Math.random() * 60) + 20,
    grade:           Math.floor(Math.random() * 40) + 55,
    status:          'graded',
  }
  return { data: mock, success: true, message: 'Submission received.' }
}

// ─── Submissions ──────────────────────────────────────────────────────────────

export async function getSubmissions(): Promise<Submission[]> {
  // MOCK — replace with: return (await apiClient.get('/submissions')).data.data
  await delay()
  return [
    {
      id:              'sub-001',
      assignmentId:    'asn-001',
      assignmentTitle: 'Persuasive Essay: Climate Change',
      studentName:     'Arwil Martin S. Paraiso',
      studentId:       'stu-001',
      submittedAt:     '2026-05-20T14:30:00Z',
      fileName:        'climate_essay.pdf',
      aiLikelihood:    82,
      grade:           72,
      status:          'graded',
    },
    {
      id:              'sub-002',
      assignmentId:    'asn-001',
      assignmentTitle: 'Persuasive Essay: Climate Change',
      studentName:     'Isabella Garcia',
      studentId:       'stu-002',
      submittedAt:     '2026-05-19T10:15:00Z',
      fileName:        'essay_final.docx',
      aiLikelihood:    88,
      grade:           55,
      status:          'flagged',
    },
    {
      id:              'sub-003',
      assignmentId:    'asn-001',
      assignmentTitle: 'Persuasive Essay: Climate Change',
      studentName:     'Sophia Martinez',
      studentId:       'stu-003',
      submittedAt:     '2026-05-18T16:45:00Z',
      fileName:        'climate_paper.pdf',
      aiLikelihood:    91,
      grade:           58,
      status:          'flagged',
    },
  ]
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

export async function getDashboardStats(): Promise<DashboardStats> {
  // MOCK — replace with: return (await apiClient.get('/dashboard/stats')).data.data
  await delay()
  return {
    totalStudents:    8,
    totalSubmissions: 8,
    avgAIPct:         54,
    highRiskCount:    3,
  }
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export async function getAnalytics(): Promise<Analytics> {
  // MOCK — replace with: return (await apiClient.get('/analytics')).data.data
  await delay()
  return {
    avgAI:     54,
    riskCount: 3,
    weeklyTrend: [
      { week: 0, avgAI: 22 }, { week: 1, avgAI: 40 }, { week: 2, avgAI: 55 },
      { week: 3, avgAI: 38 }, { week: 4, avgAI: 60 }, { week: 5, avgAI: 90 },
      { week: 6, avgAI: 75 }, { week: 7, avgAI: 48 }, { week: 8, avgAI: 35 },
    ],
    predictiveForecast: [
      { week: 0, avgAI: 30 }, { week: 2, avgAI: 60 }, { week: 4, avgAI: 95 },
      { week: 6, avgAI: 130 }, { week: 8, avgAI: 170 }, { week: 9, avgAI: 200 },
    ],
    aiDistribution: [
      { label: 'Very High', count: 3 },
      { label: 'Moderate',  count: 1 },
      { label: 'Low',       count: 1 },
      { label: 'Very Low',  count: 2 },
    ],
    gradeVsAI: [
      { aiPct: 82, grade: 72, studentName: 'Arwil' },
      { aiPct: 88, grade: 55, studentName: 'Isabella' },
      { aiPct: 91, grade: 58, studentName: 'Sophia' },
      { aiPct: 45, grade: 88, studentName: 'James' },
      { aiPct: 30, grade: 92, studentName: 'Lena' },
    ],
  }
}

// ─── Student Monitor Rows ─────────────────────────────────────────────────────

export async function getStudents(): Promise<StudentMonitorRow[]> {
  // MOCK — replace with: return (await apiClient.get('/students/monitor')).data.data
  await delay()
  return [
    {
      studentId:            'stu-001',
      studentName:          'Arwil Martin S. Paraiso',
      riskScore:            78,
      submissionsCount:     1,
      avgAIPct:             82,
      gradeTrend:           72,
      gradeTrendDirection:  'stable',
      predictiveFlag:       'Med',
      actionableRemark:     'Early check-in',
    },
    {
      studentId:            'stu-002',
      studentName:          'Isabella Garcia',
      riskScore:            92,
      submissionsCount:     1,
      avgAIPct:             88,
      gradeTrend:           55,
      gradeTrendDirection:  'down',
      predictiveFlag:       'High',
      actionableRemark:     'Schedule 1-on-1 meeting',
    },
    {
      studentId:            'stu-003',
      studentName:          'Sophia Martinez',
      riskScore:            89,
      submissionsCount:     1,
      avgAIPct:             91,
      gradeTrend:           58,
      gradeTrendDirection:  'down',
      predictiveFlag:       'High',
      actionableRemark:     'Tutoring support',
    },
  ]
}
