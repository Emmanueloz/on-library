import { use, useEffect, useState, useCallback } from "react";
import { AuthContext } from "../context/AuthContex";
import type { ILibraries } from "@on-library/shared";
import { configEnv } from "../config";
import { buildAuthHeaders } from "../utils/buildAuthHeaders";

interface UseLibraryBySerieResult {
  library: ILibraries | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const useLibraryBySerie = (serieId: string | undefined): UseLibraryBySerieResult => {
  const [library, setLibrary] = useState<ILibraries | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const authContext = use(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext is not available");
  }
  const { token, isAuthenticated } = authContext;

  const fetchData = useCallback(async () => {
    if (!serieId) {
      setLibrary(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const headers = buildAuthHeaders(token, isAuthenticated());
      const res = await fetch(
        `${configEnv.apiUrl}/api/libraries/serie/${serieId}`,
        { headers },
      );

      if (res.status === 404) {
        setLibrary(null);
        return;
      }

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to fetch library");
      }

      setLibrary(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch library");
      setLibrary(null);
    } finally {
      setIsLoading(false);
    }
  }, [serieId, token, isAuthenticated]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    library,
    isLoading,
    error,
    refetch: fetchData,
  };
};

export { useLibraryBySerie };