import { useState, useCallback } from "react";
import ky from "ky";

interface JikanManga {
  title: string;
  images: {
    jpg: {
      image_url: string;
      small_image_url?: string;
      large_image_url?: string;
    };
    webp: {
      image_url?: string;
      small_image_url?: string;
      large_image_url?: string;
    };
  };
}

interface JikanResponse {
  data: JikanManga[];
}

const useJikanSearch = () => {
  const [images, setImages] = useState<JikanManga[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setImages([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await ky.get(
        `https://api.jikan.moe/v4/manga`,
        { searchParams: { q: query, limit: 20 } }
      ).json<JikanResponse>();

      setImages(response.data);
    } catch (err) {
      setError(`${err}`);
      setImages([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearImages = useCallback(() => {
    setImages([]);
    setError(null);
  }, []);

  return { search, images, isLoading, error, clearImages };
};

export { useJikanSearch };