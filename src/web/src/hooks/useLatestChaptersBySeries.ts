import type { IChapter } from "@on-library/shared";
import { use, useEffect, useState } from "react";
import { configEnv } from "../config";
import { AuthContext } from "../context/AuthContex";
import { buildAuthHeaders } from "../utils/buildAuthHeaders";

const useLatestChaptersBySeries = (limit = 20) => {
  const [chapters, setChapters] = useState<IChapter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const authContext = use(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext is not available");
  }
  const { token, isAuthenticated } = authContext;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = buildAuthHeaders(token, isAuthenticated());
        const res = await fetch(
          `${configEnv.apiUrl}/api/chapters/latest-by-series?limit=${limit}`,
          { headers },
        );
        const result = await res.json();
        setChapters(result.data);
      } catch (err) {
        setError(`${err}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token, isAuthenticated, limit]);

  return { chapters, isLoading, error };
};

export { useLatestChaptersBySeries };
