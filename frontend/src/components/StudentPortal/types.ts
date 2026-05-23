export interface Activity {
  id: string | number;
  activityTitle: string;
  description: string;
  deadline: string;
}

export interface Submission {
  id: string | number;
  activityTitle: string;
  studentName: string;
  submittedAt: string;
  aiflag: string;
  aiPercent: number;
}
