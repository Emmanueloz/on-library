import { use, useState } from "react";
import { configEnv } from "../config";
import { AuthContext } from "../context/AuthContex";
import { buildAuthHeaders } from "../utils/buildAuthHeaders";

interface UpdateSeriesData {
  title?: string;
  pictureUrl?: string;
  description?: string;
  author?: string;
  publicationDate?: string;
  idCategory?: string;
  tags?: string[];
}

const useUpdateSeries = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const authContext = use(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext is not available");
  }
  const { token, isAuthenticated } = authContext;

  const updateSeries = async (id: string, seriesData: UpdateSeriesData) => {
    setIsLoading(true);
    setError(null);

    try {
      const headers = buildAuthHeaders(token, isAuthenticated());
      const res = await fetch(`${configEnv.apiUrl}/api/series/${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(seriesData),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Error updating series");
      }

      return result.data;
    } catch (err) {
      setError(`${err}`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { updateSeries, isLoading, error };
};

export { useUpdateSeries };