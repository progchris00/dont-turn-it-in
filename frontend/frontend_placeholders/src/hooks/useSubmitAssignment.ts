import { useState } from 'react'
import { submitAssignment } from '@/services/api'
import type { SubmitAssignmentPayload, Submission } from '@/types'

interface UseSubmitAssignmentReturn {
  submit: (payload: SubmitAssignmentPayload) => Promise<Submission | null>
  loading: boolean
  error:   string | null
  success: boolean
  reset:   () => void
}

export function useSubmitAssignment(): UseSubmitAssignmentReturn {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const reset = () => { setError(null); setSuccess(false) }

  const submit = async (payload: SubmitAssignmentPayload): Promise<Submission | null> => {
    setLoading(true)
    setError(null)
    setSuccess(false)
    try {
      const res = await submitAssignment(payload)
      setSuccess(true)
      return res.data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed.')
      return null
    } finally {
      setLoading(false)
    }
  }

  return { submit, loading, error, success, reset }
}
