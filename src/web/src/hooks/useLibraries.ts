import { use, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContex";
import type { ILibraries } from "@on-library/shared";
import { configEnv } from "../config";
import { buildAuthHeaders } from "../utils/buildAuthHeaders";

const useLibraries = () => {
  const [libraries, setLibraries] = useState<ILibraries[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorLibraries, setErrorLibraries] = useState<string | null>(null);
  const [errorCreateLibrary, setErrorCreateLibrary] = useState<string | null>(
    null,
  );

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
          `${configEnv.apiUrl}/api/libraries/`,
          fetchOptions,
        );
        const result = await res.json();

        console.log(result);

        setErrorLibraries(null);
        setLibraries(result.data);
      } catch (error) {
        setErrorLibraries(`${error}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token, isAuthenticated]);

  const addLibrary = async (library: ILibraries) => {
    try {
      const headers = buildAuthHeaders(token, isAuthenticated());
      const fetchOptions: RequestInit = {
        method: "POST",
        headers,
        body: JSON.stringify({
          name: library.name,
          isPublic: library.isPublic,
        }),
      };

      const res = await fetch(
        `${configEnv.apiUrl}/api/libraries/`,
        fetchOptions,
      );
      const result = await res.json();

      console.log(result);

      setErrorCreateLibrary(null);
      setLibraries((prev) => [...prev, result.data]);
    } catch (error) {
      setErrorCreateLibrary(`${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    libraries,
    isLoading,
    errorLibraries,
    errorCreateLibrary,
    addLibrary,
  };
};

export { useLibraries };
