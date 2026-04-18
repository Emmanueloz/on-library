import { useEffect, useState, useCallback } from "react";
import { configEnv } from "../config";
import type { IChapter } from "@on-library/shared";

const useChapterById = (id: string | undefined) => {
  const [chapter, setChapter] = useState<IChapter | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChapter = useCallback(async () => {
    if (!id) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${configEnv.apiUrl}/api/chapters/${id}`);
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Error fetching chapter");
      }

      setChapter(result.data);
    } catch (err) {
      setError(`${err}`);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchChapter();
  }, [fetchChapter]);

  return { chapter, isLoading, error, refetch: fetchChapter };
};

export { useChapterById };