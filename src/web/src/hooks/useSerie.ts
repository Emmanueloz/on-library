import type { ISeries } from "@on-library/shared";
import { useEffect, useState, useCallback } from "react";
import { configEnv } from "../config";

const useSerie = ({ id }: { id: string | undefined }) => {
  const [serie, setSerie] = useState<ISeries>();
  const [isLoading, setIsLoading] = useState(true);
  const [errorSerie, setErrorSerie] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!id) return;
    
    setIsLoading(true);
    setErrorSerie(null);

    try {
      const res = await fetch(`${configEnv.apiUrl}/api/series/${id}`);
      const result = await res.json();

      setSerie(result.data);
    } catch (error) {
      setErrorSerie(`${error}`);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

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