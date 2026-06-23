import { use, useState } from "react";
import { configEnv } from "../config";
import { AuthContext } from "../context/AuthContex";
import { buildAuthHeaders } from "../utils/buildAuthHeaders";

const useImportChapters = (idSeries: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const authContext = use(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext is not available");
  }
  const { token, isAuthenticated } = authContext;

  const importChapters = async (file: File) => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("idSeries", idSeries);

      const headers = buildAuthHeaders(token, isAuthenticated(), false);
      const res = await fetch(`${configEnv.apiUrl}/api/chapters/import`, {
        method: "POST",
        headers,
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Error importing chapters");
      }

      return result.data;
    } catch (err) {
      setError(`${err}`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { importChapters, isLoading, error };
};

export { useImportChapters };
