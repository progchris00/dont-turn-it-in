import { useState, useEffect, useCallback } from 'react'
import { getSubmissions } from '@/services/api'
import type { Submission } from '@/types'

interface UseSubmissionsReturn {
  submissions: Submission[]
  loading: boolean
  error:   string | null
  refetch: () => void
}

export function useSubmissions(): UseSubmissionsReturn {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState<string | null>(null)

  const fetchSubmissions = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getSubmissions()
      setSubmissions(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load submissions.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchSubmissions() }, [fetchSubmissions])

  return { submissions, loading, error, refetch: fetchSubmissions }
}
