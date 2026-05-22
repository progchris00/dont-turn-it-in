import { useState, useEffect, useCallback } from "react";
import type { Submission } from "../types";
import { fetchSubmissions } from "../api";

export function useSubmissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSubmissions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSubmissions();
      setSubmissions(data);
    } catch (err) {
      console.error("Fetch submissions error:", err);
      setError("Unable to load past submissions. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSubmissions();
  }, [loadSubmissions]);

  return { submissions, loading, error, refetch: loadSubmissions };
}
