import { useEffect, useState } from "react";
import { configEnv } from "../config";
import type { ICategories } from "@on-library/shared";

const useCategories = () => {
  const [categories, setCategories] = useState<ICategories[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorCategories, setErrorCategories] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${configEnv.apiUrl}/api/categories/`);
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
  }, []);

  const addCategory = async (category: ICategories) => {
    try {
      const res = await fetch(`${configEnv.apiUrl}/api/categories/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
      const res = await fetch(
        `${configEnv.apiUrl}/api/categories/${categoryId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
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
    console.log(categoryId);

    try {
      const res = await fetch(
        `${configEnv.apiUrl}/api/categories/${categoryId}`,
        {
          method: "DELETE",
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
