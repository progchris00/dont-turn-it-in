import { useState, useEffect, useCallback } from "react";
import type { Activity } from "../types";
import { fetchActiveActivities } from "../api";

export function useActivities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadActivities = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchActiveActivities();
      setActivities(data);
    } catch (err) {
      console.error("Fetch activities error:", err);
      setError("Unable to load active activities. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  return { activities, loading, error, refetch: loadActivities };
}
