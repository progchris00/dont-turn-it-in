// components/SubmissionTab.tsx
import React from "react";
import type { Submission } from "../types";

interface SubmissionTabProps {
  submissions: Submission[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

const getAiPercentColor = (percent: number) => {
  if (percent >= 70) return "bg-red-600";
  if (percent >= 40) return "bg-yellow-500";
  return "bg-green-600";
};

const SubmissionTab: React.FC<SubmissionTabProps> = ({
  submissions,
  loading,
  error,
  onRetry,
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 text-center">
        <p className="text-gray-600">Loading submissions...</p>
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

  if (submissions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 text-center">
        <p className="text-gray-600">
          You haven't submitted any activities yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {submissions.map((sub) => (
        <div
          key={sub.id}
          className="bg-white rounded-xl shadow-md border border-gray-200 p-5"
        >
          <div className="flex justify-between items-start flex-wrap gap-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {sub.activityTitle}
              </h3>
              <p className="text-sm text-gray-500 mt-1.5">
                Submitted: {sub.studentName}
              </p>
            </div>
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full ${
                sub.aiflag.toLowerCase().includes("ai")
                  ? "bg-red-100 text-red-800"
                  : sub.aiflag.toLowerCase().includes("human")
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
              }`}
            >
              {sub.aiflag}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Submitted on {sub.submittedAt}
          </p>

          <div className="mt-3">
            <div className="flex justify-between items-center text-sm mb-1">
              <span className="text-gray-700 font-medium mb-2">
                AI Likelihood
              </span>
              <span className="text-gray-900 font-bold">{sub.aiPercent}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${getAiPercentColor(sub.aiPercent)}`}
                style={{ width: `${sub.aiPercent}%` }}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SubmissionTab;
