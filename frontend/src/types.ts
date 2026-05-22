export interface Activity {
  studentName: string;
  id: string | number;
  activityTitle: string;
  description: string;
  deadline: string;
}

export interface Submission {
  studentName: string;
  id: string | number;
  activityTitle: string;
  submittedAt: string;
  aiflag: string;
  aiPercent: number;
}
