import { use, useState } from "react";
import { configEnv } from "../config";
import { AuthContext } from "../context/AuthContex";

const useUploadEpub = (idChapter: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<unknown | null>(null);

  const authContext = use(AuthContext);
  if (!authContext) {
    throw new Error("AuthContext is not available");
  }
  const { token } = authContext;

  const uploadEpub = async (file: File) => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(
        `${configEnv.apiUrl}/api/chapters/${idChapter}/media/epub`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Error uploading EPUB");
      }

      setData(result.data);
      return result.data;
    } catch (err) {
      setError(`${err}`);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { uploadEpub, isLoading, error, data };
};

export { useUploadEpub };
