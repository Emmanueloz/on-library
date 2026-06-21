import { useState, useCallback } from "react";
import ky from "ky";

interface JikanManga {
  title: string;
  title_english?: string;
  synopsis?: string;
  type?: string;
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
  authors?: { name: string }[];
  genres?: { name: string }[];
  themes?: { name: string }[];
  demographics?: { name: string }[];
  published?: { from?: string };
}

interface JikanResponse {
  data: JikanManga[];
}

const useJikanSearch = () => {
  const [images, setImages] = useState<JikanManga[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [singleResult, setSingleResult] = useState<JikanManga | null>(null);
  const [isSearchingOne, setIsSearchingOne] = useState(false);
  const [searchOneError, setSearchOneError] = useState<string | null>(null);

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

  const searchOne = useCallback(async (query: string): Promise<JikanManga | null> => {
    if (!query.trim()) {
      setSingleResult(null);
      return null;
    }

    setIsSearchingOne(true);
    setSearchOneError(null);

    try {
      const response = await ky.get(
        `https://api.jikan.moe/v4/manga`,
        { searchParams: { q: query, limit: 1 } }
      ).json<JikanResponse>();

      const result = response.data[0] ?? null;
      setSingleResult(result);
      return result;
    } catch (err) {
      setSearchOneError(`${err}`);
      setSingleResult(null);
      return null;
    } finally {
      setIsSearchingOne(false);
    }
  }, []);

  const clearImages = useCallback(() => {
    setImages([]);
    setError(null);
  }, []);

  return {
    search,
    images,
    isLoading,
    error,
    clearImages,
    searchOne,
    singleResult,
    isSearchingOne,
    searchOneError,
  };
};

export { useJikanSearch };
export type { JikanManga };