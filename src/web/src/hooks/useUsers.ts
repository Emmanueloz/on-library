import { use, useEffect, useState } from "react";
import { configEnv } from "../config";
import type { IUserPayload, ILibraries } from "@on-library/shared";
import { AuthContext } from "../context/AuthContex";
import { buildAuthHeaders } from "../utils/buildAuthHeaders";

interface PermissionEntry {
  module: string;
  type: string;
}

const useUsers = () => {
  const [users, setUsers] = useState<IUserPayload[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorUsers, setErrorUsers] = useState<string | null>(null);

  const authContext = use(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext is not available");
  }
  const { token, isAuthenticated } = authContext;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = buildAuthHeaders(token, isAuthenticated());
        const res = await fetch(`${configEnv.apiUrl}/api/users/`, {
          method: "GET",
          headers,
        });
        const result = await res.json();
        setErrorUsers(null);
        setUsers(result.data);
      } catch (error) {
        setErrorUsers(`${error}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token, isAuthenticated]);

  const addPermissions = async (
    userId: string,
    permissions: PermissionEntry[],
  ) => {
    try {
      const headers = buildAuthHeaders(token, isAuthenticated());
      const res = await fetch(
        `${configEnv.apiUrl}/api/users/${userId}/permissions`,
        {
          method: "PUT",
          headers,
          body: JSON.stringify({ permissions }),
        },
      );

      if (!res.ok) {
        throw new Error("Failed to add permissions");
      }

      const result = await res.json();
      setErrorUsers(null);
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === userId ? { ...u, permissions: result.data.permissions } : u,
        ),
      );
      return result.data;
    } catch (error) {
      setErrorUsers(`${error}`);
      return null;
    }
  };

  const removePermissions = async (
    userId: string,
    permissions: PermissionEntry[],
  ) => {
    try {
      const headers = buildAuthHeaders(token, isAuthenticated());
      const res = await fetch(
        `${configEnv.apiUrl}/api/users/${userId}/permissions`,
        {
          method: "DELETE",
          headers,
          body: JSON.stringify({ permissions }),
        },
      );

      if (!res.ok) {
        throw new Error("Failed to remove permissions");
      }

      setErrorUsers(null);
      return true;
    } catch (error) {
      setErrorUsers(`${error}`);
      return false;
    }
  };

  const fetchUserLibraries = async (userId: string) => {
    try {
      const headers = buildAuthHeaders(token, isAuthenticated());
      const res = await fetch(
        `${configEnv.apiUrl}/api/users/${userId}/libraries`,
        {
          method: "GET",
          headers,
        },
      );
      const result = await res.json();
      setErrorUsers(null);
      return result.data as ILibraries[];
    } catch (error) {
      setErrorUsers(`${error}`);
      return [];
    }
  };

  const resetPassword = async (userId: string, newPassword: string) => {
    try {
      const headers = buildAuthHeaders(token, isAuthenticated());
      const res = await fetch(
        `${configEnv.apiUrl}/api/users/${userId}/reset-password`,
        {
          method: "POST",
          headers,
          body: JSON.stringify({ newPassword }),
        },
      );

      if (!res.ok) {
        throw new Error("Failed to reset password");
      }

      const result = await res.json();
      setErrorUsers(null);
      return result.data;
    } catch (error) {
      setErrorUsers(`${error}`);
      return null;
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      const headers = buildAuthHeaders(token, isAuthenticated(),false);
      const res = await fetch(`${configEnv.apiUrl}/api/users/${userId}`, {
        method: "DELETE",
        headers,
      });

      if (!res.ok) {
        throw new Error("Failed to delete user");
      }

      setErrorUsers(null);
      setUsers((prevUsers) => prevUsers.filter((u) => u.id !== userId));
      return true;
    } catch (error) {
      setErrorUsers(`${error}`);
      return false;
    }
  };

  return {
    isLoading,
    users,
    errorUsers,
    addPermissions,
    removePermissions,
    fetchUserLibraries,
    resetPassword,
    deleteUser,
  };
};

export { useUsers };
