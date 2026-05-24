import { ActivitiesService, SubmissionsService } from "@/client"
import type { Activity, Submission } from "@/components/StudentPortal/types"

export const fetchActiveActivities = async (): Promise<Activity[]> => {
  return ActivitiesService.getActiveActivities() as Promise<Activity[]>
}

export const fetchSubmissions = async (): Promise<Submission[]> => {
  const submissions = await SubmissionsService.getSubmissions()

  return submissions.map((submission) => ({
    id: submission.id,
    studentName: submission.studentName,
    activityTitle: submission.activityTitle,
    submittedAt: formatSubmissionDate(submission.submittedAt),
    aiflag: submission.aiflag ?? "Pending review",
    aiPercent: submission.aiPercent,
  }))
}

const formatSubmissionDate = (value: string) => {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date)
}
