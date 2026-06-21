import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useChapterById } from "../../../../hooks/useChapterById";
import { useDeletePage } from "../../../../hooks/useDeletePage";
import { ChapterInfoForm } from "../../../../components/chapter/ChapterInfoForm";
import { UploadImagesModal } from "../../../../components/chapter/UploadImagesModal";
import { ImageGrid, type ImageItem } from "../../../../components/chapter/ImageGrid";

function EditChapter() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    chapter,
    isLoading: isLoadingChapter,
    refetch: refetchChapter,
  } = useChapterById(id);
  const { deletePage, isLoading: isDeleting } = useDeletePage();
  const [showUploadModal, setShowUploadModal] = useState(false);

  const handleConfirmDelete = async (pageIds: string[]) => {
    if (!id) return;
    try {
      await Promise.all(pageIds.map((pageId) => deletePage(id, pageId)));
      refetchChapter();
    } catch {
      // Error handled in hook
    }
  };

  const gridItems: ImageItem[] =
    chapter?.pages?.map((page) => ({
      id: page.id ?? String(page.pageNumber),
      url: page.url,
      label: `Page ${page.pageNumber}`,
      pageNumber: page.pageNumber,
    })) || [];

  if (isLoadingChapter) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-medium-gray">Loading...</p>
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
          {chapter && (
            <ChapterInfoForm chapter={chapter} onUpdated={refetchChapter} />
          )}

          <section className="bg-surface border border-[var(--color-border)/0.06] rounded-xl p-6">
            <div className="flex items-center justify-between border-b border-border pb-2 mb-4">
              <div className="flex items-center gap-2 text-primary">
                <span className="text-lg">📄</span>
                <h3 className="font-semibold uppercase text-xs tracking-wider">
                  Pages
                </h3>
                <span className="text-xs text-dim-gray">
                  ({chapter?.pages?.length || 0})
                </span>
              </div>
              <button
                onClick={() => setShowUploadModal(true)}
                className="text-xs text-accent-blue hover:underline"
              >
                + Upload Images
              </button>
            </div>

            <ImageGrid
              mode="page"
              items={gridItems}
              onConfirmDelete={handleConfirmDelete}
              isDeleting={isDeleting}
            />
          </section>
        </div>

        <div className="lg:col-span-4">
          <section className="bg-surface border border-[var(--color-border)/0.06] rounded-xl p-6">
            <div className="flex items-center gap-2 text-primary border-b border-border pb-2 mb-4">
              <span className="text-lg">📊</span>
              <h3 className="font-semibold uppercase text-xs tracking-wider">
                Chapter Details
              </h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-medium-gray">Total Pages</span>
                <span className="text-foreground font-medium">
                  {chapter?.pages?.length || 0}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-medium-gray">Chapter Number</span>
                <span className="text-foreground font-medium">
                  {chapter?.number}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-medium-gray">Serie</span>
                <span className="text-foreground font-medium">
                  {chapter?.series?.title || "—"}
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>

      {showUploadModal && id && (
        <UploadImagesModal
          chapterId={id}
          onClose={() => setShowUploadModal(false)}
          onUploaded={refetchChapter}
        />
      )}
    </div>
  );
}

export { EditChapter };
