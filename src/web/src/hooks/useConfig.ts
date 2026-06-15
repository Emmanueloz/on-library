import { useLocalStorage } from "./useLocalStorage";

type ViewMode = "cascade" | "page-by-page";

const useConfig = () => {
  const [viewMode, setViewMode] = useLocalStorage<ViewMode>(
    "viewMode",
    "cascade",
  );

  return {
    viewMode,
    setViewMode,
  };
};

export { useConfig, type ViewMode };
