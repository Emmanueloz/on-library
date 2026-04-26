import { use, useState } from "react";
import { configEnv } from "../config";
import { AuthContext } from "../context/AuthContex";
import { buildAuthHeaders } from "../utils/buildAuthHeaders";

interface CreateChapterData {
  title: string;
  number: number;
  idSeries: string;
}

const useCreateChapter = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{ id: string } | null>(null);

  const authContext = use(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext is not available");
  }
  const { token, isAuthenticated } = authContext;

  const createChapter = async (chapterData: CreateChapterData) => {
    setIsLoading(true);
    setError(null);

    try {
      const headers = buildAuthHeaders(token, isAuthenticated());
      const res = await fetch(`${configEnv.apiUrl}/api/chapters/`, {
        method: "POST",
        headers,
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