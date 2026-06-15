import { useState } from "react";
import { useNavigate } from "react-router";
import { useCategories } from "../../../../hooks/useCategories";
import { useTags } from "../../../../hooks/useTags";
import { useCreateSeries } from "../../../../hooks/useCreateSeries";
import { useJikanSearch } from "../../../../hooks/useJikanSearch";
import { PrimaryButton } from "../../../../components/common/PrimaryButton";

function CreateSerie() {
  const navigate = useNavigate();
  const { categories } = useCategories();
  const { tags: allTags } = useTags();
  const { createSeries, isLoading, error } = useCreateSeries();
  const {
    search: searchJikan,
    images,
    isLoading: isSearching,
    clearImages,
  } = useJikanSearch();

  const [formData, setFormData] = useState({
    title: "",
    pictureUrl: "",
    description: "",
    author: "",
    publicationDate: "",
    idCategory: "",
  });

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showJikanModal, setShowJikanModal] = useState(false);
  const [jikanQuery, setJikanQuery] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagChange = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId],
    );
  };

  const handleJikanSearch = async () => {
    if (jikanQuery.trim()) {
      console.log("searchJikan");
      await searchJikan(jikanQuery);
    }
  };

  const handleSelectJikanImage = (imageUrl: string) => {
    setFormData((prev) => ({ ...prev, pictureUrl: imageUrl }));
    setShowJikanModal(false);
    clearImages();
    setJikanQuery("");
  };

  const handleSubmit = async () => {
    const data = {
      ...formData,
      tags: selectedTags,
    };

    try {
      const result = await createSeries(data);
      if (result?.id) {
        navigate(`/dashboard/content/serie/${result.id}`);
      }
    } catch {
      // Error handled in hook
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-8 space-y-6">
        <section className="bg-surface border border-[var(--color-border)/0.06] rounded-xl p-6">
          <div className="flex items-center gap-2 text-primary border-b border-border pb-2 mb-4">
            <span className="text-lg">✎</span>
            <h3 className="font-semibold uppercase text-xs tracking-wider">
              Series Information
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-medium text-medium-gray block">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full bg-background border border-[var(--color-border)/0.08] rounded px-3 py-2 text-sm focus:border-[var(--color-accent-blue)/0.15] focus:outline-none transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-medium-gray block">
                Author
              </label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                required
                className="w-full bg-background border border-[var(--color-border)/0.08] rounded px-3 py-2 text-sm focus:border-[var(--color-accent-blue)/0.15] focus:outline-none transition-all"
              />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-medium text-medium-gray block">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full bg-background border border-[var(--color-border)/0.08] rounded px-3 py-2 text-sm resize-none focus:border-[var(--color-accent-blue)/0.15] focus:outline-none transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-medium-gray block">
                Publication Date
              </label>
              <input
                type="date"
                name="publicationDate"
                value={formData.publicationDate}
                onChange={handleChange}
                required
                className="w-full bg-background border border-[var(--color-border)/0.08] rounded px-3 py-2 text-sm focus:border-[var(--color-accent-blue)/0.15] focus:outline-none transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-medium-gray block">
                Category
              </label>
              <select
                name="idCategory"
                value={formData.idCategory}
                onChange={handleChange}
                required
                className="w-full bg-background border border-[var(--color-border)/0.08] rounded px-3 py-2 text-sm focus:border-[var(--color-accent-blue)/0.15] focus:outline-none transition-all"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {error && (
          <div className="bg-primary/10 border border-primary rounded p-4">
            <p className="text-primary text-sm">Error: {error}</p>
          </div>
        )}

        <PrimaryButton disabled={isLoading} onClick={handleSubmit}>
          {isLoading ? "Creating..." : "Create Serie"}
        </PrimaryButton>
      </div>

      <div className="lg:col-span-4 space-y-6">
        <section className="bg-surface border border-[var(--color-border)/0.06] rounded-xl p-6">
          <div className="flex items-center gap-2 text-primary border-b border-border pb-2 mb-4">
            <span className="text-lg">🖼</span>
            <h3 className="font-semibold uppercase text-xs tracking-wider">
              Cover Image
            </h3>
          </div>

          <div
            className="aspect-video bg-background border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center text-center p-4 hover:border-primary/50 cursor-pointer transition-colors group"
            onClick={() => setShowJikanModal(true)}
          >
            {formData.pictureUrl ? (
              <div className="relative w-full h-full">
                <img
                  src={formData.pictureUrl}
                  alt="Preview"
                  className="w-full h-full object-cover rounded"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded">
                  <button className="bg-white text-background px-3 py-1 text-xs font-semibold rounded">
                    Change
                  </button>
                </div>
              </div>
            ) : (
              <>
                <span className="text-4xl text-dim-gray group-hover:text-primary mb-2">
                  +
                </span>
                <p className="text-sm font-medium text-dim-gray">
                  Search Cover
                </p>
                <p className="text-[10px] text-dim-gray">
                  Click to search with Jikan
                </p>
              </>
            )}
          </div>
        </section>

        <section className="bg-surface border border-[var(--color-border)/0.06] rounded-xl p-6">
          <div className="flex items-center justify-between border-b border-border pb-2 mb-4">
            <div className="flex items-center gap-2 text-primary">
              <span className="text-lg">🏷</span>
              <h3 className="font-semibold uppercase text-xs tracking-wider">
                Tags
              </h3>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold uppercase text-medium-gray block mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {allTags.map(
                  (tag) =>
                    tag.id && (
                      <button
                        key={tag.id}
                        onClick={() => tag.id && handleTagChange(tag.id)}
                        className={`px-2 py-1 text-xs rounded transition-all ${
                          selectedTags.includes(tag.id)
                            ? "bg-primary text-white"
                            : "bg-background text-medium-gray border border-border hover:border-primary/50"
                        }`}
                      >
                        {tag.name}
                        {selectedTags.includes(tag.id) && (
                          <span className="ml-1">×</span>
                        )}
                      </button>
                    ),
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

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
                  clearImages();
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
                onKeyDown={(e) => e.key === "Enter" && handleJikanSearch()}
                placeholder="Search manga..."
                className="flex-1 bg-background border border-[var(--color-border)/0.08] rounded px-3 py-2 text-sm focus:border-primary/50 focus:outline-none transition-all"
              />
              <button
                onClick={handleJikanSearch}
                disabled={isSearching}
                className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded hover:brightness-110 transition-all disabled:opacity-50"
              >
                {isSearching ? "..." : "Search"}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {images.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {images.map((img, index) => (
                    <>
                      <span>{img.title}</span>
                      <button
                        key={index}
                        onClick={() =>
                          handleSelectJikanImage(img.images.jpg.image_url)
                        }
                        className="aspect-3/4 overflow-hidden rounded hover:ring-2 hover:ring-primary transition-all"
                      >
                        <img
                          src={img.images.jpg.image_url}
                          alt={img.title + "jpg-image_url"}
                          className="w-full h-full object-cover"
                        />
                      </button>
                      {img.images.jpg.small_image_url && (
                        <button
                          key={index}
                          onClick={() =>
                            handleSelectJikanImage(
                              img.images.jpg.small_image_url ?? "",
                            )
                          }
                          className="aspect-3/4 overflow-hidden rounded hover:ring-2 hover:ring-primary transition-all"
                        >
                          <img
                            src={img.images.jpg.small_image_url}
                            alt={img.title + "jpg-small"}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      )}
                      {img.images.jpg.small_image_url && (
                        <button
                          key={index}
                          onClick={() =>
                            handleSelectJikanImage(
                              img.images.jpg.large_image_url ?? "",
                            )
                          }
                          className="aspect-3/4 overflow-hidden rounded hover:ring-2 hover:ring-primary transition-all"
                        >
                          <img
                            src={img.images.jpg.large_image_url}
                            alt={img.title + "jpg-large"}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      )}
                    </>
                  ))}
                </div>
              ) : (
                <p className="text-center text-dim-gray py-8">
                  {isSearching
                    ? "Searching..."
                    : "No results yet. Search for a manga cover."}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { CreateSerie };
