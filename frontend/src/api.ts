import type { Activity, Submission } from "../src/types";

const API_BASE = import.meta.env.VITE_API_BASE;

export async function fetchActiveActivities(): Promise<Activity[]> {
  const response = await fetch(`${API_BASE}/api/student/active-activities`);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

export async function fetchSubmissions(): Promise<Submission[]> {
  const response = await fetch(`${API_BASE}/api/student/submissions`);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

export async function submitActivity(
  activityId: string | number,
): Promise<void> {
  const response = await fetch(`${API_BASE}/api/student/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ activityId }),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `HTTP ${response.status}`);
  }
}
