import { useState } from "react";
import type { IBookmark } from "@on-library/shared";

interface BookmarkPanelProps {
  bookmarks: IBookmark[];
  onGoTo: (page: number) => void;
  onRemove: (id: string) => void;
  onRemoveAll: () => void;
}

function BookmarkPanel({
  bookmarks,
  onGoTo,
  onRemove,
  onRemoveAll,
}: BookmarkPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2">
      {isOpen && (
        <div className="w-64 bg-stone-900 border border-border shadow-xl rounded">
          <div className="flex items-center justify-between px-3 py-2 border-b border-border">
            <span className="text-[10px] uppercase tracking-widest font-bold text-dim-gray">
              Bookmarks
            </span>
            {bookmarks.length > 0 && (
              <button
                onClick={onRemoveAll}
                className="text-xs text-danger hover:text-white transition-colors"
              >
                Delete all
              </button>
            )}
          </div>

          <div className="max-h-64 overflow-y-auto">
            {bookmarks.length === 0 ? (
              <p className="px-3 py-4 text-xs text-dim-gray text-center">
                No bookmarks yet
              </p>
            ) : (
              bookmarks.map((bookmark) => (
                <div
                  key={bookmark.id}
                  className="flex items-center justify-between px-3 py-2 hover:bg-surface transition-colors"
                >
                  <button
                    onClick={() => onGoTo(bookmark.page)}
                    className="flex-1 text-left"
                  >
                    <span className="text-xs text-white">
                      Page {bookmark.page}
                    </span>
                    <span className="block text-[10px] text-dim-gray">
                      {bookmark.createdAt
                        ? new Date(bookmark.createdAt).toLocaleString()
                        : ""}
                    </span>
                  </button>
                  <button
                    onClick={() => bookmark.id && onRemove(bookmark.id)}
                    aria-label="Delete bookmark"
                    className="p-1 text-medium-gray hover:text-danger transition-colors"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle bookmarks panel"
        className="flex items-center gap-2 px-3 py-2 rounded bg-stone-900 border border-border text-xs text-white shadow-xl hover:bg-surface transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
          />
        </svg>
        {bookmarks.length}
      </button>
    </div>
  );
}

export { BookmarkPanel };
