import { useState, useEffect, useCallback } from 'react'
import { getAssignments } from '@/services/api'
import type { Assignment } from '@/types'

interface UseAssignmentsReturn {
  assignments: Assignment[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useAssignments(): UseAssignmentsReturn {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState<string | null>(null)

  const fetchAssignments = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getAssignments()
      setAssignments(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load assignments.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAssignments() }, [fetchAssignments])

  return { assignments, loading, error, refetch: fetchAssignments }
}
