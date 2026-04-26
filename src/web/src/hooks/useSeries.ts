import { use, useEffect, useState } from "react";
import { configEnv } from "../config";
import type { ISeries } from "@on-library/shared";
import { AuthContext } from "../context/AuthContex";
import { buildAuthHeaders } from "../utils/buildAuthHeaders";

const useSeries = () => {
  const [series, setSeries] = useState<ISeries[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorSeries, setErrorSeries] = useState<string | null>(null);

  const authContext = use(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext is not available");
  }
  const { token, isAuthenticated } = authContext;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = buildAuthHeaders(token, isAuthenticated());
        const res = await fetch(`${configEnv.apiUrl}/api/series/`, {
          headers,
        });
        const result = await res.json();

        console.log(result);

        setSeries(result.data);
      } catch (error) {
        setErrorSeries(`${error}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token, isAuthenticated]);

  return {
    isLoading,
    series,
    setSeries,
    errorSeries,
  };
};

export { useSeries };
