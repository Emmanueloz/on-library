import { useEffect, useRef, useState } from "react";
import { createPluginRegistration } from "@embedpdf/core";
import { EmbedPDF } from "@embedpdf/core/react";
import { usePdfiumEngine } from "@embedpdf/engines/react";
import {
  DocumentContent,
  DocumentManagerPluginPackage,
} from "@embedpdf/plugin-document-manager/react";
import type { DocumentState } from "@embedpdf/core";
import {
  Viewport,
  ViewportPluginPackage,
} from "@embedpdf/plugin-viewport/react";
import { Scroller, ScrollPluginPackage } from "@embedpdf/plugin-scroll/react";
import {
  RenderLayer,
  RenderPluginPackage,
} from "@embedpdf/plugin-render/react";
import type { PdfReaderProps } from "../../interfaces/pdfReaderProps.interface";


function createPlugins(url: string) {
  return [
    createPluginRegistration(DocumentManagerPluginPackage, {
      initialDocuments: [{ url }],
    }),
    createPluginRegistration(ViewportPluginPackage),
    createPluginRegistration(ScrollPluginPackage),
    createPluginRegistration(RenderPluginPackage),
  ];
}

function useContainerSize(ref: React.RefObject<HTMLDivElement | null>) {
  const [size, setSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const update = () => {
      setSize({
        width: container.clientWidth,
        height: container.clientHeight,
      });
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(container);
    return () => observer.disconnect();
  }, [ref]);

  return size;
}

function CascadeView({ documentId }: { documentId: string }) {
  return (
    <Viewport documentId={documentId} className="w-full h-full">
      <Scroller
        documentId={documentId}
        renderPage={({ width, height, pageIndex }) => (
          <div style={{ width, height }}>
            <RenderLayer documentId={documentId} pageIndex={pageIndex} />
          </div>
        )}
      />
    </Viewport>
  );
}

function PageByPageView({
  documentId,
  documentState,
}: {
  documentId: string;
  documentState: DocumentState;
}) {
  const [pageIndex, setPageIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { width, height } = useContainerSize(containerRef);

  const pages = documentState.document?.pages ?? [];
  const totalPages = documentState.document?.pageCount ?? 0;
  const page = pages[pageIndex];

  const pageWidth = page?.size.width ?? 1;
  const pageHeight = page?.size.height ?? 1;
  const scale =
    width > 0 && height > 0
      ? Math.min(width / pageWidth, height / pageHeight)
      : 1;

  const goToPrevPage = () => setPageIndex((i) => Math.max(0, i - 1));
  const goToNextPage = () =>
    setPageIndex((i) => Math.min(totalPages - 1, i + 1));

  return (
    <div className="w-full h-full flex flex-col">
      <div>
        <button
          onClick={goToPrevPage}
          disabled={pageIndex <= 0}
          className="absolute left-0 top-0 bottom-0 w-1/6 flex items-center justify-end px-4 bg-transparent hover:bg-black/30 transition-colors disabled:opacity-0 disabled:cursor-not-allowed z-20"
          aria-label="Previous page"
        >
          <span className="text-lg">‹</span>
        </button>

        <button
          onClick={goToNextPage}
          disabled={pageIndex >= totalPages - 1}
          className="absolute right-0 top-0 bottom-0 w-1/6 flex items-center justify-start px-4 bg-transparent hover:bg-black/30 transition-colors disabled:opacity-0 disabled:cursor-not-allowed z-20"
          aria-label="Next page"
        >
          <span className="text-lg">›</span>
        </button>
      </div>

      <div
        ref={containerRef}
        className="flex-1 min-h-0 flex items-center justify-center overflow-hidden m-4"
      >
        {page && width > 0 && height > 0 && (
          <div
            style={{
              width: pageWidth * scale,
              height: pageHeight * scale,
            }}
          >
            <RenderLayer
              documentId={documentId}
              pageIndex={pageIndex}
              scale={scale}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function PdfReader({ url, viewMode }: PdfReaderProps) {
  const { engine, isLoading, error } = usePdfiumEngine();
  const [plugins] = useState(() => createPlugins(url));

  if (isLoading || !engine) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-sm text-dim-gray">Loading PDF…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-sm text-danger">
          Failed to load PDF: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full  h-[calc(100vh-56px)]">
      <EmbedPDF engine={engine} plugins={plugins}>
        {({ activeDocumentId }) =>
          activeDocumentId && (
            <DocumentContent documentId={activeDocumentId}>
              {({
                isLoading: isDocLoading,
                isError,
                isLoaded,
                documentState,
              }) => (
                <>
                  {isDocLoading && (
                    <div className="h-full flex items-center justify-center py-16">
                      <p className="text-sm text-dim-gray">Loading PDF…</p>
                    </div>
                  )}
                  {isError && (
                    <div className="h-full flex items-center justify-center py-16">
                      <p className="text-sm text-danger">Failed to load PDF</p>
                    </div>
                  )}
                  {isLoaded &&
                    (viewMode === "cascade" ? (
                      <CascadeView documentId={activeDocumentId} />
                    ) : (
                      <PageByPageView
                        documentId={activeDocumentId}
                        documentState={documentState}
                      />
                    ))}
                </>
              )}
            </DocumentContent>
          )
        }
      </EmbedPDF>
    </div>
  );
}

export { PdfReader };
