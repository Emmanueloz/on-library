import { useState } from "react";
import { useLibraries } from "../../hooks/useLibraries";
import type { ILibraries } from "@on-library/shared";

interface AddToLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  serieId: string;
  currentLibrary: ILibraries | null;
  onLibraryChange: () => void;
}

function AddToLibraryModal({
  isOpen,
  onClose,
  serieId,
  currentLibrary,
  onLibraryChange,
}: AddToLibraryModalProps) {
  const { libraries, addSerieToLibrary, removeSerieFromLibrary } = useLibraries();
  const [search, setSearch] = useState("");
  const [selectedLibraryId, setSelectedLibraryId] = useState<string | null>(
    currentLibrary?.id ?? null,
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredLibraries = libraries.filter((lib) =>
    lib.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleConfirm = async () => {
    if (!selectedLibraryId) return;

    setIsProcessing(true);
    setError(null);

    try {
      if (currentLibrary && selectedLibraryId !== currentLibrary.id) {
        await removeSerieFromLibrary(currentLibrary.id!, serieId);
      }

      if (selectedLibraryId !== currentLibrary?.id) {
        await addSerieToLibrary(selectedLibraryId, serieId);
      }

      onLibraryChange();
      onClose();
      setSelectedLibraryId(null);
      setSearch("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update library",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemove = async () => {
    if (!currentLibrary?.id) return;

    setIsProcessing(true);
    setError(null);

    try {
      await removeSerieFromLibrary(currentLibrary.id, serieId);
      onLibraryChange();
      onClose();
      setSelectedLibraryId(null);
      setSearch("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to remove from library",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface border border-[var(--color-border)/0.06] rounded-xl w-full max-w-md max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground tracking-[0.2px]">
            {currentLibrary ? "Manage Library" : "Add to Library"}
          </h3>
          <button
            onClick={onClose}
            className="text-dim-gray hover:text-foreground transition-opacity duration-200"
          >
            ✕
          </button>
        </div>

        <div className="p-4">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-dim-gray text-sm">
              🔍
            </span>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-background border border-[var(--color-border)/0.08] rounded-lg pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-dim-gray focus:border-[var(--color-accent-blue)/0.15] focus:outline-none transition-all duration-200"
              placeholder="Search libraries..."
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {currentLibrary && !search && (
            <div className="mb-3 p-3 bg-primary/10 border border-primary/20 rounded-lg">
              <p className="text-xs text-medium-gray mb-1">Currently in:</p>
              <p className="text-sm font-medium text-foreground">
                {currentLibrary.name}
              </p>
            </div>
          )}

          {filteredLibraries.length === 0 ? (
            <p className="text-center text-dim-gray py-8 text-sm">
              {search ? "No libraries found" : "You have no libraries yet"}
            </p>
          ) : (
            <div className="space-y-2">
              {filteredLibraries.map((lib) => (
                <label
                  key={lib.id}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedLibraryId === lib.id
                      ? "bg-[var(--color-accent-blue)/0.15] border border-[var(--color-accent-blue)/0.3]"
                      : "bg-background border border-[var(--color-border)/0.06] hover:border-[var(--color-border)/0.12]"
                  }`}
                >
                  <input
                    type="radio"
                    name="library"
                    value={lib.id}
                    checked={selectedLibraryId === lib.id}
                    onChange={() => setSelectedLibraryId(lib.id ?? null)}
                    className="sr-only"
                  />
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                      selectedLibraryId === lib.id
                        ? "border-accent-blue bg-accent-blue"
                        : "border-dim-gray"
                    }`}
                  >
                    {selectedLibraryId === lib.id && (
                      <div className="w-2 h-2 rounded-full bg-background" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {lib.name}
                    </p>
                    <p className="text-xs text-dim-gray">
                      {lib.seriesCount ?? 0} series
                    </p>
                  </div>
                  {lib.isPublic && (
                    <span className="text-[10px] font-medium text-dim-gray bg-background px-2 py-0.5 rounded">
                      Public
                    </span>
                  )}
                </label>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div className="px-4 pb-2">
            <p className="text-primary text-sm">{error}</p>
          </div>
        )}

        <div className="p-4 border-t border-border flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-sm font-semibold text-foreground border border-[var(--color-border)/0.1] rounded-lg hover:opacity-60 transition-opacity duration-200"
          >
            Cancel
          </button>
          {currentLibrary && selectedLibraryId === currentLibrary.id && (
            <button
              onClick={handleRemove}
              disabled={isProcessing}
              className="flex-1 px-4 py-2 text-sm font-semibold bg-primary/20 text-primary border border-primary/30 rounded-lg hover:bg-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? "Removing..." : "Remove"}
            </button>
          )}
          {(!currentLibrary || selectedLibraryId !== currentLibrary.id) && (
            <button
              onClick={handleConfirm}
              disabled={!selectedLibraryId || isProcessing}
              className="flex-1 px-4 py-2 text-sm font-semibold bg-primary text-white rounded-lg hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing
                ? "Processing..."
                : currentLibrary
                  ? "Move"
                  : "Add"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export { AddToLibraryModal };