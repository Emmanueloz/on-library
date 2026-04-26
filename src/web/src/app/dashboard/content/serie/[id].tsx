import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { useSerie } from "../../../../hooks/useSerie";
import { useChaptersBySeries } from "../../../../hooks/useChaptersBySeries";
import { useCreateChapter } from "../../../../hooks/useCreateChapter";
import { useUpdateSeries } from "../../../../hooks/useUpdateSeries";
import { useCategories } from "../../../../hooks/useCategories";
import { useTags } from "../../../../hooks/useTags";
import { useJikanSearch } from "../../../../hooks/useJikanSearch";

type SerieData = NonNullable<ReturnType<typeof useSerie>["serie"]>;

function EditSerieForm({ serie, id }: { serie: SerieData; id: string }) {
  const navigate = useNavigate();
  const { chapters, refetch: refetchChapters } = useChaptersBySeries(id);
  const { createChapter, isLoading: isCreatingChapter } = useCreateChapter();
  const { updateSeries, isLoading: isUpdating } = useUpdateSeries();
  const { categories } = useCategories();
  const { tags } = useTags();
  const {
    search: searchJikan,
    images: jikanImages,
    isLoading: isSearchingJikan,
    clearImages: clearJikanImages,
  } = useJikanSearch();
  const { refetch: refetchSerie } = useSerie({ id });

  const [showNewChapter, setShowNewChapter] = useState(false);
  const [newChapter, setNewChapter] = useState({ title: "", number: 0 });

  const [formData, setFormData] = useState({
    title: serie.title,
    author: serie.author,
    idCategory: serie.idCategory,
    publicationDate: serie.publicationDate.toString().split("T")[0],
    description: serie.description,
    pictureUrl: serie.pictureUrl,
  });

  const [newPictureUrl, setNewPictureUrl] = useState(serie.pictureUrl || "");

  const [selectedTags, setSelectedTags] = useState<string[]>(
    () =>
      serie.tagsOnSeries
        ?.map((t) => t.tag?.id)
        .filter((id): id is string => Boolean(id)) || [],
  );

  const [showJikanModal, setShowJikanModal] = useState(false);
  const [jikanQuery, setJikanQuery] = useState("");

  const handleToggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId],
    );
  };

  const handleUpdateInfo = async () => {
    if (!id) return;
    try {
      await updateSeries(id, {
        title: formData.title,
        author: formData.author,
        idCategory: formData.idCategory,
        publicationDate: formData.publicationDate,
        description: formData.description,
        tags: selectedTags,
      });
      refetchSerie();
    } catch {
      // Error handled in hook
    }
  };

  const handleUpdatePicture = async () => {
    if (!id || !newPictureUrl) return;
    try {
      await updateSeries(id, { pictureUrl: newPictureUrl });
      refetchSerie();
      setNewPictureUrl("");
    } catch {
      // Error handled in hook
    }
  };

  const handleJikanSearch = () => {
    if (jikanQuery.trim()) {
      searchJikan(jikanQuery);
    }
  };

  const handleSelectJikanImage = (imageUrl: string) => {
    setNewPictureUrl(imageUrl);
    setShowJikanModal(false);
    clearJikanImages();
    setJikanQuery("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/dashboard/content")}
          className="text-medium-gray hover:text-white transition-colors"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-semibold text-foreground">Edit Serie</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <section className="bg-surface border border-[var(--color-border)/0.06] rounded-xl p-6">
            <div className="flex items-center gap-2 text-primary border-b border-border pb-2 mb-4">
              <span className="text-lg">✎</span>
              <h3 className="font-semibold uppercase text-xs tracking-wider">
                Serie Information
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-medium text-medium-gray block">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="w-full bg-background border border-[var(--color-border)/0.08] rounded px-3 py-2 text-sm focus:border-primary/50 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-medium-gray block">
                  Author
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, author: e.target.value }))
                  }
                  className="w-full bg-background border border-[var(--color-border)/0.08] rounded px-3 py-2 text-sm focus:border-primary/50 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-medium-gray block">
                  Category
                </label>
                <select
                  value={formData.idCategory}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      idCategory: e.target.value,
                    }))
                  }
                  className="w-full bg-background border border-[var(--color-border)/0.08] rounded px-3 py-2 text-sm focus:border-primary/50 focus:outline-none"
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-medium-gray block">
                  Publication Date
                </label>
                <input
                  type="date"
                  value={formData.publicationDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      publicationDate: e.target.value,
                    }))
                  }
                  className="w-full bg-background border border-[var(--color-border)/0.08] rounded px-3 py-2 text-sm focus:border-primary/50 focus:outline-none"
                />
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-medium text-medium-gray block">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={4}
                  className="w-full bg-background border border-[var(--color-border)/0.08] rounded px-3 py-2 text-sm focus:border-primary/50 focus:outline-none resize-none"
                />
              </div>

              <div className="md:col-span-2">
                <button
                  onClick={handleUpdateInfo}
                  disabled={isUpdating}
                  className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded hover:brightness-110 transition-all disabled:opacity-50"
                >
                  {isUpdating ? "Updating..." : "Update Info"}
                </button>
              </div>
            </div>
          </section>

          <section className="bg-surface border border-[var(--color-border)/0.06] rounded-xl p-6">
            <div className="flex items-center justify-between border-b border-border pb-2 mb-4">
              <div className="flex items-center gap-2 text-primary">
                <span className="text-lg">📖</span>
                <h3 className="font-semibold uppercase text-xs tracking-wider">
                  Chapters
                </h3>
              </div>
              <button
                onClick={() => setShowNewChapter(true)}
                className="text-xs text-accent-blue hover:underline"
              >
                + New Chapter
              </button>
            </div>

            {showNewChapter && (
              <div className="bg-background border border-border rounded-lg p-4 mb-4">
                <h4 className="text-sm font-medium text-foreground mb-3">
                  Create Chapter
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-medium-gray block mb-1">
                      Title
                    </label>
                    <input
                      type="text"
                      value={newChapter.title}
                      onChange={(e) =>
                        setNewChapter((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      className="w-full bg-surface border border-[var(--color-border)/0.08] rounded px-3 py-2 text-sm focus:border-primary/50 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-medium-gray block mb-1">
                      Number
                    </label>
                    <input
                      type="number"
                      value={newChapter.number}
                      onChange={(e) =>
                        setNewChapter((prev) => ({
                          ...prev,
                          number: parseInt(e.target.value) || 0,
                        }))
                      }
                      className="w-full bg-surface border border-[var(--color-border)/0.08] rounded px-3 py-2 text-sm focus:border-primary/50 focus:outline-none"
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={async () => {
                      if (!newChapter.title || newChapter.number <= 0) return;
                      try {
                        const result = await createChapter({
                          title: newChapter.title,
                          number: newChapter.number,
                          idSeries: id,
                        });
                        if (result?.id) {
                          setShowNewChapter(false);
                          setNewChapter({ title: "", number: 0 });
                          refetchChapters();
                        }
                      } catch {
                        // Error handled in hook
                      }
                    }}
                    disabled={isCreatingChapter}
                    className="px-3 py-1.5 bg-primary text-white text-xs font-semibold rounded hover:brightness-110 transition-all disabled:opacity-50"
                  >
                    {isCreatingChapter ? "Creating..." : "Create"}
                  </button>
                  <button
                    onClick={() => setShowNewChapter(false)}
                    className="px-3 py-1.5 text-medium-gray text-xs hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-medium-gray uppercase">
                      #
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-medium-gray uppercase">
                      Title
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-medium-gray uppercase">
                      Pages
                    </th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-medium-gray uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {chapters.map((chapter) => (
                    <tr
                      key={chapter.id}
                      className="hover:bg-background transition-colors"
                    >
                      <td className="px-3 py-2 text-foreground">
                        {chapter.number}
                      </td>
                      <td className="px-3 py-2 text-foreground">
                        {chapter.title}
                      </td>
                      <td className="px-3 py-2 text-medium-gray">
                        {chapter.pages?.length || 0}
                      </td>
                      <td className="px-3 py-2 text-right">
                        <Link
                          to={`/dashboard/content/chapter/${chapter.id}`}
                          className="text-accent-blue hover:text-white transition-colors text-xs"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {chapters.length === 0 && (
              <p className="text-center text-dim-gray py-4">No chapters yet</p>
            )}
          </section>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <section className="bg-surface border border-[var(--color-border)/0.06] rounded-xl p-6">
            <div className="flex items-center gap-2 text-primary border-b border-border pb-2 mb-4">
              <span className="text-lg">🖼</span>
              <h3 className="font-semibold uppercase text-xs tracking-wider">
                Cover Image
              </h3>
            </div>

            {serie.pictureUrl && (
              <img
                src={serie.pictureUrl}
                alt={serie.title}
                className="w-full rounded-lg mb-4"
              />
            )}

            <button
              onClick={() => setShowJikanModal(true)}
              className="w-full px-3 py-2 bg-background border border-border text-medium-gray text-sm rounded hover:border-primary/50 transition-all"
            >
              Search Cover
            </button>

            {newPictureUrl && (
              <div className="mt-3">
                <p className="text-xs text-medium-gray mb-2">New:</p>
                <img
                  src={newPictureUrl}
                  alt="Preview"
                  className="w-full rounded-lg mb-2"
                />
                <button
                  onClick={handleUpdatePicture}
                  disabled={isUpdating}
                  className="w-full px-3 py-2 bg-primary text-white text-xs font-semibold rounded hover:brightness-110 transition-all disabled:opacity-50"
                >
                  {isUpdating ? "Updating..." : "Update Cover"}
                </button>
              </div>
            )}

            {showJikanModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-stone-900 border border-border rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">
                      Search Cover Image
                    </h3>
                    <button
                      onClick={() => {
                        setShowJikanModal(false);
                        clearJikanImages();
                      }}
                      className="text-dim-gray hover:text-white transition-colors"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="flex gap-3 mb-4">
                    <input
                      type="text"
                      value={jikanQuery}
                      onChange={(e) => setJikanQuery(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleJikanSearch()
                      }
                      placeholder="Search manga..."
                      className="flex-1 bg-background border border-[var(--color-border)/0.08] rounded px-3 py-2 text-sm focus:border-primary/50 focus:outline-none"
                    />
                    <button
                      onClick={handleJikanSearch}
                      disabled={isSearchingJikan}
                      className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded hover:brightness-110 transition-all disabled:opacity-50"
                    >
                      {isSearchingJikan ? "..." : "Search"}
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto">
                    {jikanImages.length > 0 ? (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                        {jikanImages.map((img, index) => (
                          <button
                            key={index}
                            onClick={() =>
                              img.images.jpg.large_image_url &&
                              handleSelectJikanImage(
                                img.images.jpg.large_image_url,
                              )
                            }
                            className="aspect-3/4 overflow-hidden rounded hover:ring-2 hover:ring-primary transition-all"
                          >
                            <img
                              src={img.images.jpg.small_image_url}
                              alt={img.title}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-dim-gray py-8">
                        {isSearchingJikan
                          ? "Searching..."
                          : "No results yet. Search for a manga cover."}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </section>

          <section className="bg-surface border border-[var(--color-border)/0.06] rounded-xl p-6">
            <div className="flex items-center gap-2 text-primary border-b border-border pb-2 mb-4">
              <span className="text-lg">🏷</span>
              <h3 className="font-semibold uppercase text-xs tracking-wider">
                Tags
              </h3>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map(
                (tag) =>
                  tag.id && (
                    <button
                      key={tag.id}
                      onClick={() => tag.id && handleToggleTag(tag.id)}
                      className={`px-2 py-1 text-xs rounded transition-all ${
                        selectedTags.includes(tag.id)
                          ? "bg-primary text-white"
                          : "bg-background text-medium-gray border border-border hover:border-primary/50"
                      }`}
                    >
                      {tag.name}
                    </button>
                  ),
              )}
            </div>
            <button
              onClick={async () => {
                try {
                  await updateSeries(id, { tags: selectedTags });
                  refetchSerie();
                } catch {
                  // Error handled in hook
                }
              }}
              disabled={isUpdating}
              className="w-full px-3 py-2 bg-primary text-white text-sm font-semibold rounded hover:brightness-110 transition-all disabled:opacity-50"
            >
              {isUpdating ? "Updating..." : "Update Tags"}
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}

function EditSerie() {
  const { id } = useParams();
  const { serie, isLoading: isLoadingSerie } = useSerie({ id: id || "" });

  if (isLoadingSerie || !serie) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-medium-gray">loading...</p>
      </div>
    );
  }

  return <EditSerieForm key={id} serie={serie} id={id!} />;
}

export { EditSerie };
