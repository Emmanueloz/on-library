import { useEffect, useState } from "react";
import { configEnv } from "../config";
import type { ITags } from "@on-library/shared";

const useTags = ()=>{
    const [tags, setTags] = useState<ITags[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorTags, setErrorTags] = useState<string | null>(null);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const res = await fetch(`${configEnv.apiUrl}/api/tags/`);
          const result = await res.json();

          console.log(result);

          setTags(result.data);
        } catch (error) {
          setErrorTags(`${error}`);
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }, []);

    return {
      isLoading,
      tags,
      setTags,
      errorTags,
    };
}

export {useTags}