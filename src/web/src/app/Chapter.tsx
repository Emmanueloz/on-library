import { useEffect} from "react";
import { useParams,  } from "react-router";
import { useChapter } from "../hooks/useChapter";
import { useChaptersBySeries } from "../hooks/useChaptersBySeries";
import { useConfig } from "../hooks/useConfig";
import { useReadingHistory } from "../hooks/useReadingHistory";
import { AuthContext } from "../context/AuthContex";

import { use } from "react";
import { ChapterReader } from "../components/chapter/ChapterRender";


function Chapter() {
  const { id } = useParams();
  const { chapter, errorChapter, isLoading } = useChapter({ id });
  const { chapters } = useChaptersBySeries(
    chapter?.series?.id ? String(chapter.series.id) : "",
  );
  const authContext = use(AuthContext);
  const isAuthenticated = authContext?.isAuthenticated() ?? false;
  const { readChapterIds, markAsRead, markAsUnread } = useReadingHistory(
    chapter?.idSeries,
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const currentIndex = chapters.findIndex((c) => c.id === id);
  const prevChapter =
    currentIndex >= 0 && currentIndex < chapters.length - 1
      ? chapters[currentIndex + 1]
      : null;
  const nextChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null;

  const { viewMode, setViewMode } = useConfig();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-medium-gray">loading...</p>
      </div>
    );
  }

  return (
    <>
      {errorChapter && <p className="text-primary">{errorChapter}</p>}
      <ChapterReader
        key={chapter?.id ?? "chapter"}
        chapter={chapter}
        prevChapter={prevChapter}
        nextChapter={nextChapter}
        isAuthenticated={isAuthenticated}
        readChapterIds={readChapterIds}
        markAsRead={markAsRead}
        markAsUnread={markAsUnread}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />
    </>
  );
}

export { Chapter };
