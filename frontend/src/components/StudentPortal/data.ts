import { ActivitiesService } from "@/client"
import type { Activity, Submission } from "@/components/StudentPortal/types"

const pastSubmissions: Submission[] = [
  {
    id: 1,
    activityTitle: "Essay Draft Review",
    studentName: "Alex Johnson",
    submittedAt: "Submitted 2 hours ago",
    aiflag: "AI flagged",
    aiPercent: 82,
  },
  {
    id: 2,
    activityTitle: "Reading Reflection",
    studentName: "Alex Johnson",
    submittedAt: "Submitted yesterday",
    aiflag: "Human reviewed",
    aiPercent: 24,
  },
  {
    id: 3,
    activityTitle: "Weekly Quiz",
    studentName: "Alex Johnson",
    submittedAt: "Submitted last week",
    aiflag: "Needs revision",
    aiPercent: 53,
  },
]

export const fetchActiveActivities = async (): Promise<Activity[]> => {
  return ActivitiesService.getActiveActivities() as Promise<Activity[]>
}

export const fetchSubmissions = async (): Promise<Submission[]> => {
  return pastSubmissions
}
