import { useState, useEffect, useCallback } from 'react'
import { getDashboardStats, getStudents } from '@/services/api'
import type { DashboardStats, StudentMonitorRow } from '@/types'

interface UseDashboardReturn {
  stats:    DashboardStats | null
  students: StudentMonitorRow[]
  loading:  boolean
  error:    string | null
  refetch:  () => void
}

export function useDashboard(): UseDashboardReturn {
  const [stats, setStats]       = useState<DashboardStats | null>(null)
  const [students, setStudents] = useState<StudentMonitorRow[]>([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState<string | null>(null)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [s, st] = await Promise.all([getDashboardStats(), getStudents()])
      setStats(s)
      setStudents(st)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  return { stats, students, loading, error, refetch: fetchAll }
}
