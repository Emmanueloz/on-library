import type { IChapter } from "@on-library/shared";
import { useEffect, useState } from "react";
import { configEnv } from "../config";

const useChapter = ({ id }: { id: string | undefined }) => {
  const [chapter, setChapter] = useState<IChapter>();
  const [isLoading, setIsLoading] = useState(true);
  const [errorChapter, setErrorChapter] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${configEnv.apiUrl}/api/chapters/${id}`,
        );
        const result = await res.json();

        console.log(result);

        setChapter(result.data);
      } catch (error) {
        setErrorChapter(`${error}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return {
    isLoading,
    chapter,
    setChapter,
    errorChapter,
  };
};

export { useChapter };
