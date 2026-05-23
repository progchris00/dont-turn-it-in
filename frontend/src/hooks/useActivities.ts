import { useQuery } from "@tanstack/react-query"
import { fetchActiveActivities } from "@/components/StudentPortal/data"
import type { Activity } from "@/components/StudentPortal/types"

export function useActivities() {
  const query = useQuery<Activity[], Error>({
    queryKey: ["student-portal", "activities"],
    queryFn: fetchActiveActivities,
    staleTime: 5 * 60 * 1000,
  })

  return {
    activities: query.data ?? [],
    loading: query.isLoading,
    error: query.error?.message ?? null,
    refetch: query.refetch,
  }
}
