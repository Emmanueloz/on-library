import { useState } from "react";
import { useNavigate } from "react-router";
import { useCategories } from "../../../../hooks/useCategories";
import { useTags } from "../../../../hooks/useTags";
import { useCreateSeries } from "../../../../hooks/useCreateSeries";
import { useJikanSearch } from "../../../../hooks/useJikanSearch";
import { PrimaryButton } from "../../../../components/common/PrimaryButton";
import { JikanImageModal } from "../../../../components/common/JikanImageModal";

function CreateSerie() {
  const navigate = useNavigate();
  const { categories } = useCategories();
  const { tags: allTags } = useTags();
  const { createSeries, isLoading, error } = useCreateSeries();
  const {
    searchOne,
    isSearchingOne,
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

  const handleAutoFill = async () => {
    if (!formData.title.trim()) return;

    const result = await searchOne(formData.title);
    if (!result) return;

    const publicationDate = result.published?.from
      ? result.published.from.slice(0, 10)
      : "";

    const matchedCategory = categories.find(
      (cat) =>
        cat.name &&
        result.type &&
        cat.name.toLowerCase() === result.type.toLowerCase(),
    );

    const jikanTagNames = [
      ...(result.genres?.map((g) => g.name) ?? []),
      ...(result.themes?.map((t) => t.name) ?? []),
      ...(result.demographics?.map((d) => d.name) ?? []),
    ];

    const matchedTagIds = allTags
      .filter(
        (tag) =>
          tag.id &&
          tag.name &&
          jikanTagNames.some(
            (jikanName) => jikanName.toLowerCase() === tag.name!.toLowerCase(),
          ),
      )
      .map((tag) => tag.id!);

    setFormData((prev) => ({
      ...prev,
      description: result.synopsis || prev.description,
      publicationDate: publicationDate || prev.publicationDate,
      idCategory: matchedCategory?.id || prev.idCategory,
    }));

    if (matchedTagIds.length > 0) {
      setSelectedTags(matchedTagIds);
    }
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

        <div className="flex gap-3">
          <PrimaryButton disabled={isLoading} onClick={handleSubmit}>
            {isLoading ? "Creating..." : "Create Serie"}
          </PrimaryButton>
          <button
            onClick={handleAutoFill}
            disabled={!formData.title.trim() || isSearchingOne}
            className="px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded hover:brightness-110 transition-all disabled:opacity-50"
          >
            {isSearchingOne ? "Searching..." : "Auto-fill from Jikan"}
          </button>
        </div>
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
                  <span className="bg-white text-background px-3 py-1 text-xs font-semibold rounded">
                    Change
                  </span>
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
        <JikanImageModal
          onClose={() => setShowJikanModal(false)}
          onSelect={(url) => setFormData((prev) => ({ ...prev, pictureUrl: url }))}
          initialQuery={formData.title}
        />
      )}
    </div>
  );
}

export { CreateSerie };
