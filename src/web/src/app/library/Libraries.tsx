import { use, useState } from "react";
import { PrimaryButton } from "../../components/common/PrimaryButton";
import { useLibraries } from "../../hooks/useLibraries";
import { AuthContext } from "../../context/AuthContex";
import { ImgPlaceholder } from "../../components/common/ImgPlaceholder";
import { Link } from "react-router";

function Libraries() {
  const { libraries, isLoading, errorLibraries, addLibrary } = useLibraries();

  const [showForm, setShowForm] = useState(false);

  const authContext = use(AuthContext);

  if (!authContext) {
    throw new Error("AuthButton must be used within a AuthProvider");
  }

  const { user } = authContext;

  const [newLibrary, setNewLibrary] = useState({
    name: "",
    isPublic: false,
  });

  if (isLoading) {
    <section>
      <h1>Libraries</h1>
      <div>
        <span>loading</span>
      </div>
    </section>;
  }

  const handleSave = async () => {
    setShowForm(false);

    await addLibrary({
      name: newLibrary.name,
      idUser: user?.id ?? "",
      isPublic: newLibrary.isPublic,
    });
  };

  return (
    <section className="p-4">
      <div className="flex justify-between mb-4">
        <h1>Libraries</h1>
        <PrimaryButton
          disabled={showForm}
          onClick={() => {
            setShowForm(true);
          }}
        >
          New Library
        </PrimaryButton>
      </div>

      {showForm && (
        <div className="bg-background border border-border rounded-lg p-4 mb-4">
          <h4 className="text-sm font-medium text-foreground mb-3">
            Create Libray
          </h4>
          <div className="flex gap-4 items-center">
            <label className="flex-1">
              <span className="text-xs font-medium text-medium-gray block mb-1">
                Name
              </span>
              <input
                type="text"
                value={newLibrary.name}
                onChange={(e) =>
                  setNewLibrary((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                className="w-full bg-surface border border-[var(--color-border)/0.08] rounded px-3 py-2 text-sm focus:border-primary/50 focus:outline-none"
              />
            </label>
            <label>
              <span className="text-xs font-medium text-medium-gray block mb-1">
                Public
              </span>
              <input
                type="checkbox"
                className="sr-only peer"
                checked={newLibrary.isPublic}
                onChange={(e) =>
                  setNewLibrary((prev) => ({
                    ...prev,
                    isPublic: e.target.checked,
                  }))
                }
              />
              <div className="relative mx-3 my-2 w-9 h-5 bg-neutral-quaternary rounded-full peer peer-focus:ring-4 peer-focus:ring-transparent dark:peer-focus:ring-transparent dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:inset-s-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary dark:peer-checked:bg-primary"></div>
            </label>
          </div>
          <div className="flex gap-2 mt-3">
            <PrimaryButton disabled={!showForm} onClick={handleSave}>
              New Library
            </PrimaryButton>
          </div>
        </div>
      )}

      <div className="grid grid-cols-4">
        {errorLibraries && <p>{errorLibraries}</p>}
        {libraries.length === 0 && <p>No results</p>}
        {libraries.map((l) => (
          <Link
            key={l.id}
            className="bg-surface rounded-2xl p-4 flex gap-4"
            to={`/libraries/${l.id}`}
          >
            <div className="shrink-0 w-30">
              <ImgPlaceholder
                seed={l.name}
                className="rounded-xl w-full h-auto object-cover"
              />
            </div>
            <div className="flex flex-col gap-2">
              <p>{l.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export { Libraries };
