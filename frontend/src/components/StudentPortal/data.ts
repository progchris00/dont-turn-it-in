import type { Activity, Submission } from "@/components/StudentPortal/types";

const activeActivities: Activity[] = [
  {
    id: 1,
    activityTitle: "Essay Draft Review",
    description:
      "Upload your draft for a quick AI-assisted review before the deadline.",
    deadline: "today at 5:00 PM",
  },
  {
    id: 2,
    activityTitle: "Reading Reflection",
    description: "Reflect on this week’s reading and submit your response.",
    deadline: "tomorrow at 11:59 PM",
  },
  {
    id: 3,
    activityTitle: "Project Check-in",
    description:
      "Share your current progress and blockers with your instructor.",
    deadline: "Friday",
  },
];

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
];

export const fetchActiveActivities = async (): Promise<Activity[]> => {
  return activeActivities;
};

export const fetchSubmissions = async (): Promise<Submission[]> => {
  return pastSubmissions;
};
