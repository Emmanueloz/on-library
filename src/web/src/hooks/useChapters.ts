import type { IChapter } from "@on-library/shared";
import { useEffect, useState } from "react";
import { configEnv } from "../config";

const useChapters = () => {
  const [chapters, setChapters] = useState<IChapter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorChapters, setErrorChapters] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${configEnv.apiUrl}/api/chapters/`);
        const result = await res.json();

        console.log(result);

        setChapters(result.data);
      } catch (error) {
        setErrorChapters(`${error}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    isLoading,
    chapters,
    setChapters,
    errorChapters,
  };
};

export { useChapters };
