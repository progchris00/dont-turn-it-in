import { Button } from "@/components/ui/button";

import SubmitActivity from "@/components/StudentPortal/Buttons/SubmitActivity";
import type { Activity } from "@/components/StudentPortal/types";

interface ActivityTabProps {
  activities: Activity[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onSubmit: (activityId: string | number) => void;
  submittingId: string | number | null;
}

export function ActivityTab({
  activities,
  loading,
  error,
  onRetry,
  onSubmit,
  submittingId,
}: ActivityTabProps) {
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
      <div className="w-full rounded-2xl border border-dashed border-border bg-muted/30 p-8 text-center">
        <p className="text-sm text-muted-foreground">
          No active activities at the moment.
        </p>
      </div>
    );
  }

  return (
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

          <div className="mt-6 flex items-center justify-end">
            <SubmitActivity
              onClick={() => onSubmit(activity.id)}
              disabled={submittingId === activity.id}
            />
          </div>
        </div>
      ))}

      <div className="pt-2 text-center text-xs text-muted-foreground">
        Complete all active activities before the due date.
      </div>
    </div>
  );
}

export default ActivityTab;
