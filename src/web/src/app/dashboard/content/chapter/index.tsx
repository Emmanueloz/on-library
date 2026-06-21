import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useChapterById } from "../../../../hooks/useChapterById";
import { useUploadPages } from "../../../../hooks/useUploadPages";

function EditChapter() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    chapter,
    isLoading: isLoadingChapter,
    refetch: refetchChapter,
  } = useChapterById(id);
  const {
    uploadPages,
    isLoading: isUploading,
    error: uploadError,
  } = useUploadPages(id || "");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(files);
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;
    try {
      const result = await uploadPages(selectedFiles);
      if (result) {
        setSelectedFiles([]);
        refetchChapter();
      }
    } catch {
      // Error handled in hook
    }
  };

  if (isLoadingChapter) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-medium-gray">loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="text-medium-gray hover:text-white transition-colors"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-semibold text-foreground">Edit Chapter</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <section className="bg-surface border border-[var(--color-border)/0.06] rounded-xl p-6">
            <div className="flex items-center gap-2 text-primary border-b border-border pb-2 mb-4">
              <span className="text-lg">✎</span>
              <h3 className="font-semibold uppercase text-xs tracking-wider">
                Chapter Information
              </h3>
            </div>

            {chapter && (
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-medium-gray block">
                    Chapter Number
                  </label>
                  <p className="text-foreground">{chapter.number}</p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-medium-gray block">
                    Title
                  </label>
                  <p className="text-foreground">{chapter.title}</p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-medium-gray block">
                    Serie
                  </label>
                  <p className="text-foreground">{chapter.series?.title}</p>
                </div>
              </div>
            )}
          </section>

          <section className="bg-surface border border-[var(--color-border)/0.06] rounded-xl p-6">
            <div className="flex items-center gap-2 text-primary border-b border-border pb-2 mb-4">
              <span className="text-lg">📤</span>
              <h3 className="font-semibold uppercase text-xs tracking-wider">
                Upload Pages
              </h3>
            </div>

            <div className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <input
                  type="file"
                  id="pages"
                  multiple
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="pages" className="cursor-pointer">
                  <div className="space-y-2">
                    <span className="text-4xl text-dim-gray">+</span>
                    <p className="text-sm text-medium-gray">
                      Click to select images
                    </p>
                    <p className="text-xs text-dim-gray">PNG, JPG, WEBP</p>
                  </div>
                </label>
              </div>

              {selectedFiles.length > 0 && (
                <div className="bg-background border border-border rounded-lg p-4 flex flex-col gap-2">
                  <p className="text-sm text-foreground">
                    Selected files ({selectedFiles.length})
                  </p>
                  <button
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="w-full px-3 py-2 bg-primary text-white text-sm font-semibold rounded hover:brightness-110 transition-all disabled:opacity-50"
                  >
                    {isUploading ? "Uploading..." : "Upload"}
                  </button>
                  <ul className="space-y-1">
                    {selectedFiles.map((file, index) => (
                      <li
                        key={index}
                        className="text-xs text-dim-gray truncate"
                      >
                        {file.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {uploadError && (
                <p className="text-primary text-sm">Error: {uploadError}</p>
              )}
            </div>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <section className="bg-surface border border-[var(--color-border)/0.06] rounded-xl p-6">
            <div className="flex items-center gap-2 text-primary border-b border-border pb-2 mb-4">
              <span className="text-lg">📄</span>
              <h3 className="font-semibold uppercase text-xs tracking-wider">
                Existing Pages
              </h3>
              <span className="text-xs text-dim-gray ml-auto">
                ({chapter?.pages?.length || 0})
              </span>
            </div>

            <div className="space-y-2">
              {chapter?.pages?.map((page) => (
                <div
                  key={page.id}
                  className="flex items-center gap-3 p-2 bg-background rounded"
                >
                  <img
                    src={page.url}
                    alt=""
                    className="w-12 h-16 object-cover rounded"
                  />
                  <div>
                    <p className="text-xs text-foreground">
                      Page {page.pageNumber}
                    </p>
                    <p className="text-[10px] text-dim-gray">
                      {page.type || "image"}
                    </p>
                  </div>
                </div>
              ))}
              {(!chapter?.pages || chapter.pages.length === 0) && (
                <p className="text-dim-gray text-sm text-center py-4">
                  No pages uploaded
                </p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export { EditChapter };
