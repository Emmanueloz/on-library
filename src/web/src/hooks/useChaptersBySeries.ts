import { useEffect, useState, useCallback } from "react";
import { configEnv } from "../config";
import type { IChapter } from "@on-library/shared";

const useChaptersBySeries = (idSeries: string) => {
  const [chapters, setChapters] = useState<IChapter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChapters = useCallback(async () => {
    if (!idSeries) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `${configEnv.apiUrl}/api/chapters/?idSeries=${idSeries}`
      );
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Error fetching chapters");
      }

      setChapters(result.data || []);
    } catch (err) {
      setError(`${err}`);
    } finally {
      setIsLoading(false);
    }
  }, [idSeries]);

  useEffect(() => {
    fetchChapters();
  }, [fetchChapters]);

  return { chapters, isLoading, error, refetch: fetchChapters };
};

export { useChaptersBySeries };