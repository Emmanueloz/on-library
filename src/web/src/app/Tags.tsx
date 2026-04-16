import { useTags } from "../hooks/useTags";

function Tags() {
  const { tags, errorTags, isLoading } = useTags();

  if (isLoading) {
    return (
      <>
        <p>loading</p>
      </>
    );
  }

  return (
    <>
      {errorTags ?? <p>{errorTags}</p>}

      <main className="p-2">
        <section>
          {tags.map((t) => (
            <div key={t.id}>
              <span>{t.name}</span>
            </div>
          ))}
        </section>
      </main>
    </>
  );
}

export { Tags };
