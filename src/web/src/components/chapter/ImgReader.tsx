import { useEffect, useRef, useState } from "react";
import type { ViewMode } from "../../hooks/useConfig";
import { LazyImage } from "../common/LazyImage";
import type { IMedia } from "@on-library/shared";
import type { BookmarkReaderProps } from "../../interfaces/bookmarkReaderProps.interface";
import { BookmarkButton } from "./bookmark/BookmarkButton";

interface ImgReaderProps extends BookmarkReaderProps {
  viewMode: ViewMode;
  imageMedia: IMedia[];
}

export function ImgReader({
  viewMode,
  imageMedia,
  canBookmark = false,
  bookmarkedPages,
  onToggleBookmark,
  jumpTarget,
}: ImgReaderProps) {
  const [currentPageIndex, setCurrentPageIndex] = useState(() => {
    if (!jumpTarget) return 0;
    const index = imageMedia.findIndex(
      (m) => m.pageNumber === jumpTarget.page,
    );
    return index >= 0 ? index : 0;
  });
  const totalPages = imageMedia.length;

  const currentPage = imageMedia[currentPageIndex];

  const [lastJumpTarget, setLastJumpTarget] = useState(jumpTarget);
  if (jumpTarget !== lastJumpTarget) {
    setLastJumpTarget(jumpTarget);
    if (jumpTarget && viewMode === "page-by-page") {
      const index = imageMedia.findIndex(
        (m) => m.pageNumber === jumpTarget.page,
      );
      if (index >= 0) {
        setCurrentPageIndex(index);
      }
    }
  }

  const cascadeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!jumpTarget || viewMode === "page-by-page") return;

    const container = cascadeRef.current;
    const target = document.getElementById(`bookmark-page-${jumpTarget.page}`);
    if (!container || !target) return;

    target.scrollIntoView({ behavior: "smooth", block: "start" });

    // Placeholders are shorter than the final images, so as images near the
    // target finish loading the layout shifts. Keep correcting the scroll
    // position until it stabilizes or the user scrolls manually.
    const correct = () => {
      document
        .getElementById(`bookmark-page-${jumpTarget.page}`)
        ?.scrollIntoView({ behavior: "instant", block: "start" });
    };
    const observer = new ResizeObserver(correct);
    observer.observe(container);

    const stop = () => observer.disconnect();
    window.addEventListener("wheel", stop, { once: true });
    window.addEventListener("touchstart", stop, { once: true });
    const timeout = setTimeout(stop, 4000);

    return () => {
      stop();
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchstart", stop);
      clearTimeout(timeout);
    };
  }, [jumpTarget, viewMode]);

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
          <div className="relative group h-full">
            {canBookmark && onToggleBookmark && (
              <BookmarkButton
                bookmarked={bookmarkedPages?.has(currentPage.pageNumber) ?? false}
                onToggle={() => onToggleBookmark(currentPage.pageNumber)}
              />
            )}
            <LazyImage
              className="h-full"
              minHeight="200px"
              src={currentPage.url}
              alt={`Page ${currentPage.pageNumber}`}
            />
          </div>
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
    <div ref={cascadeRef} className="max-w-3xl w-full flex flex-col gap-0">
      {imageMedia.map((p) => (
        <div
          key={p.id}
          id={`bookmark-page-${p.pageNumber}`}
          className="relative group"
        >
          {canBookmark && onToggleBookmark && (
            <BookmarkButton
              bookmarked={bookmarkedPages?.has(p.pageNumber) ?? false}
              onToggle={() => onToggleBookmark(p.pageNumber)}
            />
          )}
          <LazyImage
            className="w-full"
            minHeight="400px"
            src={p.url}
            alt={`Page ${p.pageNumber}`}
          />
        </div>
      ))}
    </div>
  );
}
