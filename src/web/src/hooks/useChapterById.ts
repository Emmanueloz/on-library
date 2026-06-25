import { use, useEffect, useState, useCallback, useRef } from "react";
import { configEnv } from "../config";
import type { IChapter } from "@on-library/shared";
import { AuthContext } from "../context/AuthContex";
import { buildAuthHeaders } from "../utils/buildAuthHeaders";

const useChapterById = (id: string | undefined) => {
  const [chapter, setChapter] = useState<IChapter | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasLoadedRef = useRef(false);

  const authContext = use(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext is not available");
  }
  const { token, isAuthenticated } = authContext;

  const fetchChapter = useCallback(async () => {
    if (!id) return;

    if (!hasLoadedRef.current) {
      setIsLoading(true);
    }
    setError(null);

    try {
      const headers = buildAuthHeaders(token, isAuthenticated());
      const res = await fetch(`${configEnv.apiUrl}/api/chapters/${id}`, {
        headers,
      });
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Error fetching chapter");
      }

      setChapter(result.data);
      hasLoadedRef.current = true;
    } catch (err) {
      setError(`${err}`);
    } finally {
      setIsLoading(false);
    }
  }, [id, token, isAuthenticated]);

  useEffect(() => {
    fetchChapter();
  }, [fetchChapter]);

  return { chapter, isLoading, error, refetch: fetchChapter };
};

export { useChapterById };