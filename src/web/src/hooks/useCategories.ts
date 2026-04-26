import { use, useEffect, useState } from "react";
import { configEnv } from "../config";
import type { ICategories } from "@on-library/shared";
import { AuthContext } from "../context/AuthContex";
import { buildAuthHeaders } from "../utils/buildAuthHeaders";

const useCategories = () => {
  const [categories, setCategories] = useState<ICategories[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorCategories, setErrorCategories] = useState<string | null>(null);

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
          `${configEnv.apiUrl}/api/categories/`,
          fetchOptions,
        );
        const result = await res.json();

        console.log(result);

        setErrorCategories(null);
        setCategories(result.data);
      } catch (error) {
        setErrorCategories(`${error}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token, isAuthenticated]);

  const addCategory = async (category: ICategories) => {
    try {
      const headers = buildAuthHeaders(token, isAuthenticated());
      const res = await fetch(`${configEnv.apiUrl}/api/categories/`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          name: category.name,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to add category");
      }

      const result = await res.json();
      setErrorCategories(null);
      setCategories((prevCategories) => [...prevCategories, result.data]);
    } catch (error) {
      setErrorCategories(`${error}`);
    }
  };

  const updateCategory = async (
    categoryId: string,
    updatedCategory: ICategories,
  ) => {
    try {
      const headers = buildAuthHeaders(token, isAuthenticated());
      const res = await fetch(
        `${configEnv.apiUrl}/api/categories/${categoryId}`,
        {
          method: "PUT",
          headers,
          body: JSON.stringify({
            name: updatedCategory.name,
          }),
        },
      );

      if (!res.ok) {
        throw new Error("Failed to update category");
      }

      const result = await res.json();
      setErrorCategories(null);

      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category.id === categoryId ? result.data : category,
        ),
      );
    } catch (error) {
      setErrorCategories(`${error}`);
    }
  };

  const deleteCategory = async (categoryId: string) => {
    try {
      const headers = buildAuthHeaders(token, isAuthenticated());
      const res = await fetch(
        `${configEnv.apiUrl}/api/categories/${categoryId}`,
        {
          method: "DELETE",
          headers,
        },
      );

      if (!res.ok) {
        throw new Error("Failed to delete category");
      }
      setErrorCategories(null);
      setCategories((prevCategories) =>
        prevCategories.filter((category) => category.id !== categoryId),
      );
    } catch (error) {
      setErrorCategories(`${error}`);
    }
  };

  return {
    isLoading,
    categories,
    setCategories,
    errorCategories,
    addCategory,
    updateCategory,
    deleteCategory,
  };
};

export { useCategories };
