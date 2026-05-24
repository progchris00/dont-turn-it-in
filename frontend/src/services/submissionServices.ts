import axios from "axios";

const API_BASE = "http://localhost:8000/api/v1/submissions";

export interface SubmissionPayload {
  id: string;
  studentName: string;
  activityTitle: string;
  submittedAt: string;
  aiflag: string;
  aiPercent: number;
}

export const submitActivity = async (payload: SubmissionPayload) => {
  const file = new Blob([JSON.stringify(payload, null, 2)], {
    type: "text/plain",
  });

  const formData = new FormData();
  formData.append("file", file, "submission.txt");

  const res = await axios.post(API_BASE, formData);

  return res.data;
};
