export interface Activity {
  id: string | number
  activityTitle: string
  description: string
  deadline: string
}

export interface Submission {
  id: string | number
  activityTitle: string
  activityId: string | null
  studentName: string
  submittedAt: string
  aiflag: string
  aiPercent: number
}
