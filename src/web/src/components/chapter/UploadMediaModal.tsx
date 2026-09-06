import { useState, useEffect, useRef, useCallback } from "react";
import { detectMediaType, MediaType } from "@on-library/shared";
import { useUploadMedia } from "../../hooks/useUploadMedia";
import { ImageGrid, type ImageItem } from "./ImageGrid";

interface ImageEntry {
  file: File;
  previewUrl: string;
}

interface UploadMediaModalProps {
  chapterId: string;
  onClose: () => void;
  onUploaded: () => void;
}

const ACCEPT_TYPES =
  "image/png,image/jpeg,image/jpg,image/webp,.epub,application/epub+zip,.pdf,application/pdf";

function UploadMediaModal({
  chapterId,
  onClose,
  onUploaded,
}: UploadMediaModalProps) {
  const { uploadMedia, isLoading: isUploading, error: uploadError } =
    useUploadMedia(chapterId);
  const [imageEntries, setImageEntries] = useState<ImageEntry[]>([]);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const imageEntriesRef = useRef(imageEntries);

  useEffect(() => {
    imageEntriesRef.current = imageEntries;
  });

  useEffect(() => {
    return () => {
      for (const entry of imageEntriesRef.current) {
        URL.revokeObjectURL(entry.previewUrl);
      }
    };
  }, []);

  const addFiles = useCallback(
    async (newFiles: File[]) => {
      const images: File[] = [];
      const documents: File[] = [];
      let rejected = 0;

      for (const file of newFiles) {
        const type = detectMediaType(file.type, file.name);
        if (type === MediaType.IMAGE) {
          images.push(file);
        } else if (type === MediaType.EPUB || type === MediaType.PDF) {
          documents.push(file);
        } else {
          rejected++;
        }
      }

      if (images.length > 0) {
        // Images take precedence: only one file type per upload
        if (documentFile) {
          setDocumentFile(null);
          setAlertMessage("Document removed: only one file type per upload");
        } else if (documents.length > 0) {
          setAlertMessage("Document ignored: only one file type per upload");
        } else {
          setAlertMessage(null);
        }

        setIsProcessing(true);

        const BATCH_SIZE = 20;
        for (let i = 0; i < images.length; i += BATCH_SIZE) {
          const batch = images.slice(i, i + BATCH_SIZE);
          const newEntries = batch.map((file) => ({
            file,
            previewUrl: URL.createObjectURL(file),
          }));
          setImageEntries((prev) => [...prev, ...newEntries]);

          if (i + BATCH_SIZE < images.length) {
            await new Promise((r) => setTimeout(r, 0));
          }
        }

        setIsProcessing(false);
        return;
      }

      if (documents.length > 0) {
        if (imageEntriesRef.current.length > 0) {
          setAlertMessage("Document ignored: only one file type per upload");
        } else if (documentFile) {
          setAlertMessage("Only one document file is allowed (EPUB or PDF)");
        } else {
          setDocumentFile(documents[0] ?? null);
          setAlertMessage(
            documents.length > 1
              ? "Only one document file is allowed (EPUB or PDF)"
              : null,
          );
        }
        return;
      }

      if (rejected > 0) {
        setAlertMessage(
          "Unsupported file type. Allowed: images (png, jpg, jpeg, webp), EPUB or PDF",
        );
      }
    },
    [documentFile],
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(Array.from(e.target.files));
    }
    e.target.value = "";
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

  const handleRemoveImage = (id: string) => {
    setImageEntries((prev) => {
      const entry = prev.find((e) => e.file.name === id);
      if (entry) {
        URL.revokeObjectURL(entry.previewUrl);
      }
      return prev.filter((e) => e.file.name !== id);
    });
  };

  const handleRemoveDocument = () => {
    setDocumentFile(null);
    setAlertMessage(null);
  };

  const handleUpload = async () => {
    const files = documentFile
      ? [documentFile]
      : imageEntries.map((entry) => entry.file);
    if (files.length === 0) return;
    try {
      await uploadMedia(files);
      onUploaded();
      onClose();
    } catch {
      // Error handled in hook
    }
  };

  const gridItems: ImageItem[] = imageEntries.map((entry) => ({
    id: entry.file.name,
    url: entry.previewUrl,
    label: entry.file.name,
  }));

  const documentType = documentFile
    ? detectMediaType(documentFile.type, documentFile.name)
    : null;

  const selectedCount = documentFile ? 1 : imageEntries.length;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-stone-900 border border-border rounded-xl w-full max-w-4xl max-h-full overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">
            Upload Media
          </h3>
          <button
            onClick={onClose}
            className="text-dim-gray hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {!isProcessing && (
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
                accept={ACCEPT_TYPES}
                onChange={handleFileInput}
                className="hidden"
              />
              <div className="space-y-2">
                <span className="text-4xl text-dim-gray">+</span>
                <p className="text-sm text-medium-gray">
                  {isDragOver
                    ? "Drop files here"
                    : "Click to select or drag files here"}
                </p>
                <p className="text-xs text-dim-gray">
                  PNG, JPG, WEBP or a single EPUB/PDF
                </p>
              </div>
            </div>
          )}

          {isProcessing && gridItems.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-medium-gray mt-3">
                Processing images...
              </p>
            </div>
          )}

          {alertMessage && (
            <p className="text-xs text-medium-gray bg-surface border border-border rounded px-3 py-2">
              {alertMessage}
            </p>
          )}

          {documentFile && (
            <div className="flex items-center justify-between bg-surface border border-border rounded-xl px-4 py-3">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-2xl">
                  {documentType === MediaType.PDF ? "📄" : "📚"}
                </span>
                <div className="min-w-0">
                  <p className="text-sm text-foreground truncate">
                    {documentFile.name}
                  </p>
                  <p className="text-xs text-dim-gray">
                    {(documentFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={handleRemoveDocument}
                className="text-dim-gray hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
          )}

          {gridItems.length > 0 && (
            <ImageGrid
              mode="modal"
              items={gridItems}
              onRemove={handleRemoveImage}
            />
          )}

          {uploadError && (
            <p className="text-danger text-sm">Error: {uploadError}</p>
          )}
        </div>

        <div className="px-6 py-4 border-t border-border flex items-center justify-between">
          <p className="text-xs text-dim-gray">
            {documentFile
              ? `1 ${documentType === MediaType.PDF ? "PDF" : "EPUB"} selected`
              : `${imageEntries.length} image${imageEntries.length !== 1 ? "s" : ""} selected`}
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
              disabled={isUploading || selectedCount === 0}
              className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded hover:brightness-110 transition-all disabled:opacity-50"
            >
              {isUploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { UploadMediaModal };
