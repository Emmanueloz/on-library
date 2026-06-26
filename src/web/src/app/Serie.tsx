import { useParams } from "react-router";
import { useState, useMemo } from "react";
import { use } from "react";
import { useSerie } from "../hooks/useSerie";
import { ChipTag } from "../components/tags/ChipTag";
import { ItemChapter } from "../components/chapter/ItemChapter";
import { AddToLibraryModal } from "../components/library/AddToLibraryModal";
import { AuthContext } from "../context/AuthContex";
import { useLibraryBySerie } from "../hooks/useLibraryBySerie";
import { FollowButton } from "../components/series/FollowButton";
import { useFollowing } from "../hooks/useFollowing";
import { useReadingHistory } from "../hooks/useReadingHistory";
import type { IChapter } from "@on-library/shared";

type VisualItem =
  | { type: "group"; groupNum: number; groupTitle: string | null; chapters: IChapter[] }
  | { type: "loose"; chapters: IChapter[] };

const CHAPTERS_PER_PAGE = 20;

function Serie() {
  const { id } = useParams();
  const { serie, isLoading, errorSerie } = useSerie({ id: id });
  const [showAddToLibrary, setShowAddToLibrary] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const authContext = use(AuthContext);
  const isAuthenticated = authContext?.isAuthenticated() ?? false;

  const { library: currentLibrary, refetch: refetchLibrary } =
    useLibraryBySerie(id);

  const {
    isFollowing,
    isLoading: isLoadingFollowing,
    toggleFollow,
  } = useFollowing(isAuthenticated ? id : undefined);

  const { readChapterIds, markAsRead, markAsUnread } = useReadingHistory(
    isAuthenticated && isFollowing ? id : undefined,
  );

  const handleToggleRead = (chapterId: string, value: boolean) => {
    console.log(`handleToggleRead: chapterId=${chapterId}, isRead=${value}`);
    
    if (value) {
      markAsRead(chapterId, true);
    } else {
      markAsUnread(chapterId);
    }
  };

  const chapters = serie?.chapters;

  const reversedChapters = useMemo(() => {
    if (!chapters?.length) return [];
    return [...chapters].reverse();
  }, [chapters]);

  const totalPages = Math.max(1, Math.ceil(reversedChapters.length / CHAPTERS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);

  const pageItems = useMemo((): VisualItem[] => {
    const start = (safePage - 1) * CHAPTERS_PER_PAGE;
    const slice = reversedChapters.slice(start, start + CHAPTERS_PER_PAGE);

    const items: VisualItem[] = [];
    let currentGroup: { groupNum: number; groupTitle: string | null; chapters: IChapter[] } | null = null;
    let currentLoose: IChapter[] = [];

    for (const ch of slice) {
      if (ch.groupNum != null) {
        if (currentGroup && currentGroup.groupNum === ch.groupNum) {
          currentGroup.chapters.push(ch);
        } else {
          if (currentLoose.length > 0) {
            items.push({ type: "loose", chapters: currentLoose });
            currentLoose = [];
          }
          if (currentGroup) {
            items.push({ type: "group", ...currentGroup });
          }
          currentGroup = { groupNum: ch.groupNum, groupTitle: ch.groupTitle ?? null, chapters: [ch] };
        }
      } else {
        if (currentGroup) {
          items.push({ type: "group", ...currentGroup });
          currentGroup = null;
        }
        currentLoose.push(ch);
      }
    }

    if (currentGroup) items.push({ type: "group", ...currentGroup });
    if (currentLoose.length > 0) items.push({ type: "loose", chapters: currentLoose });

    return items;
  }, [safePage, reversedChapters]);

  if (isLoading) {
    return (
      <>
        <p>loading</p>
      </>
    );
  }

  return (
    <>
      {errorSerie ?? <p>{errorSerie}</p>}

      <main className="p-6">
        <section className="bg-surface border-[var(--color-border)/0.06] rounded-2xl p-6 mb-6 flex flex-col gap-4 hover:border-[var(--color-border)/0.12] transition-all duration-200">
          <div className="flex gap-6">
            <div className="shrink-0 w-50">
              <img
                src={serie?.pictureUrl}
                alt={serie?.title}
                className="rounded-xl w-full h-auto object-cover"
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <h3 className="text-[24px] font-medium leading-[1.17] tracking-[0.2] text-foreground">
                  {serie?.title}
                </h3>
                {isAuthenticated && id && (
                  <>
                    <FollowButton
                      isFollowing={isFollowing}
                      isLoading={isLoadingFollowing}
                      onToggle={toggleFollow}
                    />
                    <button
                      onClick={() => setShowAddToLibrary(true)}
                      className="px-3 py-1.5 text-xs font-semibold text-foreground border border-[var(--color-border)/0.1] rounded-lg hover:opacity-60 transition-opacity duration-200"
                    >
                      {currentLibrary ? "In Library" : "+ Add to Library"}
                    </button>
                  </>
                )}
              </div>
              <span className="text-[16px] font-medium leading-[1.6] tracking-[0.2] text-foreground">
                {serie?.author}
              </span>
              <span className="text-[14px] font-medium leading-[1.14] tracking-[0.2] text-medium-gray">
                {serie?.category?.name}
              </span>
              <span className="text-[14px] font-medium leading-[1.14] tracking-[0.2] text-medium-gray">
                {serie?.createdAt?.toString()}
              </span>
              <div className="flex flex-wrap gap-2">
                {serie?.tagsOnSeries?.map((t) => (
                  <ChipTag key={t.idTag} tag={t.tag} />
                ))}
              </div>
              <p className="text-[16px] font-medium leading-[1.6] tracking-[0.2] text-foreground">
                {serie?.description}
              </p>
            </div>
          </div>
        </section>

        <section className="bg-surface border-[var(--color-border)/0.06] rounded-2xl p-6 hover:border-[var(--color-border)/0.12] transition-all duration-200">
          <h2 className="text-[22px] font-normal leading-[1.15] tracking-[0] text-foreground mb-4">
            Chapters
          </h2>
          <div className="space-y-4">
            {pageItems.map((item, idx) => {
              if (item.type === "group") {
                return (
                  <details key={`group-${item.groupNum}-${idx}`} open>
                    <summary className="text-sm font-semibold text-primary cursor-pointer select-none mb-2 hover:text-white transition-colors">
                      {item.groupTitle || `Group ${item.groupNum}`}
                      <span className="text-dim-gray font-normal ml-2">
                        ({item.chapters.length})
                      </span>
                    </summary>
                    <div className="space-y-3 pl-4">
                      {item.chapters.map((c) => (
                        <ItemChapter
                          key={c.id}
                          chapter={c}
                          isRead={c.id ? readChapterIds.has(c.id) : false}
                          showReadStatus={isAuthenticated && isFollowing}
                          onToggleRead={
                            c.id
                              ? (isRead) => handleToggleRead(c.id ?? "", isRead)
                              : undefined
                          }
                        />
                      ))}
                    </div>
                  </details>
                );
              }
              return (
                <div key={`loose-${idx}`} className="space-y-3">
                  {item.chapters.map((c) => (
                    <ItemChapter
                      key={c.id}
                      chapter={c}
                      isRead={c.id ? readChapterIds.has(c.id) : false}
                      showReadStatus={isAuthenticated && isFollowing}
                      onToggleRead={
                        c.id
                          ? (isRead) => handleToggleRead(c.id ?? "", isRead)
                          : undefined
                      }
                    />
                  ))}
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t border-border">
              {totalPages > 2 && (
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={safePage <= 2}
                  className="px-3 py-1.5 text-xs font-semibold text-foreground border border-[var(--color-border)/0.1] rounded-lg hover:opacity-60 transition-opacity disabled:opacity-30"
                >
                  ⇤ First
                </button>
              )}

              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={safePage <= 1}
                className="px-3 py-1.5 text-xs font-semibold text-foreground border border-[var(--color-border)/0.1] rounded-lg hover:opacity-60 transition-opacity disabled:opacity-30"
              >
                ← Prev
              </button>
              <span className="text-xs text-medium-gray">
                Page {safePage} / {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={safePage >= totalPages}
                className="px-3 py-1.5 text-xs font-semibold text-foreground border border-[var(--color-border)/0.1] rounded-lg hover:opacity-60 transition-opacity disabled:opacity-30"
              >
                Next →
              </button>
              {totalPages > 2 && (
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={totalPages <= 2 || safePage >= totalPages - 1}
                  className="px-3 py-1.5 text-xs font-semibold text-foreground border border-[var(--color-border)/0.1] rounded-lg hover:opacity-60 transition-opacity disabled:opacity-30"
                >
                  Last ⇥
                </button>
              )}
            </div>
          )}
        </section>
      </main>

      {showAddToLibrary && id && (
        <AddToLibraryModal
          isOpen={showAddToLibrary}
          onClose={() => setShowAddToLibrary(false)}
          serieId={id}
          currentLibrary={currentLibrary}
          onLibraryChange={refetchLibrary}
        />
      )}
    </>
  );
}

export { Serie };
