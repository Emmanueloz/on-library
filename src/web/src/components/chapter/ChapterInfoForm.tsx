import { useState } from "react";
import { useUpdateChapter } from "../../hooks/useUpdateChapter";
import type { IChapter } from "@on-library/shared";

interface ChapterInfoFormProps {
  chapter: IChapter;
  onUpdated: () => void;
}

function ChapterInfoForm({ chapter, onUpdated }: ChapterInfoFormProps) {
  const { updateChapter, isLoading: isUpdating } = useUpdateChapter();

  const [title, setTitle] = useState(chapter.title);
  const [number, setNumber] = useState(chapter.number);

  const hasChanges = title !== chapter.title || number !== chapter.number;

  const handleUpdate = async () => {
    if (!chapter.id || !title.trim()) return;
    try {
      await updateChapter(chapter.id, { title: title.trim(), number });
      onUpdated();
    } catch {
      // Error handled in hook
    }
  };

  return (
    <section className="bg-surface border border-[var(--color-border)/0.06] rounded-xl p-6">
      <div className="flex items-center gap-2 text-primary border-b border-border pb-2 mb-4">
        <span className="text-lg">✎</span>
        <h3 className="font-semibold uppercase text-xs tracking-wider">
          Chapter Information
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-1">
          <label className="text-xs font-medium text-medium-gray block">
            Chapter Number
          </label>
          <input
            type="number"
            step="0.1"
            value={number}
            onChange={(e) => setNumber(parseFloat(e.target.value) || 0)}
            className="w-full bg-background border border-[var(--color-border)/0.08] rounded px-3 py-2 text-sm focus:border-primary/50 focus:outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-medium-gray block">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-background border border-[var(--color-border)/0.08] rounded px-3 py-2 text-sm focus:border-primary/50 focus:outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-medium-gray block">
            Serie
          </label>
          <p className="text-sm text-foreground py-2">
            {chapter.series?.title || "—"}
          </p>
        </div>
      </div>

      <div className="mt-4">
        <button
          onClick={handleUpdate}
          disabled={isUpdating || !hasChanges || !title.trim()}
          className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded hover:brightness-110 transition-all disabled:opacity-50"
        >
          {isUpdating ? "Updating..." : "Update Info"}
        </button>
      </div>
    </section>
  );
}

export { ChapterInfoForm };
