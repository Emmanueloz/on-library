import { use, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContex";
import type { ILibraries } from "@on-library/shared";
import { configEnv } from "../config";
import { buildAuthHeaders } from "../utils/buildAuthHeaders";

const useLibrary = ({ id }: { id: string }) => {
  const [library, setLibrary] = useState<ILibraries | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorLibrary, setErrorLibrary] = useState<string | null>(null);

  const authContext = use(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext is not available");
  }
  const { token, isAuthenticated } = authContext;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = buildAuthHeaders(token, isAuthenticated());
        const fetchOptions: RequestInit = {
          method: "GET",
          headers,
        };

        const res = await fetch(
          `${configEnv.apiUrl}/api/libraries/${id}`,
          fetchOptions,
        );
        const result = await res.json();

        console.log(result);

        setErrorLibrary(null);
        setLibrary(result.data);
      } catch (error) {
        setErrorLibrary(`${error}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token, isAuthenticated, id]);

  return {
    library,
    isLoading,
    errorLibrary,
  };
};

export { useLibrary };
