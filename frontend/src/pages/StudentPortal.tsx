// StudentPortal.tsx
import { useState } from "react";
import NavBar from "../components/NavBar";
import ActivityTab from "../components/ActivityTab";
import SubmissionTab from "../components/SubmissionTab";
import { useActivities } from "../hooks/useActivities";
import { useSubmissions } from "../hooks/useSubmissions";
import { submitActivity } from "../api";

const StudentPortal = () => {
  const [activeTab, setActiveTab] = useState<"activity" | "submission">(
    "activity",
  );
  const [submittingId, setSubmittingId] = useState<string | number | null>(
    null,
  );

  const {
    activities,
    loading: loadingActivities,
    error: errorActivities,
    refetch: refetchActivities,
  } = useActivities();

  const {
    submissions,
    loading: loadingSubmissions,
    error: errorSubmissions,
    refetch: refetchSubmissions,
  } = useSubmissions();

  const handleSubmit = async (activityId: string | number) => {
    if (submittingId === activityId) return;
    setSubmittingId(activityId);
    try {
      await submitActivity(activityId);
      await Promise.all([refetchActivities(), refetchSubmissions()]);
      alert("Activity submitted successfully!");
    } catch (err) {
      console.error("Submit error:", err);
      alert(
        `Submission failed: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <NavBar />

      <main className="flex-grow container mx-auto px-4 py-6 max-w-4xl">
        {/* Tabs */}
        <div className="flex border-b border-gray-300 mb-6">
          <button
            onClick={() => setActiveTab("activity")}
            className={`px-4 py-2 font-semibold text-sm transition-colors duration-200 cursor-pointer ${
              activeTab === "activity"
                ? "border-b-2 border-orange-600 text-orange-600"
                : "text-gray-600 hover:text-orange-600"
            }`}
          >
            Activity
          </button>
          <button
            onClick={() => setActiveTab("submission")}
            className={`px-4 py-2 font-semibold text-sm transition-colors duration-200 cursor-pointer ${
              activeTab === "submission"
                ? "border-b-2 border-orange-600 text-orange-600"
                : "text-gray-600 hover:text-orange-600"
            }`}
          >
            Submission
          </button>
        </div>

        {activeTab === "activity" && (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-5">
              Active Activities
            </h2>
            <ActivityTab
              activities={activities}
              loading={loadingActivities}
              error={errorActivities}
              onRetry={refetchActivities}
              onSubmit={handleSubmit}
              submittingId={submittingId}
            />
          </>
        )}

        {activeTab === "submission" && (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-5">
              Past Submissions
            </h2>
            <SubmissionTab
              submissions={submissions}
              loading={loadingSubmissions}
              error={errorSubmissions}
              onRetry={refetchSubmissions}
            />
          </>
        )}
      </main>
    </div>
  );
};

export default StudentPortal;
