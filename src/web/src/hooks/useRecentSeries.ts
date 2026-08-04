import type { ISeries } from "@on-library/shared";
import { use, useEffect, useState } from "react";
import { configEnv } from "../config";
import { AuthContext } from "../context/AuthContex";
import { buildAuthHeaders } from "../utils/buildAuthHeaders";

const useRecentSeries = (limit = 12) => {
  const [series, setSeries] = useState<ISeries[]>([]);
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
          `${configEnv.apiUrl}/api/series/recent?limit=${limit}`,
          { headers },
        );
        const result = await res.json();
        setSeries(result.data);
      } catch (err) {
        setError(`${err}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token, isAuthenticated, limit]);

  return { series, isLoading, error };
};

export { useRecentSeries };
