import { useParams } from "react-router";
import { useLibrary } from "../../hooks/useLibrary";
import { CardSerie } from "../../components/series/CardSerie";

function Library() {
  const { id } = useParams();

  const { library, isLoading, errorLibrary } = useLibrary({ id: id ? id : "" });
  if (isLoading) {
    <section>
      <h1>Libraries</h1>
      <div>
        <span>loading</span>
      </div>
    </section>;
  }
  return (
    <section className="p-4">
      <h1>{library?.name}</h1>
      <div className="grid grid-cols-4">
        {errorLibrary && <p>{errorLibrary}</p>}
        {library?.series?.length === 0 && <p>No series</p>}
        {library?.series?.map((s) => (
          <CardSerie serie={s} />
        ))}
      </div>
    </section>
  );
}

export { Library };
