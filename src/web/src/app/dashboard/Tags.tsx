import { use, useState } from "react";
import { useTags } from "../../hooks/useTags";
import { PrimaryButton } from "../../components/common/PrimaryButton";
import { AuthContext } from "../../context/AuthContex";
import { ModulePermission, TypePermission } from "@on-library/shared";
import { PermissionGate } from "../../components/common/PermissionGate";

function Tags() {
  const { tags, errorTags, isLoading, addTag, updateTag, deleteTag } =
    useTags();

  const [nameTag, setNameTag] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);

  const authContext = use(AuthContext);

  if (!authContext) {
    throw new Error("useAuth must be used within a AuthProvider");
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-medium-gray">loading...</p>
      </div>
    );
  }

  const handleAddTag = () => {
    setIsAdding(true);
    setNameTag("");
  };

  const handleSaveTag = async () => {
    if (!nameTag.trim()) return;
    try {
      await addTag({ name: nameTag });
      setNameTag("");
      setIsAdding(false);
    } catch {
      // Error handled in hook
    }
  };

  const handleEditTag = (id?: string) => {
    if (
      !authContext.hasSinglePermission(
        ModulePermission.Tags,
        TypePermission.Write,
      )
    )
      return;

    setIsEditing(id ?? null);
    const tag = tags.find((t) => t.id === id);
    if (tag) {
      setNameTag(tag.name);
    }
  };

  const handleUpdateTag = async () => {
    if (!isEditing || !nameTag.trim()) return;
    try {
      await updateTag(isEditing, { name: nameTag });
      setNameTag("");
      setIsEditing(null);
    } catch {
      // Error handled in hook
    }
  };

  const handleDeleteTag = async (id: string) => {
    try {
      await deleteTag(id);
    } catch {
      // Error handled in hook
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Tags</h1>
          <p className="text-sm text-medium-gray">Manage your tags</p>
        </div>
        <PermissionGate
          module={ModulePermission.Tags}
          permission={TypePermission.Write}
        >
          <PrimaryButton
            onClick={handleAddTag}
            disabled={isAdding || isEditing !== null}
          >
            + New Tag
          </PrimaryButton>
        </PermissionGate>
      </div>

      {errorTags && <p className="text-primary text-sm">{errorTags}</p>}

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
              {isAdding && (
                <tr className="bg-background">
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={nameTag}
                      onChange={(e) => setNameTag(e.target.value)}
                      className="w-full bg-background border border-[var(--color-border)/0.08] rounded px-3 py-2 text-sm focus:border-primary/50 focus:outline-none"
                      placeholder="Tag name"
                    />
                  </td>
                  <td className="px-3 py-2 text-right">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={handleSaveTag}
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

              {tags.map((tag) => (
                <tr
                  key={tag.id}
                  className="hover:bg-background transition-colors"
                >
                  {isEditing === tag.id ? (
                    <>
                      <td className="px-3 py-2">
                        <input
                          type="text"
                          value={nameTag}
                          onChange={(e) => setNameTag(e.target.value)}
                          className="w-full bg-background border border-[var(--color-border)/0.08] rounded px-3 py-2 text-sm focus:border-primary/50 focus:outline-none"
                          placeholder="Tag name"
                        />
                      </td>
                      <td className="px-3 py-2 text-right">
                        <div className="flex gap-2 justify-end">
                          <PrimaryButton onClick={handleUpdateTag}>
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
                        onClick={() => handleEditTag(tag.id)}
                        className="px-3 py-2 text-foreground cursor-pointer hover:text-primary transition-colors"
                      >
                        {tag.name?.toUpperCase()}
                      </td>
                      <td className="px-3 py-2 text-right">
                        <div className="flex gap-2 justify-end">
                          <PermissionGate
                            module={ModulePermission.Tags}
                            permission={TypePermission.Delete}
                          >
                            <button
                              onClick={() => tag.id && handleDeleteTag(tag.id)}
                              className="text-primary hover:text-white transition-colors text-xs"
                            >
                              Delete
                            </button>
                          </PermissionGate>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {tags.length === 0 && !isAdding && (
            <p className="text-center text-dim-gray py-8">No tags yet</p>
          )}
        </div>
      </section>
    </div>
  );
}

export { Tags };
