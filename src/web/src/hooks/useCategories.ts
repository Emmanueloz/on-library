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

        setCategories(result.data);
      } catch (error) {
        setErrorCategories(`${error}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    isLoading,
    categories,
    setCategories,
    errorCategories,
  };
};

export { useCategories };
