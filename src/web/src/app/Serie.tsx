import {  useParams } from "react-router";
import { useSerie } from "../hooks/useSerie";
import { ChipTag } from "../components/tags/ChipTag";
import { ItemChapter } from "../components/chapter/ItemChapter";

function Serie() {
  const { id } = useParams();

  const { serie, isLoading, errorSerie } = useSerie({ id: id });

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

      <main className="p-2">
        <section className="flex grow gap-2">
          <section className="w-1/4">
            <img src={serie?.pictureUrl} alt={serie?.title} />
          </section>
          <section className="flex flex-col gap-2">
            <h3>{serie?.title}</h3>
            <span>{serie?.author}</span>
            <span>{serie?.category?.name}</span>
            <span>{serie?.createdAt?.toString()}</span>
            <div className="flex gap-2">
              {serie?.tagsOnSeries?.map((t) => (
                <ChipTag key={t.idTag} tag={t.tag} />
              ))}
            </div>
            <p>{serie?.description}</p>
          </section>
        </section>
        <section className="mt-5 flex flex-col gap-2">
          {serie?.chapters?.map((c) => (
            <ItemChapter chapter={c} />
          ))}
        </section>
      </main>
    </>
  );
}

export { Serie };
