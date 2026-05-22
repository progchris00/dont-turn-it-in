import React from "react";
import type { Activity } from "../types";
import SubmitActivity from "./Buttons/SubmitActivity";

interface ActivityTabProps {
  activities: Activity[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onSubmit: (activityId: string | number) => void;
  submittingId: string | number | null;
}

const ActivityTab: React.FC<ActivityTabProps> = ({
  activities,
  loading,
  error,
  onRetry,
  onSubmit,
  submittingId,
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 text-center">
        <p className="text-gray-600">Loading activities...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 rounded-xl shadow-md border border-red-200 p-6 text-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 text-center">
        <p className="text-gray-600">No active activities at the moment.</p>
      </div>
    );
  }

  return (
    <>
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden transition-all hover:shadow-lg mb-6"
        >
          <div className="p-6">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-bold text-gray-900">
                {activity.activityTitle}
              </h3>
            </div>
            <p className="text-gray-600 mt-2 leading-relaxed">
              {activity.description}
            </p>

            <div className="mt-6 flex justify-end">
              <SubmitActivity
                onClick={() => onSubmit(activity.id)}
                disabled={submittingId === activity.id}
              />
            </div>

            <hr className="my-5 border-gray-200" />

            <div className="text-sm font-medium text-red-600 text-right">
              Due {activity.deadline}
            </div>
          </div>
        </div>
      ))}
      <div className="mt-6 text-xs text-gray-400 text-center">
        Complete all active activities before the due date.
      </div>
    </>
  );
};

export default ActivityTab;
