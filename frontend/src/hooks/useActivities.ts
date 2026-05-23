import { useQuery } from "@tanstack/react-query";

import type { Activity } from "@/components/StudentPortal/types";
import { fetchActiveActivities } from "@/components/StudentPortal/data";

export function useActivities() {
  const query = useQuery<Activity[], Error>({
    queryKey: ["student-portal", "activities"],
    queryFn: fetchActiveActivities,
    staleTime: 5 * 60 * 1000,
  });

  return {
    activities: query.data ?? [],
    loading: query.isLoading,
    error: query.error?.message ?? null,
    refetch: query.refetch,
  };
}
