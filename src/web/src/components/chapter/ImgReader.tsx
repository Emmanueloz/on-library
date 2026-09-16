import { useState } from "react";
import type { ViewMode } from "../../hooks/useConfig";
import { LazyImage } from "../common/LazyImage";
import type { IMedia } from "@on-library/shared";

interface ImgReaderProps {
  viewMode: ViewMode;
  imageMedia: IMedia[];
}

export function ImgReader({ viewMode, imageMedia }: ImgReaderProps) {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const totalPages = imageMedia.length;

  const currentPage = imageMedia[currentPageIndex];

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPageIndex < totalPages - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
    }
  };

  if (viewMode === "page-by-page") {
    return (
      <div className="relative w-full h-[calc(100vh-56px)] flex items-center justify-center">
        <button
          onClick={handleNextPage}
          disabled={currentPageIndex >= totalPages - 1}
          className="absolute left-0 top-0 bottom-0 w-1/6 flex items-center justify-end px-4 bg-transparent hover:bg-black/30 transition-colors disabled:opacity-0 disabled:cursor-not-allowed z-20"
        >
          <span className="text-white/30 hover:text-white text-4xl">‹</span>
        </button>
        {currentPage && (
          <LazyImage
            className="h-full"
            minHeight="200px"
            src={currentPage.url}
            alt={`Page ${currentPage.pageNumber}`}
          />
        )}

        <button
          onClick={handlePrevPage}
          disabled={currentPageIndex === 0}
          className="absolute right-0 top-0 bottom-0 w-1/6 flex items-center justify-start px-4 bg-transparent hover:bg-black/30 transition-colors disabled:opacity-0 disabled:cursor-not-allowed z-20"
        >
          <span className="text-white/30 hover:text-white text-4xl">›</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl w-full flex flex-col gap-0">
      {imageMedia.map((p) => (
        <LazyImage
          key={p.id}
          className="w-full"
          minHeight="400px"
          src={p.url}
          alt={`Page ${p.pageNumber}`}
        />
      ))}
    </div>
  );
}
