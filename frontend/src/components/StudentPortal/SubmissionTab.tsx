import type { Submission } from "@/components/StudentPortal/types"
import { Button } from "@/components/ui/button"

interface SubmissionTabProps {
  submissions: Submission[]
  loading: boolean
  error: string | null
  onRetry: () => void
}

const getAiPercentColor = (percent: number) => {
  if (percent >= 70) return "bg-red-600"
  if (percent >= 40) return "bg-yellow-500"
  return "bg-green-600"
}

export function SubmissionTab({
  submissions,
  loading,
  error,
  onRetry,
}: SubmissionTabProps) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
        <p className="text-sm text-muted-foreground">Loading submissions...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center shadow-sm">
        <p className="text-sm text-red-700">{error}</p>
        <Button
          onClick={onRetry}
          className="mt-4 bg-orange-600 text-white hover:bg-orange-700"
        >
          Retry
        </Button>
      </div>
    )
  }

  if (submissions.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-8 text-center">
        <p className="text-sm text-muted-foreground">
          You haven't submitted any activities yet.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {submissions.map((sub) => (
        <div
          key={sub.id}
          className="rounded-2xl border border-border bg-card p-5 shadow-sm"
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                {sub.activityTitle}
              </h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Submitted: {sub.studentName}
              </p>
            </div>
            <span
              className={`rounded-full px-2 py-1 text-xs font-medium ${
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

          <p className="mt-1 text-sm text-muted-foreground">
            Submitted on {sub.submittedAt}
          </p>

          <div className="mt-3">
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="mb-2 font-medium text-gray-700">
                AI Likelihood
              </span>
              <span className="font-bold text-foreground">
                {sub.aiPercent}%
              </span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-gray-200">
              <div
                className={`h-2.5 rounded-full ${getAiPercentColor(sub.aiPercent)}`}
                style={{ width: `${sub.aiPercent}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default SubmissionTab
