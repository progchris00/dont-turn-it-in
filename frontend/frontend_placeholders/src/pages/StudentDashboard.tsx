import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Navbar } from '@/components/layout/Navbar'
import { AssignmentCard } from '@/components/dashboard/AssignmentCard'
import { SubmissionTable } from '@/components/tables/SubmissionTable'
import { UploadForm } from '@/components/forms/UploadForm'
import { useAssignments } from '@/hooks/useAssignments'
import { useSubmissions } from '@/hooks/useSubmissions'
import { Loader2, AlertCircle } from 'lucide-react'
import type { Assignment, Submission } from '@/types'
import { ROUTES } from '@/constants'

type Tab = 'assignments' | 'submissions'

export default function StudentDashboard() {
  const navigate                        = useNavigate()
  const [activeTab, setActiveTab]       = useState<Tab>('assignments')
  const [modalAssignment, setModal]     = useState<Assignment | null>(null)

  const { assignments, loading: aLoading, error: aError } = useAssignments()
  const { submissions, loading: sLoading, error: sError, refetch } = useSubmissions()

  const handleSubmitSuccess = (sub: Submission) => {
    setModal(null)
    refetch()
    console.log('New submission:', sub)
  }

  return (
    <div className="min-h-screen bg-surface-bg font-sans">
      <Navbar role="student" onSwitchRole={() => navigate(ROUTES.HOME)} />

      {/* Tabs */}
      <div className="max-w-4xl mx-auto px-4 pt-8">
        <div className="inline-flex bg-white rounded-xl shadow-card p-1 gap-1">
          {(['assignments', 'submissions'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold capitalize transition-colors
                ${activeTab === tab
                  ? 'bg-surface-muted text-gray-900'
                  : 'text-gray-400 hover:text-gray-700'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-5">
        {activeTab === 'assignments' && (
          <>
            <h1 className="text-xl font-bold text-gray-900">Active Assignments</h1>
            {aLoading && <LoadingState />}
            {aError && <ErrorState message={aError} />}
            {!aLoading && !aError && assignments.length === 0 && (
              <EmptyState message="No active assignments right now." />
            )}
            {assignments.map((a) => (
              <AssignmentCard key={a.id} assignment={a} onSubmit={setModal} />
            ))}
          </>
        )}

        {activeTab === 'submissions' && (
          <>
            <h1 className="text-xl font-bold text-gray-900">List of Submissions</h1>
            {sLoading && <LoadingState />}
            {sError && <ErrorState message={sError} />}
            {!sLoading && !sError && <SubmissionTable submissions={submissions} />}
          </>
        )}
      </main>

      {/* Modal */}
      {modalAssignment && (
        <UploadForm
          assignment={modalAssignment}
          onClose={() => setModal(null)}
          onSuccess={handleSubmitSuccess}
        />
      )}
    </div>
  )
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center py-16 text-gray-400 gap-2">
      <Loader2 className="w-5 h-5 animate-spin" />
      <span className="text-sm">Loading…</span>
    </div>
  )
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 text-red-600 bg-red-50 rounded-xl px-4 py-3 text-sm">
      <AlertCircle className="w-4 h-4 shrink-0" />
      {message}
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center text-gray-400 text-sm py-12 bg-white rounded-2xl shadow-card">
      {message}
    </div>
  )
}
