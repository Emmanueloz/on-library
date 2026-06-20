import { use, useEffect, useState, useCallback } from "react";
import { AuthContext } from "../context/AuthContex";
import { configEnv } from "../config";
import { buildAuthHeaders } from "../utils/buildAuthHeaders";

interface UseFollowingResult {
  isFollowing: boolean;
  isLoading: boolean;
  error: string | null;
  toggleFollow: () => Promise<void>;
  refetch: () => Promise<void>;
}

const useFollowing = (serieId: string | undefined): UseFollowingResult => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const authContext = use(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext is not available");
  }
  const { token, isAuthenticated } = authContext;

  const fetchStatus = useCallback(async () => {
    if (!serieId) {
      setIsFollowing(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const headers = buildAuthHeaders(token, isAuthenticated(),false);
      const res = await fetch(
        `${configEnv.apiUrl}/api/following/${serieId}`,
        { headers },
      );

      if (res.status === 404) {
        setIsFollowing(false);
        return;
      }

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to check following status");
      }

      setIsFollowing(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to check following status");
      setIsFollowing(false);
    } finally {
      setIsLoading(false);
    }
  }, [serieId, token, isAuthenticated]);

  const toggleFollow = useCallback(async () => {
    if (!serieId || isLoading) return;

    const wasFollowing = isFollowing;

    setIsFollowing(!wasFollowing);
    setError(null);

    try {
      const headers = buildAuthHeaders(token, isAuthenticated(),false);
      const method = wasFollowing ? "DELETE" : "POST";

      const res = await fetch(
        `${configEnv.apiUrl}/api/following/${serieId}`,
        { method, headers },
      );

      if (!res.ok && res.status !== 204) {
        const result = await res.json();
        throw new Error(result.message || "Failed to update follow status");
      }

      setIsFollowing(!wasFollowing);
    } catch (err) {
      setIsFollowing(wasFollowing);
      setError(err instanceof Error ? err.message : "Failed to update follow status");
    }
  }, [serieId, isFollowing, isLoading, token, isAuthenticated]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  return {
    isFollowing,
    isLoading,
    error,
    toggleFollow,
    refetch: fetchStatus,
  };
};

export { useFollowing };