import { useState, useEffect, useRef, useCallback } from "react";
import { useUploadPages } from "../../hooks/useUploadPages";
import { ImageGrid, type ImageItem } from "./ImageGrid";

interface FileEntry {
  file: File;
  previewUrl: string;
}

interface UploadImagesModalProps {
  chapterId: string;
  onClose: () => void;
  onUploaded: () => void;
}

function UploadImagesModal({
  chapterId,
  onClose,
  onUploaded,
}: UploadImagesModalProps) {
  const { uploadPages, isLoading: isUploading, error: uploadError } =
    useUploadPages(chapterId);
  const [entries, setEntries] = useState<FileEntry[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const entriesRef = useRef(entries);

  useEffect(() => {
    entriesRef.current = entries;
  });

  useEffect(() => {
    return () => {
      for (const entry of entriesRef.current) {
        URL.revokeObjectURL(entry.previewUrl);
      }
    };
  }, []);

  const addFiles = useCallback((newFiles: File[]) => {
    const imageTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    const filtered = newFiles.filter((f) => imageTypes.includes(f.type));
    const newEntries = filtered.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setEntries((prev) => [...prev, ...newEntries]);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(Array.from(e.target.files));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleRemove = (id: string) => {
    setEntries((prev) => {
      const entry = prev.find((e) => e.file.name === id);
      if (entry) {
        URL.revokeObjectURL(entry.previewUrl);
      }
      return prev.filter((e) => e.file.name !== id);
    });
  };

  const handleUpload = async () => {
    if (entries.length === 0) return;
    try {
      await uploadPages(entries.map((e) => e.file));
      onUploaded();
      onClose();
    } catch {
      // Error handled in hook
    }
  };

  const gridItems: ImageItem[] = entries.map((entry) => ({
    id: entry.file.name,
    url: entry.previewUrl,
    label: entry.file.name,
  }));

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-stone-900 border border-border rounded-xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">
            Upload Images
          </h3>
          <button
            onClick={onClose}
            className="text-dim-gray hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div
            ref={dropRef}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              isDragOver
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={handleFileInput}
              className="hidden"
            />
            <div className="space-y-2">
              <span className="text-4xl text-dim-gray">+</span>
              <p className="text-sm text-medium-gray">
                {isDragOver
                  ? "Drop images here"
                  : "Click to select or drag images here"}
              </p>
              <p className="text-xs text-dim-gray">PNG, JPG, WEBP</p>
            </div>
          </div>

          {gridItems.length > 0 && (
            <ImageGrid
              mode="modal"
              items={gridItems}
              onRemove={handleRemove}
            />
          )}

          {uploadError && (
            <p className="text-danger text-sm">Error: {uploadError}</p>
          )}
        </div>

        <div className="px-6 py-4 border-t border-border flex items-center justify-between">
          <p className="text-xs text-dim-gray">
            {entries.length} image{entries.length !== 1 ? "s" : ""} selected
          </p>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-medium-gray text-sm hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={isUploading || entries.length === 0}
              className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded hover:brightness-110 transition-all disabled:opacity-50"
            >
              {isUploading ? "Uploading..." : "Upload Images"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { UploadImagesModal };
