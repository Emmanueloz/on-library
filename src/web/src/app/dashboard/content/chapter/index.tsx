import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { MediaType } from "@on-library/shared";
import { useChapterById } from "../../../../hooks/useChapterById";
import { useDeletePage } from "../../../../hooks/useDeletePage";
import { ChapterInfoForm } from "../../../../components/chapter/ChapterInfoForm";
import { UploadMediaModal } from "../../../../components/chapter/UploadMediaModal";
import {
  ImageGrid,
  type ImageItem,
} from "../../../../components/chapter/ImageGrid";

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
    chapter?.media?.map((m) =>
      m.type === MediaType.EPUB || m.type === MediaType.PDF
        ? {
            id: m.id ?? m.type,
            url: m.url,
            label: m.type,
            type: m.type,
          }
        : {
            id: m.id ?? String(m.pageNumber),
            url: m.url,
            label: `Page ${m.pageNumber}`,
            pageNumber: m.pageNumber,
          },
    ) ?? [];

  const documentType =
    chapter?.media?.find(
      (m) => m.type === MediaType.EPUB || m.type === MediaType.PDF,
    )?.type ?? null;

  if (isLoadingChapter && !chapter) {
    return (
      <div className="h-full bg-background flex items-center justify-center">
        <p className="text-medium-gray">Loading...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="col-span-4 flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="text-medium-gray hover:text-white transition-colors"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-semibold text-foreground">Edit Chapter</h1>
      </div>

      {chapter && (
        <ChapterInfoForm
          chapter={chapter}
          onUpdated={refetchChapter}
          className="col-span-3"
        />
      )}

      <div className="col-span-1">
        <section className="bg-surface border border-[var(--color-border)/0.06] rounded-xl p-6">
          <div className="flex items-center gap-2 text-primary border-b border-border pb-2 mb-4">
            <span className="text-lg">📊</span>
            <h3 className="font-semibold uppercase text-xs tracking-wider">
              Chapter Details
            </h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-medium-gray">Total Media</span>
              <span className="text-foreground font-medium">
                {chapter?.media?.length || 0}
              </span>
            </div>
            {documentType && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-medium-gray">{documentType}</span>
                <span className="text-foreground font-medium">✓ Uploaded</span>
              </div>
            )}
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

      <section className="bg-surface border border-[var(--color-border)/0.06] rounded-xl p-6 col-span-4">
        <div className="flex items-center justify-between border-b border-border pb-2 mb-4">
          <div className="flex items-center gap-2 text-primary">
            <span className="text-lg">📄</span>
            <h3 className="font-semibold uppercase text-xs tracking-wider">
              Media
            </h3>
            <span className="text-xs text-dim-gray">
              ({chapter?.media?.length || 0})
            </span>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="text-xs text-accent-blue hover:underline"
          >
            + Upload Media
          </button>
        </div>

        <ImageGrid
          mode="page"
          items={gridItems}
          onConfirmDelete={handleConfirmDelete}
          isDeleting={isDeleting}
        />
      </section>

      {showUploadModal && id && (
        <UploadMediaModal
          chapterId={id}
          onClose={() => setShowUploadModal(false)}
          onUploaded={refetchChapter}
        />
      )}
    </div>
  );
}

export { EditChapter };
