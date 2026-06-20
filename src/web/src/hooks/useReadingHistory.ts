import { use, useEffect, useState, useCallback } from "react";
import { AuthContext } from "../context/AuthContex";
import { configEnv } from "../config";
import { buildAuthHeaders } from "../utils/buildAuthHeaders";

interface UseReadingHistoryResult {
  readChapterIds: Set<string>;
  isLoading: boolean;
  error: string | null;
  markAsRead: (chapterId: string, markPrevious?: boolean) => Promise<void>;
  markAsUnread: (chapterId: string) => Promise<void>;
  refetch: () => Promise<void>;
}

const useReadingHistory = (serieId: string | undefined): UseReadingHistoryResult => {
  const [readChapterIds, setReadChapterIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const authContext = use(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext is not available");
  }
  const { token, isAuthenticated } = authContext;

  const fetchHistory = useCallback(async () => {
    if (!serieId) {
      setReadChapterIds(new Set());
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const headers = buildAuthHeaders(token, isAuthenticated(), false);
      const res = await fetch(
        `${configEnv.apiUrl}/api/history/${serieId}`,
        { headers },
      );

      if (res.status === 404) {
        setReadChapterIds(new Set());
        return;
      }

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to fetch reading history");
      }

      const readIds = new Set<string>(result.data.readChapterIds);
      setReadChapterIds(readIds);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch reading history");
      setReadChapterIds(new Set());
    } finally {
      setIsLoading(false);
    }
  }, [serieId, token, isAuthenticated]);

  const markAsRead = useCallback(
    async (chapterId: string, markPrevious = false) => {
      if (!serieId) return;

      setError(null);

      try {
        const headers = buildAuthHeaders(token, isAuthenticated(), false);
        const url = `${configEnv.apiUrl}/api/history/${serieId}/chapter/${chapterId}${markPrevious ? "?markPrevious=true" : ""}`;

        const res = await fetch(url, {
          method: "POST",
          headers,
        });

        if (!res.ok && res.status !== 204) {
          const result = await res.json();
          throw new Error(result.message || "Failed to mark as read");
        }

        await fetchHistory();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to mark as read");
      }
    },
    [serieId, token, isAuthenticated, fetchHistory],
  );

  const markAsUnread = useCallback(
    async (chapterId: string) => {
      if (!serieId) return;

      setError(null);

      try {
        const headers = buildAuthHeaders(token, isAuthenticated(), false);
        const url = `${configEnv.apiUrl}/api/history/${serieId}/chapter/${chapterId}`;

        const res = await fetch(url, {
          method: "DELETE",
          headers,
        });

        if (!res.ok && res.status !== 204) {
          const result = await res.json();
          throw new Error(result.message || "Failed to mark as unread");
        }

        await fetchHistory();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to mark as unread");
      }
    },
    [serieId, token, isAuthenticated, fetchHistory],
  );

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return {
    readChapterIds,
    isLoading,
    error,
    markAsRead,
    markAsUnread,
    refetch: fetchHistory,
  };
};

export { useReadingHistory };
