import { formatDateTime, aiLikelihoodColor } from '@/utils'
import type { Submission } from '@/types'

interface SubmissionTableProps {
  submissions: Submission[]
}

export function SubmissionTable({ submissions }: SubmissionTableProps) {
  if (submissions.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-card px-6 py-12 text-center text-gray-400 text-sm">
        No submissions yet.
      </div>
    )
  }

  return (
    <ul className="space-y-3">
      {submissions.map((sub) => (
        <li
          key={sub.id}
          className="bg-white rounded-2xl shadow-card px-6 py-5"
        >
          <h3 className="font-semibold text-gray-900">{sub.assignmentTitle}</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Submitted on {formatDateTime(sub.submittedAt)}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Submitted by: <span className="font-medium text-gray-900">{sub.studentName}</span>
          </p>
          <div className="flex items-center gap-5 mt-3">
            <span className={`flex items-center gap-1.5 text-sm font-semibold ${aiLikelihoodColor(sub.aiLikelihood)}`}>
              <span className="w-2 h-2 rounded-full bg-current" />
              AI Likelihood: {sub.aiLikelihood}%
            </span>
            <span className="flex items-center gap-1.5 text-sm font-semibold text-brand-600">
              <span>🏅</span>
              Grade: {sub.grade}%
            </span>
          </div>
        </li>
      ))}
    </ul>
  )
}
