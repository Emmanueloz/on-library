import type { ISeries } from "@on-library/shared";
import { useEffect, useState } from "react";
import { configEnv } from "../config";

const useSerie = ({ id }: { id: string | undefined }) => {
  const [serie, setSerie] = useState<ISeries>();
  const [isLoading, setIsLoading] = useState(true);
  const [errorSerie, setErrorSerie] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${configEnv.apiUrl}/api/series/${id}`);
        const result = await res.json();

        console.log(result);

        setSerie(result.data);
      } catch (error) {
        setErrorSerie(`${error}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return {
    isLoading,
    serie,
    setSerie,
    errorSerie,
  };
};

export { useSerie };
