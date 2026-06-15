import { useState } from "react";
import { useCategories } from "../../hooks/useCategories";
import { PrimaryButton } from "../../components/common/PrimaryButton";

function Categories() {
  const {
    categories,
    errorCategories,
    isLoading,
    addCategory,
    updateCategory,
    deleteCategory,
  } = useCategories();

  const [nameCategory, setNameCategory] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-medium-gray">loading...</p>
      </div>
    );
  }

  const handleAddCategory = () => {
    setIsAdding(true);
    setNameCategory("");
  };

  const handleSaveCategory = async () => {
    if (!nameCategory.trim()) return;
    try {
      await addCategory({ name: nameCategory });
      setNameCategory("");
      setIsAdding(false);
    } catch {
      // Error handled in hook
    }
  };

  const handleEditCategory = (id?: string) => {
    setIsEditing(id ?? null);
    const category = categories.find((cat) => cat.id === id);
    if (category) {
      setNameCategory(category.name);
    }
  };

  const handleUpdateCategory = async () => {
    if (!isEditing || !nameCategory.trim()) return;
    try {
      await updateCategory(isEditing, { name: nameCategory });
      setNameCategory("");
      setIsEditing(null);
    } catch {
      // Error handled in hook
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteCategory(id);
    } catch {
      // Error handled in hook
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Categories</h1>
          <p className="text-sm text-medium-gray">Manage your categories</p>
        </div>
        <PrimaryButton
          onClick={handleAddCategory}
          disabled={isAdding || isEditing !== null}
        >
          + New Category
        </PrimaryButton>
      </div>

      {errorCategories && (
        <p className="text-primary text-sm">{errorCategories}</p>
      )}

      <section className="bg-surface border border-[var(--color-border)/0.06] rounded-xl p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-semibold text-medium-gray uppercase">
                  Name
                </th>
                <th className="px-3 py-2 text-right text-xs font-semibold text-medium-gray uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {categories.map((category) => (
                <tr
                  key={category.id}
                  className="hover:bg-background transition-colors"
                >
                  {isEditing === category.id ? (
                    <>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={nameCategory}
                          onChange={(e) => setNameCategory(e.target.value)}
                          className="w-full bg-background border border-[var(--color-border)/0.08] rounded px-3 py-2 text-sm focus:border-primary/50 focus:outline-none"
                          placeholder="Category name"
                        />
                      </td>
                      <td className="px-3 py-2 text-right">
                        <div className="flex gap-2 justify-end">
                          <PrimaryButton onClick={handleUpdateCategory}>
                            Save
                          </PrimaryButton>
                          <button
                            onClick={() => setIsEditing(null)}
                            className="px-3 py-1.5 text-medium-gray text-xs hover:text-white transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td
                        onClick={() => handleEditCategory(category.id)}
                        className="px-3 py-2 text-foreground cursor-pointer hover:text-primary transition-colors"
                      >
                        {category.name?.toUpperCase()}
                      </td>
                      <td className="px-3 py-2 text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() =>
                              category.id && handleDeleteCategory(category.id)
                            }
                            className="text-primary hover:text-white transition-colors text-xs"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}

              {isAdding && (
                <tr className="bg-background">
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={nameCategory}
                      onChange={(e) => setNameCategory(e.target.value)}
                      className="w-full bg-background border border-[var(--color-border)/0.08] rounded px-3 py-2 text-sm focus:border-primary/50 focus:outline-none"
                      placeholder="Category name"
                    />
                  </td>
                  <td className="px-3 py-2 text-right">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={handleSaveCategory}
                        className="px-3 py-1.5 bg-primary text-white text-xs font-semibold rounded hover:brightness-110 transition-all"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setIsAdding(false)}
                        className="px-3 py-1.5 text-medium-gray text-xs hover:text-white transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {categories.length === 0 && !isAdding && (
            <p className="text-center text-dim-gray py-8">No categories yet</p>
          )}
        </div>
      </section>
    </div>
  );
}

export { Categories };
