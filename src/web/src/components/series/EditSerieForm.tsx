import { Link, useNavigate } from "react-router";
import { useCategories } from "../../hooks/useCategories";
import { useTags } from "../../hooks/useTags";
import { useChaptersBySeries } from "../../hooks/useChaptersBySeries";
import { useCreateChapter } from "../../hooks/useCreateChapter";
import { useUpdateSeries } from "../../hooks/useUpdateSeries";
import { useSerie } from "../../hooks/useSerie";
import { useState } from "react";
import { JikanImageModal } from "../common/JikanImageModal";
import { ImportChaptersModal } from "./ImportChaptersModal";
import type { ISeries } from "@on-library/shared";

function EditSerieForm({ serie, id }: { serie: ISeries; id: string }) {
  const navigate = useNavigate();
  const { chapters, refetch: refetchChapters } = useChaptersBySeries(id);
  const { createChapter, isLoading: isCreatingChapter } = useCreateChapter();
  const { updateSeries, isLoading: isUpdating } = useUpdateSeries();
  const { categories } = useCategories();
  const { tags } = useTags();
  const { refetch: refetchSerie } = useSerie({ id });

  const [showNewChapter, setShowNewChapter] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [newChapter, setNewChapter] = useState({
    title: "",
    number: 0,
    groupNum: "",
    groupTitle: "",
  });

  const [formData, setFormData] = useState({
    title: serie.title,
    author: serie.author,
    idCategory: serie.idCategory,
    publicationDate: serie.publicationDate.toString().split("T")[0],
    description: serie.description,
  });

  const [pendingPictureUrl, setPendingPictureUrl] = useState("");
  const [showJikanModal, setShowJikanModal] = useState(false);

  const [selectedTags, setSelectedTags] = useState<string[]>(
    () =>
      serie.tagsOnSeries
        ?.map((t) => t.tag?.id)
        .filter((id): id is string => Boolean(id)) || [],
  );

  const hasNewPicture = pendingPictureUrl !== "";
  const currentPictureUrl = hasNewPicture ? pendingPictureUrl : serie.pictureUrl;

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
    if (!id || !hasNewPicture) return;
    try {
      await updateSeries(id, { pictureUrl: pendingPictureUrl });
      refetchSerie();
      setPendingPictureUrl("");
    } catch {
      // Error handled in hook
    }
  };

  const handleCancelPicture = () => {
    setPendingPictureUrl("");
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
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowNewChapter(true)}
                  className="text-xs text-accent-blue hover:underline"
                >
                  + New Chapter
                </button>
                <button
                  onClick={() => setShowImportModal(true)}
                  className="text-xs text-accent-blue hover:underline"
                >
                  + Import
                </button>
              </div>
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
                      step="0.1"
                      value={newChapter.number}
                      onChange={(e) =>
                        setNewChapter((prev) => ({
                          ...prev,
                          number: parseFloat(e.target.value) || 0,
                        }))
                      }
                      className="w-full bg-surface border border-[var(--color-border)/0.08] rounded px-3 py-2 text-sm focus:border-primary/50 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-medium-gray block mb-1">
                      Group Number (optional)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={newChapter.groupNum}
                      onChange={(e) =>
                        setNewChapter((prev) => ({
                          ...prev,
                          groupNum: e.target.value,
                        }))
                      }
                      placeholder="e.g. 1, 1.5, 2"
                      className="w-full bg-surface border border-[var(--color-border)/0.08] rounded px-3 py-2 text-sm focus:border-primary/50 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-medium-gray block mb-1">
                      Group Title (optional)
                    </label>
                    <input
                      type="text"
                      value={newChapter.groupTitle}
                      onChange={(e) =>
                        setNewChapter((prev) => ({
                          ...prev,
                          groupTitle: e.target.value,
                        }))
                      }
                      placeholder="e.g. Arc 3, Volume 1"
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
                          groupNum: newChapter.groupNum !== "" ? Number(newChapter.groupNum) : null,
                          groupTitle: newChapter.groupTitle || null,
                        });
                        if (result?.id) {
                          setShowNewChapter(false);
                          setNewChapter({ title: "", number: 0, groupNum: "", groupTitle: "" });
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
                      Group #
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-medium-gray uppercase">
                      Group Name
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
                        {chapter.groupNum ?? "—"}
                      </td>
                      <td className="px-3 py-2 text-medium-gray">
                        {chapter.groupTitle || "—"}
                      </td>
                      <td className="px-3 py-2 text-medium-gray">
                        {chapter.pagesCount || 0}
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

            {currentPictureUrl && (
              <div className="relative group cursor-pointer rounded-lg overflow-hidden mb-4" onClick={() => setShowJikanModal(true)}>
                <img
                  src={currentPictureUrl}
                  alt={serie.title}
                  className="w-full rounded-lg"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                  <span className="bg-white text-background px-3 py-1 text-xs font-semibold rounded">
                    Change
                  </span>
                </div>
                {hasNewPicture && (
                  <button
                    onClick={(e) => { e.stopPropagation(); handleCancelPicture(); }}
                    className="absolute top-2 right-2 w-6 h-6 bg-black/60 hover:bg-black/80 text-white text-xs rounded-full flex items-center justify-center transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>
            )}

            {!currentPictureUrl && (
              <button
                onClick={() => setShowJikanModal(true)}
                className="w-full aspect-video bg-background border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center text-center p-4 hover:border-primary/50 transition-colors"
              >
                <span className="text-4xl text-dim-gray mb-2">+</span>
                <p className="text-sm text-medium-gray">Search Cover</p>
                <p className="text-[10px] text-dim-gray">Click to search with Jikan</p>
              </button>
            )}

            {hasNewPicture && (
              <button
                onClick={handleUpdatePicture}
                disabled={isUpdating}
                className="w-full mt-3 px-3 py-2 bg-primary text-white text-xs font-semibold rounded hover:brightness-110 transition-all disabled:opacity-50"
              >
                {isUpdating ? "Updating..." : "Update Cover"}
              </button>
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

      {showJikanModal && (
        <JikanImageModal
          onClose={() => setShowJikanModal(false)}
          onSelect={(url) => setPendingPictureUrl(url)}
          initialQuery={formData.title}
        />
      )}

      {showImportModal && (
        <ImportChaptersModal
          idSeries={id}
          onClose={() => setShowImportModal(false)}
          onImported={() => refetchChapters()}
        />
      )}
    </div>
  );
}

export { EditSerieForm };
