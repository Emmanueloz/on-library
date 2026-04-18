import { useState } from "react";
import { configEnv } from "../config";

interface CreateSeriesData {
  title: string;
  pictureUrl: string;
  description: string;
  author: string;
  publicationDate: string;
  idCategory: string;
  tags: string[];
}

const useCreateSeries = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{ id: string } | null>(null);

  const createSeries = async (seriesData: CreateSeriesData) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${configEnv.apiUrl}/api/series/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(seriesData),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Error creating series");
      }

      setData(result.data);
      return result.data;
    } catch (err) {
      setError(`${err}`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { createSeries, isLoading, error, data };
};

export { useCreateSeries };