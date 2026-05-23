import { useQuery } from "@tanstack/react-query";

import type { Submission } from "@/components/StudentPortal/types";
import { fetchSubmissions } from "@/components/StudentPortal/data";

export function useSubmissions() {
  const query = useQuery<Submission[], Error>({
    queryKey: ["student-portal", "submissions"],
    queryFn: fetchSubmissions,
    staleTime: 5 * 60 * 1000,
  });

  return {
    submissions: query.data ?? [],
    loading: query.isLoading,
    error: query.error?.message ?? null,
    refetch: query.refetch,
  };
}
