import type { IChapter } from "@on-library/shared";
import { use, useEffect, useState } from "react";
import { configEnv } from "../config";
import { AuthContext } from "../context/AuthContex";
import { buildAuthHeaders } from "../utils/buildAuthHeaders";

const useChapters = () => {
  const [chapters, setChapters] = useState<IChapter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorChapters, setErrorChapters] = useState<string | null>(null);

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
          `${configEnv.apiUrl}/api/chapters/?orderBy=createdAt&orderType=desc`,
          {
            headers,
          },
        );
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
  }, [token, isAuthenticated]);

  return {
    isLoading,
    chapters,
    setChapters,
    errorChapters,
  };
};

export { useChapters };
