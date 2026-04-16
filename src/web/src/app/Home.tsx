import { useChapters } from "../hooks/useChapters";
import { CardChapter } from "../components/chapter/CardChapter";

function Home() {
  const { chapters, errorChapters, isLoading } = useChapters();

  if (isLoading) {
    return (
      <>
        <p>loading</p>
      </>
    );
  }

  return (
    <main className="p-2">
      {errorChapters ?? <p>{errorChapters}</p>}
      <section className="grid grid-cols-4 gap-2">
        {chapters.map((c) => (
          <CardChapter key={c.id} chapter={c} />
        ))}
      </section>
    </main>
  );
}

export { Home };
