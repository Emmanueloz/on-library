import { useState } from "react";
import { configEnv } from "../config";

interface CreateChapterData {
  title: string;
  number: number;
  idSeries: string;
}

const useCreateChapter = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{ id: string } | null>(null);

  const createChapter = async (chapterData: CreateChapterData) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${configEnv.apiUrl}/api/chapters/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(chapterData),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Error creating chapter");
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

  return { createChapter, isLoading, error, data };
};

export { useCreateChapter };