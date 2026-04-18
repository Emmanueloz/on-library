import { useState } from "react";
import { useParams, Link } from "react-router";
import { useChapter } from "../hooks/useChapter";
import { useChaptersBySeries } from "../hooks/useChaptersBySeries";

type ViewMode = "cascade" | "page-by-page";

function Chapter() {
  const { id } = useParams();
  const { chapter, errorChapter, isLoading } = useChapter({ id });
  const { chapters } = useChaptersBySeries(chapter?.series?.id ? String(chapter.series.id) : "");
  
  const [viewMode, setViewMode] = useState<ViewMode>("cascade");
  const [showSettings, setShowSettings] = useState(false);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const currentIndex = chapters.findIndex(c => c.id === id);
  const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;
  
  const totalPages = chapter?.pages?.length || 0;
  const currentPage = chapter?.pages?.[currentPageIndex];

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-medium-gray">loading...</p>
      </div>
    );
  }

  return (
    <>
      {errorChapter && <p className="text-primary">{errorChapter}</p>}

      <div className="fixed top-0 left-0 right-0 z-40 bg-stone-950/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-4">
            <Link to={`/serie/${chapter?.series?.id}`} className="flex items-center gap-1 text-sm text-medium-gray hover:text-white transition-colors">
              <span className="text-lg">←</span>
              Back to Series
            </Link>
            <div className="h-4 w-px bg-stone-700"></div>
            <h1 className="text-sm font-semibold text-white tracking-wide">{chapter?.series?.title}</h1>
            <span className="text-xs text-dim-gray">-</span>
            <span className="text-xs text-white">Chapter {chapter?.number}: {chapter?.title}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <button 
                onClick={handlePrevPage}
                disabled={!prevChapter || currentPageIndex === 0}
                className="p-1 text-medium-gray hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span className="text-lg">‹</span>
              </button>
              <span className="text-xs text-dim-gray">{currentPageIndex + 1} / {totalPages}</span>
              <button 
                onClick={handleNextPage}
                disabled={!nextChapter || currentPageIndex >= totalPages - 1}
                className="p-1 text-medium-gray hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span className="text-lg">›</span>
              </button>
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
                  <div className="text-[10px] uppercase tracking-widest font-bold text-dim-gray mb-3">View Mode</div>
                  <div className="space-y-2">
                    <button 
                      onClick={() => { setViewMode("cascade"); setCurrentPageIndex(0); }}
                      className={`w-full flex items-center justify-between p-2 rounded transition-all ${viewMode === "cascade" ? "bg-primary/10 border border-primary" : "hover:bg-surface"}`}
                    >
                      <span className="text-xs">Cascade</span>
                      {viewMode === "cascade" && <span className="w-2 h-2 rounded-full bg-primary"></span>}
                    </button>
                    <button 
                      onClick={() => { setViewMode("page-by-page"); setCurrentPageIndex(0); }}
                      className={`w-full flex items-center justify-between p-2 rounded transition-all ${viewMode === "page-by-page" ? "bg-primary/10 border border-primary" : "hover:bg-surface"}`}
                    >
                      <span className="text-xs">Page-by-Page</span>
                      {viewMode === "page-by-page" && <span className="w-2 h-2 rounded-full bg-primary"></span>}
                    </button>
                  </div>
                  {viewMode === "page-by-page" && (
                    <div className="mt-4 pt-3 border-t border-border">
                      <p className="text-[10px] text-dim-gray mb-2">Click sides to change page</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <main className="pt-14 min-h-screen bg-neutral-900 flex flex-col items-center">
        {viewMode === "page-by-page" ? (
          <div className="relative w-full h-[calc(100vh-56px)] flex items-center justify-center">
            <button 
              onClick={handlePrevPage}
              disabled={currentPageIndex === 0}
              className="absolute left-0 top-0 bottom-0 w-1/4 flex items-center justify-start px-4 bg-transparent hover:bg-black/30 transition-colors disabled:opacity-0 disabled:cursor-not-allowed z-20"
            >
              <span className="text-white/30 hover:text-white text-4xl">‹</span>
            </button>
            
            {currentPage && (
              <img
                className="max-h-full max-w-full object-contain"
                src={currentPage.url}
                alt={`Page ${currentPage.pageNumber}`}
              />
            )}
            
            <button 
              onClick={handleNextPage}
              disabled={currentPageIndex >= totalPages - 1}
              className="absolute right-0 top-0 bottom-0 w-1/4 flex items-center justify-end px-4 bg-transparent hover:bg-black/30 transition-colors disabled:opacity-0 disabled:cursor-not-allowed z-20"
            >
              <span className="text-white/30 hover:text-white text-4xl">›</span>
            </button>
          </div>
        ) : (
          <div className="max-w-3xl w-full flex flex-col gap-0">
            {chapter?.pages?.map((p, index) => (
              <img
                key={p.id}
                className="w-full h-auto block"
                src={p.url}
                alt={`Page ${p.pageNumber}`}
                loading={index < 3 ? "eager" : "lazy"}
              />
            ))}
          </div>
        )}

        <div className="flex gap-4 justify-between py-10 items-center">
          {prevChapter ? (
            <Link to={`/chapter/${prevChapter.id}`} className="px-4 py-2 bg-surface text-foreground rounded hover:bg-stone-800 transition-colors">
              ← Previous Chapter
            </Link>
          ) : (
            <span className="px-4 py-2 text-dim-gray">← Previous Chapter</span>
          )}
          
          <Link to={`/serie/${chapter?.series?.id}`} className="px-4 py-2 text-medium-gray hover:text-white transition-colors">
            Serie
          </Link>
          
          {nextChapter ? (
            <Link to={`/chapter/${nextChapter.id}`} className="px-4 py-2 bg-surface text-foreground rounded hover:bg-stone-800 transition-colors">
              Next Chapter →
            </Link>
          ) : (
            <span className="px-4 py-2 text-dim-gray">Next Chapter →</span>
          )}
        </div>
      </main>
    </>
  );
}

export { Chapter };