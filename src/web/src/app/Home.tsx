import { Link } from "react-router";
import { useLatestChaptersBySeries } from "../hooks/useLatestChaptersBySeries";
import { useRecentSeries } from "../hooks/useRecentSeries";
import { SeriesRow } from "../components/series/SeriesRow";
import { CardChapter } from "../components/chapter/CardChapter";

function Home() {
  const { chapters, error: errorChapters, isLoading: loadingChapters } = useLatestChaptersBySeries(18);
  const { series, error: errorSeries, isLoading: loadingSeries } = useRecentSeries(12);

  const isLoading = loadingChapters || loadingSeries;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-medium-gray">Cargando...</p>
      </div>
    );
  }

  return (
    <main className="p-4 md:p-10 mx-auto">
      {(errorChapters || errorSeries) && (
        <p className="text-primary mb-4">{errorChapters || errorSeries}</p>
      )}

      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[20px] font-medium leading-[1.6] tracking-[0.2px] text-foreground">
            Últimas Actualizaciones
          </h2>
          <Link
            to="/titles"
            className="text-[13px] font-semibold tracking-[0.3px] text-accent-blue hover:underline"
          >
            Ver más →
          </Link>
        </div>
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {chapters.map((c) => (
            <CardChapter key={c.id} chapter={c} />
          ))}
        </section>
        {chapters.length === 0 && (
          <p className="text-center text-dim-gray mt-8">
            No hay capítulos disponibles
          </p>
        )}
      </section>

      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[20px] font-medium leading-[1.6] tracking-[0.2px] text-foreground">
            Series Recientes
          </h2>
          <Link
            to="/titles"
            className="text-[13px] font-semibold tracking-[0.3px] text-accent-blue hover:underline"
          >
            Ver más →
          </Link>
        </div>
        {series.length > 0 ? (
          <SeriesRow series={series} />
        ) : (
          <p className="text-center text-dim-gray mt-8">
            No hay series disponibles
          </p>
        )}
      </section>
    </main>
  );
}

export { Home };
