import { useSeries } from "../hooks/useSeries";
import { CardSerie } from "../components/series/CardSerie";

function Titles() {
  const { series, errorSeries, isLoading } = useSeries();

  if (isLoading) {
    return (
      <>
        <p>loading</p>
      </>
    );
  }

  return (
    <main className="flex flex-col gap-1 pl-2 pt5">
      <section>
        <form>
          <input type="search" name="search" id="search" />
        </form>
      </section>
      {errorSeries ?? <p>{errorSeries}</p>}
      <section className="grid grid-cols-4 gap-2">
        {series.map((s) => (
          <CardSerie key={s.id} serie={s} />
        ))}
      </section>
    </main>
  );
}
export { Titles };
