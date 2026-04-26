import type { IChapter } from "@on-library/shared";
import { use, useEffect, useState } from "react";
import { configEnv } from "../config";
import { AuthContext } from "../context/AuthContex";
import { buildAuthHeaders } from "../utils/buildAuthHeaders";

const useChapter = ({ id }: { id: string | undefined }) => {
  const [chapter, setChapter] = useState<IChapter>();
  const [isLoading, setIsLoading] = useState(true);
  const [errorChapter, setErrorChapter] = useState<string | null>(null);

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
          `${configEnv.apiUrl}/api/chapters/${id}`,
          { headers },
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
  }, [id, token, isAuthenticated]);

  return {
    isLoading,
    chapter,
    setChapter,
    errorChapter,
  };
};

export { useChapter };
