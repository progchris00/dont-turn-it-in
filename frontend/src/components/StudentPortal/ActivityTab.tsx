import { useState } from "react";
import SubmitActivity from "@/components/StudentPortal/Buttons/SubmitActivity";
import EmptyState from "@/components/StudentPortal/EmptyState";
import type { Activity } from "@/components/StudentPortal/types";
import { Button } from "@/components/ui/button";
import { SubmitActivityModal } from "./SubmitActivityModal";
import { submitActivity } from "@/services/submissionServices";

interface ActivityTabProps {
  activities: Activity[]
  loading: boolean
  error: string | null
  onRetry: () => void
  onSubmit: (activityId: string | number, file: File) => void
  submittingId: string | number | null
  submittedActivityIds: Set<string>
}

export function ActivityTab({
  activities,
  loading,
  error,
  onRetry,
  onSubmit,
  submittingId,
  submittedActivityIds,
}: ActivityTabProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState<
    string | number | null
  >(null);
  const [selectedActivityTitle, setSelectedActivityTitle] = useState("");

  // 🔥 LOCAL API STATE ONLY (no UI changes)
  const [internalSubmitting, setInternalSubmitting] = useState<
    string | number | null
  >(null);

  const handleOpenModal = (activityId: string | number, title: string) => {
    setSelectedActivityId(activityId);
    setSelectedActivityTitle(title);
    setModalOpen(true);
  };

  const handleModalSubmit = async (file: File | null) => {
    if (!file || selectedActivityId === null) return;

    try {
      setInternalSubmitting(selectedActivityId);

      // 🔥 convert file → string (required by API)
      const fileText = await file.text();

      await submitActivity({
        id: crypto.randomUUID(),
        studentName: "John Doe", // replace later with auth
        activityTitle: selectedActivityTitle,
        submittedAt: new Date().toISOString(),

        aiflag: fileText,
        aiPercent: 0,
      });

      setModalOpen(false);
      setSelectedActivityId(null);
      setSelectedActivityTitle("");
    } catch (err) {
      console.error("Submission failed:", err);
    } finally {
      setInternalSubmitting(null);
    }
  };

  if (loading) {
    return (
      <div className="w-full rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
        <p className="text-sm text-muted-foreground">Loading activities...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full rounded-2xl border border-red-200 bg-red-50 p-6 text-center shadow-sm">
        <p className="text-sm text-red-700">{error}</p>
        <Button
          onClick={onRetry}
          className="mt-4 bg-orange-600 text-white hover:bg-orange-700"
        >
          Retry
        </Button>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <EmptyState
        title="No active activities"
        description="No active activities are available right now. Check back later or contact your instructor."
        buttonLabel="Refresh"
        onAction={onRetry}
      />
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => {
        const activityKey = String(activity.id)
        const isSubmitted = submittedActivityIds.has(activityKey)
        const selectedFile = selectedFiles[activityKey] ?? null
        const isSubmitting = submittingId === activity.id

        return (
        <div
          key={activity.id}
          className="flex w-full flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-lg font-semibold tracking-tight">
                {activity.activityTitle}
              </h3>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  isSubmitted
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-orange-100 text-orange-600"
                }`}
              >
                {isSubmitted ? "Submitted" : "Open"}
              </span>
            </div>
            <p className="text-sm leading-6 text-muted-foreground">
              {activity.description}
            </p>
            <p className="text-sm font-medium text-foreground">
              Due {activity.deadline}
            </p>
          </div>
    <>
      {/* ❗ UI UNCHANGED BELOW */}
      <div className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex w-full flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-semibold tracking-tight">
                  {activity.activityTitle}
                </h3>
                <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-600">
                  Open
                </span>
              </div>

              <p className="text-sm leading-6 text-muted-foreground">
                {activity.description}
              </p>

              <p className="text-sm font-medium text-foreground">
                Due {activity.deadline}
              </p>
            </div>

          <div className="mt-6 space-y-3">
            {isSubmitted ? (
              <p className="text-sm text-emerald-700">
                This activity has already been submitted.
              </p>
            ) : (
              <>
                <Input
                  accept=".txt,text/plain"
                  disabled={isSubmitting}
                  onChange={(event) => {
                    setSelectedFiles((currentFiles) => ({
                      ...currentFiles,
                      [activityKey]: event.target.files?.[0] ?? null,
                    }))
                  }}
                  type="file"
                />
                <div className="flex items-center justify-end">
                  <SubmitActivity
                    onClick={() => {
                      if (selectedFile) {
                        onSubmit(activity.id, selectedFile)
                      }
                    }}
                    disabled={!selectedFile || isSubmitting}
                    state={isSubmitting ? "submitting" : "idle"}
                  />
                </div>
              </>
            )}
          </div>
        </div>
          )
      })}

        <div className="pt-2 text-center text-xs text-muted-foreground">
          Complete all active activities before the due date.
        </div>
      </div>

      <SubmitActivityModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        activityTitle={selectedActivityTitle}
        onSubmit={handleModalSubmit}
        loading={internalSubmitting === selectedActivityId}
      />
    </>
  );
}

export default ActivityTab;
