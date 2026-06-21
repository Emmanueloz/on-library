import { useState } from "react";

interface ImageItem {
  id: string;
  url: string;
  label: string;
  pageNumber?: number;
}

interface ImageGridProps {
  mode: "page" | "modal";
  items: ImageItem[];
  onRemove?: (id: string) => void;
  onConfirmDelete?: (ids: string[]) => void;
  isDeleting?: boolean;
}

function ImageGrid({
  mode,
  items,
  onRemove,
  onConfirmDelete,
  isDeleting,
}: ImageGridProps) {
  const [pendingDelete, setPendingDelete] = useState<Set<string>>(new Set());

  const handleToggleMark = (id: string) => {
    setPendingDelete((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleConfirmDelete = () => {
    const ids = Array.from(pendingDelete);
    setPendingDelete(new Set());
    onConfirmDelete?.(ids);
  };

  const handleRemove = (id: string) => {
    onRemove?.(id);
  };

  const emptyState = mode === "page" ? (
    <div className="col-span-full flex flex-col items-center justify-center py-12 border-2 border-dashed border-border rounded-xl">
      <span className="text-4xl text-dim-gray mb-2">📄</span>
      <p className="text-sm text-dim-gray">No pages uploaded yet</p>
      <p className="text-xs text-dim-gray mt-1">
        Click &quot;Upload Images&quot; to add pages
      </p>
    </div>
  ) : (
    <div className="col-span-full flex flex-col items-center justify-center py-8 border-2 border-dashed border-border rounded-xl">
      <span className="text-4xl text-dim-gray mb-2">+</span>
      <p className="text-sm text-dim-gray">Drop images here or click to select</p>
      <p className="text-xs text-dim-gray mt-1">PNG, JPG, WEBP</p>
    </div>
  );

  return (
    <div className="space-y-3">
      {mode === "page" && pendingDelete.size > 0 && (
        <div className="flex items-center justify-between bg-danger/10 border border-danger/20 rounded-lg px-4 py-2">
          <span className="text-xs text-danger">
            {pendingDelete.size} image{pendingDelete.size > 1 ? "s" : ""} marked
            for deletion
          </span>
          <button
            onClick={handleConfirmDelete}
            disabled={isDeleting}
            className="px-3 py-1 bg-danger text-white text-xs font-semibold rounded hover:brightness-110 transition-all disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Confirm Delete"}
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {items.length === 0 && emptyState}

        {items.map((item) => {
          const isPending = pendingDelete.has(item.id);

          return (
            <div
              key={item.id}
              className={`relative group rounded-lg overflow-hidden border transition-all ${
                isPending
                  ? "border-danger/50 opacity-60"
                  : "border-border hover:border-primary/30"
              }`}
            >
              <div className="aspect-3/4 bg-background">
                <img
                  src={item.url}
                  alt={item.label}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-2 bg-surface">
                <p className="text-[11px] text-foreground truncate font-medium">
                  {item.label}
                </p>
                {item.pageNumber !== undefined && (
                  <p className="text-[10px] text-dim-gray">
                    Page {item.pageNumber}
                  </p>
                )}
              </div>

              {isPending && (
                <div className="absolute inset-0 bg-danger/10 pointer-events-none" />
              )}

              {mode === "page" ? (
                <button
                  onClick={() => handleToggleMark(item.id)}
                  className={`absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all ${
                    isPending
                      ? "bg-danger text-white"
                      : "bg-black/50 text-white/70 opacity-0 group-hover:opacity-100 hover:bg-danger"
                  }`}
                >
                  {isPending ? "↩" : "✕"}
                </button>
              ) : (
                <button
                  onClick={() => handleRemove(item.id)}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/50 text-white/70 opacity-0 group-hover:opacity-100 hover:bg-danger flex items-center justify-center text-xs transition-all"
                >
                  ✕
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { ImageGrid };
export type { ImageItem };
