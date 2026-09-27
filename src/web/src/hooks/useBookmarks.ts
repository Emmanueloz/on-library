import { use, useEffect, useState, useCallback } from "react";
import { AuthContext } from "../context/AuthContex";
import { configEnv } from "../config";
import { buildAuthHeaders } from "../utils/buildAuthHeaders";
import type { IBookmark, MediaType } from "@on-library/shared";

interface UseBookmarksResult {
  bookmarks: IBookmark[];
  isLoading: boolean;
  error: string | null;
  /** Id of the chapter whose bookmarks finished loading (initial fetch or
   * refetch). null while no fetch has completed for the current chapter. */
  loadedChapterId: string | null;
  addBookmark: (type: MediaType, page: number) => Promise<boolean>;
  removeBookmark: (id: string) => Promise<boolean>;
  removeAllBookmarks: () => Promise<boolean>;
  refetch: () => Promise<void>;
}

const useBookmarks = (
  chapterId: string | undefined,
  enabled: boolean,
): UseBookmarksResult => {
  const [bookmarks, setBookmarks] = useState<IBookmark[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadedChapterId, setLoadedChapterId] = useState<string | null>(null);

  const authContext = use(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext is not available");
  }
  const { token, isAuthenticated } = authContext;

  const fetchBookmarks = useCallback(async () => {
    if (!chapterId || !enabled || !isAuthenticated()) {
      setBookmarks([]);
      setIsLoading(false);
      setLoadedChapterId(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const headers = buildAuthHeaders(token, isAuthenticated(), false);
      const res = await fetch(
        `${configEnv.apiUrl}/api/bookmark/${chapterId}`,
        { headers },
      );

      if (res.status === 403 || res.status === 404) {
        setBookmarks([]);
        return;
      }

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to fetch bookmarks");
      }

      setBookmarks(result.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch bookmarks",
      );
      setBookmarks([]);
    } finally {
      setLoadedChapterId(chapterId);
      setIsLoading(false);
    }
  }, [chapterId, enabled, token, isAuthenticated]);

  const addBookmark = useCallback(
    async (type: MediaType, page: number): Promise<boolean> => {
      if (!chapterId || !enabled) return false;

      setError(null);

      try {
        const headers = buildAuthHeaders(token, isAuthenticated());
        const res = await fetch(`${configEnv.apiUrl}/api/bookmark`, {
          method: "POST",
          headers,
          body: JSON.stringify({ idChapter: chapterId, type, page }),
        });

        if (!res.ok) {
          const result = await res.json();
          throw new Error(result.message || "Failed to create bookmark");
        }

        await fetchBookmarks();
        return true;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to create bookmark",
        );
        return false;
      }
    },
    [chapterId, enabled, token, isAuthenticated, fetchBookmarks],
  );

  const removeBookmark = useCallback(
    async (id: string): Promise<boolean> => {
      if (!enabled) return false;

      setError(null);

      try {
        const headers = buildAuthHeaders(token, isAuthenticated(), false);
        const res = await fetch(`${configEnv.apiUrl}/api/bookmark/${id}`, {
          method: "DELETE",
          headers,
        });

        if (!res.ok && res.status !== 204) {
          const result = await res.json();
          throw new Error(result.message || "Failed to delete bookmark");
        }

        await fetchBookmarks();
        return true;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to delete bookmark",
        );
        return false;
      }
    },
    [enabled, token, isAuthenticated, fetchBookmarks],
  );

  const removeAllBookmarks = useCallback(async (): Promise<boolean> => {
    if (!chapterId || !enabled) return false;

    setError(null);

    try {
      const headers = buildAuthHeaders(token, isAuthenticated(), false);
      const res = await fetch(
        `${configEnv.apiUrl}/api/bookmark/chapter/${chapterId}`,
        { method: "DELETE", headers },
      );

      if (!res.ok && res.status !== 204) {
        const result = await res.json();
        throw new Error(result.message || "Failed to delete bookmarks");
      }

      await fetchBookmarks();
      return true;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete bookmarks",
      );
      return false;
    }
  }, [chapterId, enabled, token, isAuthenticated, fetchBookmarks]);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  return {
    bookmarks,
    isLoading,
    error,
    loadedChapterId,
    addBookmark,
    removeBookmark,
    removeAllBookmarks,
    refetch: fetchBookmarks,
  };
};

export { useBookmarks };
