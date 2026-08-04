import { useState } from "react";
import type { useChapter } from "../../hooks/useChapter";
import type { useChaptersBySeries } from "../../hooks/useChaptersBySeries";
import type { ViewMode } from "../../hooks/useConfig";
import { Link } from "react-router";
import { EpubReader } from "./EpubReader";
import { LazyImage } from "../common/LazyImage";

function ChapterReader(props: {
  chapter: ReturnType<typeof useChapter>["chapter"];
  prevChapter:
    | ReturnType<typeof useChaptersBySeries>["chapters"][number]
    | null;
  nextChapter:
    | ReturnType<typeof useChaptersBySeries>["chapters"][number]
    | null;
  isAuthenticated: boolean;
  readChapterIds: Set<string>;
  markAsRead: (id: string, read: boolean) => void;
  markAsUnread: (id: string) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}) {
  const {
    chapter,
    prevChapter,
    nextChapter,
    isAuthenticated,
    readChapterIds,
    markAsRead,
    markAsUnread,
    viewMode,
    setViewMode,
  } = props;

  const [showSettings, setShowSettings] = useState(false);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const hasEpub = chapter?.media?.some((m) => m.type === "EPUB");
  const epubMedia = chapter?.media?.find((m) => m.type === "EPUB");
  const imageMedia = chapter?.media?.filter((m) => m.type === "IMAGE") ?? [];
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

  return (
    <>
      <div className="fixed top-0 left-0 right-0 h-14 z-40 bg-stone-950/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-4">
            <Link
              to={`/serie/${chapter?.series?.id}`}
              className="flex items-center gap-1 text-sm text-medium-gray hover:text-white transition-colors"
            >
              <span className="text-lg">←</span>
              Back to Series
            </Link>
            <div className="h-4 w-px bg-stone-700"></div>
            <h1 className="text-sm font-semibold text-white tracking-wide">
              {chapter?.series?.title}
            </h1>
            <span className="text-xs text-dim-gray">-</span>
            <span className="text-xs text-white">
              Chapter {chapter?.number}: {chapter?.title}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {!hasEpub && viewMode === "page-by-page" && (
                <>
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPageIndex === 0}
                    className="p-1 text-medium-gray hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <span className="text-lg">‹</span>
                  </button>
                  <span className="text-xs text-dim-gray">
                    {currentPageIndex + 1} / {totalPages}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPageIndex >= totalPages - 1}
                    className="p-1 text-medium-gray hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <span className="text-lg">›</span>
                  </button>
                </>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-1 text-medium-gray hover:text-white transition-colors"
              >
                <span className="text-lg">☰</span>
              </button>

              {showSettings && (
                <div className="absolute right-0 top-8 bg-stone-900 border border-border shadow-xl p-4 w-48 text-stone-300">
                  <div className="text-[10px] uppercase tracking-widest font-bold text-dim-gray mb-3">
                    View Mode
                  </div>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setViewMode("cascade");
                        setCurrentPageIndex(0);
                        setShowSettings(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded transition-all ${viewMode === "cascade" ? "bg-primary/10 border border-primary" : "hover:bg-surface"}`}
                    >
                      <span className="text-xs">Cascade</span>
                      {viewMode === "cascade" && (
                        <span className="w-2 h-2 rounded-full bg-primary"></span>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setViewMode("page-by-page");
                        setCurrentPageIndex(0);
                        setShowSettings(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded transition-all ${viewMode === "page-by-page" ? "bg-primary/10 border border-primary" : "hover:bg-surface"}`}
                    >
                      <span className="text-xs">Page-by-Page</span>
                      {viewMode === "page-by-page" && (
                        <span className="w-2 h-2 rounded-full bg-primary"></span>
                      )}
                    </button>
                  </div>
                  {viewMode === "page-by-page" && (
                    <div className="mt-4 pt-3 border-t border-border">
                      <p className="text-[10px] text-dim-gray mb-2">
                        Click sides to change page
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <main className="w-full h-full mt-14 bg-neutral-900 flex flex-col items-center">
        {hasEpub && epubMedia ? (
          <EpubReader url={epubMedia.url} />
        ) : viewMode === "page-by-page" ? (
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
        ) : (
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
        )}

        <div className="w-full flex flex-col gap-2 items-center justify-center pt-4 pb-2">
          <div className="flex gap-4 justify-between items-center">
            {prevChapter ? (
              <Link
                to={`/chapter/${prevChapter.id}`}
                className="px-4 py-2 bg-surface text-foreground rounded hover:bg-stone-800 transition-colors"
              >
                ← Previous Chapter
              </Link>
            ) : (
              <span className="px-4 py-2 text-dim-gray">
                ← Previous Chapter
              </span>
            )}

            {isAuthenticated && chapter?.id && (
              <button
                onClick={() => {
                  if (readChapterIds.has(chapter.id!)) {
                    markAsUnread(chapter.id!);
                  } else {
                    markAsRead(chapter.id!, true);
                  }
                }}
                className={`px-4 py-2 rounded transition-all ${
                  readChapterIds.has(chapter.id!)
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "bg-surface text-foreground hover:bg-stone-800"
                }`}
              >
                {readChapterIds.has(chapter.id!) ? "Read ✓" : "Mark as Read"}
              </button>
            )}

            {nextChapter ? (
              <Link
                to={`/chapter/${nextChapter.id}`}
                className="px-4 py-2 bg-surface text-foreground rounded hover:bg-stone-800 transition-colors"
              >
                Next Chapter →
              </Link>
            ) : (
              <span className="px-4 py-2 text-dim-gray">Next Chapter →</span>
            )}
          </div>

          <Link
            to={`/serie/${chapter?.series?.id}`}
            className="px-4 py-2 bg-surface text-foreground rounded hover:bg-stone-800 transition-colors"
          >
            Serie
          </Link>
        </div>
      </main>
    </>
  );
}

export { ChapterReader };
