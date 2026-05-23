import { Calendar, Upload } from 'lucide-react'
import { formatDate } from '@/utils'
import type { Assignment } from '@/types'

interface AssignmentCardProps {
  assignment:  Assignment
  onSubmit:    (assignment: Assignment) => void
}

export function AssignmentCard({ assignment, onSubmit }: AssignmentCardProps) {
  const isPastDue = new Date(assignment.dueDate) < new Date()

  return (
    <div className="bg-white rounded-2xl shadow-card px-6 py-5 flex items-center justify-between gap-6">
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 truncate">{assignment.title}</h3>
        <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{assignment.description}</p>
        <span
          className={`mt-3 inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full
            ${isPastDue
              ? 'bg-red-50 text-red-600'
              : 'bg-surface-muted text-gray-600'}`}
        >
          <Calendar className="w-3 h-3" />
          Due {formatDate(assignment.dueDate)}
        </span>
      </div>

      <button
        onClick={() => onSubmit(assignment)}
        disabled={isPastDue}
        className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 text-white text-sm font-semibold
          hover:bg-brand-700 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Upload className="w-4 h-4" />
        Submit
      </button>
    </div>
  )
}
