import { use, useState } from "react";
import { configEnv } from "../config";
import { AuthContext } from "../context/AuthContex";
import { buildAuthHeaders } from "../utils/buildAuthHeaders";

const useDeletePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const authContext = use(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext is not available");
  }
  const { token, isAuthenticated } = authContext;

  const deletePage = async (idChapter: string, pageId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const headers = buildAuthHeaders(token, isAuthenticated(),false);
      const res = await fetch(
        `${configEnv.apiUrl}/api/chapters/${idChapter}/media/${pageId}`,
        {
          method: "DELETE",
          headers,
        },
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Error deleting page");
      }

      return result.data;
    } catch (err) {
      setError(`${err}`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { deletePage, isLoading, error };
};

export { useDeletePage };
