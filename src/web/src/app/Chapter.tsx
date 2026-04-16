import { NavLink, useParams } from "react-router";
import { useChapter } from "../hooks/useChapter";

function Chapter() {
  const { id } = useParams();

  const { chapter, errorChapter, isLoading } = useChapter({ id });

  if (isLoading) {
    return (
      <>
        <p>loading</p>
      </>
    );
  }

  return (
    <>
      {errorChapter ?? <p>{errorChapter}</p>}

      <main className="w-screen flex flex-col items-center p-2">
        <div className="w-10/12">
          <section className="flex justify-between p-2 items-center">
            <div>
              <NavLink to={`/serie/${chapter?.series?.id}`}>
                <h2 className="text-2xl font-bold">{chapter?.series?.title}</h2>
              </NavLink>
              <h3 className="text-xl">Capitulo {chapter?.number}</h3>
              <h4 className="text-lg">{chapter?.title}</h4>
            </div>
            <div>
              <button
                type="button"
                className="px-4 py-2 rounded-xl bg-gray-500 hover:bg-gray-300"
              >
                ==
              </button>
            </div>
          </section>

          <section>
            {chapter?.pages?.map((p) => (
              <img
                className="w-full"
                key={p.id}
                src={p.url}
                alt={p.pageNumber.toString()}
                loading="lazy"
              />
            ))}
          </section>
          <section className="flex gap-2 justify-between py-10">
            <button>After</button>
            <NavLink to={`/serie/${chapter?.series?.id}`}>
              <p>Serie</p>
            </NavLink>
            <button>Next</button>
          </section>
        </div>
      </main>
    </>
  );
}

export { Chapter };
