import { useEffect, useState } from "react";
import { configEnv } from "../config";
import type { ISeries } from "@on-library/shared";

const useSeries = () => {
  const [series, setSeries] = useState<ISeries[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorSeries, setErrorSeries] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${configEnv.apiUrl}/api/series/`);
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
  }, []);

  return {
    isLoading,
    series,
    setSeries,
    errorSeries,
  };
};

export { useSeries };
