import { useState } from "react";
import { configEnv } from "../config";

const useUploadPages = (idChapter: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<unknown[] | null>(null);

  const uploadPages = async (files: File[]) => {
    if (files.length === 0) {
      throw new Error("No files selected");
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      for (const file of files) {
        formData.append("files", file);
      }

      const res = await fetch(
        `${configEnv.apiUrl}/api/chapters/${idChapter}/pages/batch`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Error uploading pages");
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

  return { uploadPages, isLoading, error, data };
};

export { useUploadPages };