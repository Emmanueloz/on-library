import type { ISeries } from "@on-library/shared";
import { use, useEffect, useState, useCallback } from "react";
import { configEnv } from "../config";
import { AuthContext } from "../context/AuthContex";
import { buildAuthHeaders } from "../utils/buildAuthHeaders";

const useSerie = ({ id }: { id: string | undefined }) => {
  const [serie, setSerie] = useState<ISeries>();
  const [isLoading, setIsLoading] = useState(true);
  const [errorSerie, setErrorSerie] = useState<string | null>(null);

  const authContext = use(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext is not available");
  }
  const { token, isAuthenticated } = authContext;

  const fetchData = useCallback(async () => {
    if (!id) return;
    
    setIsLoading(true);
    setErrorSerie(null);

    try {
      const headers = buildAuthHeaders(token, isAuthenticated());
      const res = await fetch(`${configEnv.apiUrl}/api/series/${id}`, {
        headers,
      });
      const result = await res.json();

      setSerie(result.data);
    } catch (error) {
      setErrorSerie(`${error}`);
    } finally {
      setIsLoading(false);
    }
  }, [id, token, isAuthenticated]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    isLoading,
    serie,
    setSerie,
    errorSerie,
    refetch: fetchData,
  };
};

export { useSerie };