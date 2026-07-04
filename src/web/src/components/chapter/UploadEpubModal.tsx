import { useState, useRef } from "react";
import { useUploadEpub } from "../../hooks/useUploadEpub";

interface UploadEpubModalProps {
  chapterId: string;
  onClose: () => void;
  onUploaded: () => void;
}

function UploadEpubModal({
  chapterId,
  onClose,
  onUploaded,
}: UploadEpubModalProps) {
  const { uploadEpub, isLoading: isUploading, error: uploadError } =
    useUploadEpub(chapterId);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    try {
      await uploadEpub(selectedFile);
      onUploaded();
      onClose();
    } catch {
      // Error handled in hook
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-stone-900 border border-border rounded-xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">
            Upload EPUB
          </h3>
          <button
            onClick={onClose}
            className="text-dim-gray hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all border-border hover:border-primary/50"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".epub"
              onChange={handleFileInput}
              className="hidden"
            />
            <div className="space-y-2">
              <span className="text-4xl text-dim-gray">📚</span>
              <p className="text-sm text-medium-gray">
                {selectedFile
                  ? selectedFile.name
                  : "Click to select an EPUB file"}
              </p>
              <p className="text-xs text-dim-gray">EPUB format, max 100MB</p>
            </div>
          </div>

          {selectedFile && (
            <div className="text-xs text-dim-gray">
              <p>Size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
          )}

          {uploadError && (
            <p className="text-danger text-sm">Error: {uploadError}</p>
          )}
        </div>

        <div className="px-6 py-4 border-t border-border flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-medium-gray text-sm hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={isUploading || !selectedFile}
            className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded hover:brightness-110 transition-all disabled:opacity-50"
          >
            {isUploading ? "Uploading..." : "Upload EPUB"}
          </button>
        </div>
      </div>
    </div>
  );
}

export { UploadEpubModal };
