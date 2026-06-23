import { useState, useRef } from "react";
import { useImportChapters } from "../../hooks/useImportChapters";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_EXTENSIONS = [".csv", ".xlsx", ".xls"];

interface ImportChaptersModalProps {
  idSeries: string;
  onClose: () => void;
  onImported: () => void;
}

function ImportChaptersModal({
  idSeries,
  onClose,
  onImported,
}: ImportChaptersModalProps) {
  const { importChapters, isLoading, error } = useImportChapters(idSeries);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLocalError(null);

    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      setLocalError("Invalid file type. Use CSV, XLSX, or XLS");
      setSelectedFile(null);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setLocalError("File too large. Maximum size is 10MB");
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleImport = async () => {
    if (!selectedFile) return;
    try {
      await importChapters(selectedFile);
      onImported();
      onClose();
    } catch {
      // Error is captured by the hook
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setLocalError(null);
    onClose();
  };

  const displayError = localError || error;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-stone-900 border border-border rounded-xl p-6 w-full max-w-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            Import Chapters
          </h3>
          <button
            onClick={handleClose}
            className="text-dim-gray hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="mb-4 p-3 bg-background border border-border rounded-lg">
          <p className="text-xs font-medium text-medium-gray mb-2">
            File format:
          </p>
          <pre className="text-xs text-dim-gray font-mono">
{`title,number
Chapter 1,1
Chapter 2,2`}
          </pre>
        </div>

        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 transition-colors mb-4"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileSelect}
            className="hidden"
          />
          {selectedFile ? (
            <p className="text-sm text-foreground">{selectedFile.name}</p>
          ) : (
            <div className="space-y-1">
              <span className="text-3xl text-dim-gray">+</span>
              <p className="text-sm text-medium-gray">
                Click to select a file
              </p>
              <p className="text-xs text-dim-gray">CSV, XLSX, XLS (max 10MB)</p>
            </div>
          )}
        </div>

        {displayError && (
          <p className="text-danger text-sm mb-4">{displayError}</p>
        )}

        <div className="flex justify-end gap-2">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-medium-gray text-sm hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={!selectedFile || isLoading}
            className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded hover:brightness-110 transition-all disabled:opacity-50"
          >
            {isLoading ? "Importing..." : "Import"}
          </button>
        </div>
      </div>
    </div>
  );
}

export { ImportChaptersModal };
