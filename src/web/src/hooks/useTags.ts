import { useEffect, useState } from "react";
import { configEnv } from "../config";
import type { ITags } from "@on-library/shared";

const useTags = () => {
  const [tags, setTags] = useState<ITags[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorTags, setErrorTags] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${configEnv.apiUrl}/api/tags/`);
        const result = await res.json();

        setTags(result.data || []);
      } catch (error) {
        setErrorTags(`${error}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const addTag = async (tag: Partial<ITags>) => {
    try {
      const res = await fetch(`${configEnv.apiUrl}/api/tags/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: tag.name,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to add tag");
      }

      const result = await res.json();
      setErrorTags(null);
      setTags((prevTags) => [...prevTags, result.data]);
    } catch (error) {
      setErrorTags(`${error}`);
    }
  };

  const updateTag = async (
    tagId: string,
    updatedTag: Partial<ITags>,
  ) => {
    try {
      const res = await fetch(
        `${configEnv.apiUrl}/api/tags/${tagId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: updatedTag.name,
          }),
        },
      );

      if (!res.ok) {
        throw new Error("Failed to update tag");
      }

      const result = await res.json();
      setErrorTags(null);

      setTags((prevTags) =>
        prevTags.map((tag) =>
          tag.id === tagId ? result.data : tag,
        ),
      );
    } catch (error) {
      setErrorTags(`${error}`);
    }
  };

  const deleteTag = async (tagId: string) => {
    try {
      const res = await fetch(
        `${configEnv.apiUrl}/api/tags/${tagId}`,
        {
          method: "DELETE",
        },
      );

      if (!res.ok) {
        throw new Error("Failed to delete tag");
      }
      setErrorTags(null);
      setTags((prevTags) =>
        prevTags.filter((tag) => tag.id !== tagId),
      );
    } catch (error) {
      setErrorTags(`${error}`);
    }
  };

  return {
    isLoading,
    tags,
    setTags,
    errorTags,
    addTag,
    updateTag,
    deleteTag,
  };
};

export { useTags };