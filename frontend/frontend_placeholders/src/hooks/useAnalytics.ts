import { useState, useEffect, useCallback } from 'react'
import { getAnalytics } from '@/services/api'
import type { Analytics } from '@/types'

interface UseAnalyticsReturn {
  analytics: Analytics | null
  loading:   boolean
  error:     string | null
  refetch:   () => void
}

export function useAnalytics(): UseAnalyticsReturn {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState<string | null>(null)

  const fetchAnalytics = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getAnalytics()
      setAnalytics(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load analytics.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAnalytics() }, [fetchAnalytics])

  return { analytics, loading, error, refetch: fetchAnalytics }
}
