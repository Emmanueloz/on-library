import { useState } from "react";
import { Link } from "react-router";
import {
  ModulePermission,
  TypePermission,
  type IUserPayload,
  type ILibraries,
} from "@on-library/shared";
import { PrimaryButton } from "../common/PrimaryButton";

interface PermissionEntry {
  module: string;
  type: string;
}

interface UserModalProps {
  user: IUserPayload;
  libraries: ILibraries[];
  originalPermissions: Record<string, string[]>;
  onClose: () => void;
  onAddPermissions: (userId: string, permissions: PermissionEntry[]) => Promise<unknown>;
  onRemovePermissions: (userId: string, permissions: PermissionEntry[]) => Promise<unknown>;
  onSavePermissions: ( permissions: Record<string, string[]>) => void;
  onResetPassword: (userId: string, newPassword: string) => Promise<unknown>;
  onDeleteUser: (userId: string) => Promise<unknown>;
  onUserDeleted: () => void;
}

const modules = Object.values(ModulePermission);
const types = Object.values(TypePermission);

type Tab = "permissions" | "libraries" | "account";

function UserModal({
  user,
  libraries,
  originalPermissions,
  onClose,
  onAddPermissions,
  onRemovePermissions,
  onSavePermissions,
  onResetPassword,
  onDeleteUser,
  onUserDeleted,
}: UserModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>("permissions");
  const [localPermissions, setLocalPermissions] = useState<
    Record<string, string[]>
  >(user.permissions || {});
  const [isSaving, setIsSaving] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  const [confirmUsername, setConfirmUsername] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleTogglePermission = (module: string, type: string) => {
    setLocalPermissions((prev) => {
      const current = prev[module] || [];
      const hasPermission = current.includes(type);
      return {
        ...prev,
        [module]: hasPermission
          ? current.filter((p) => p !== type)
          : [...current, type],
      };
    });
  };

  const handleSavePermissions = async () => {
    setIsSaving(true);

    const allModules = new Set([
      ...Object.keys(originalPermissions),
      ...Object.keys(localPermissions),
    ]);

    const toAdd: PermissionEntry[] = [];
    const toRemove: PermissionEntry[] = [];

    for (const mod of allModules) {
      const origTypes = new Set(originalPermissions[mod] || []);
      const newTypes = new Set(localPermissions[mod] || []);

      for (const type of newTypes) {
        if (!origTypes.has(type)) {
          toAdd.push({ module: mod, type });
        }
      }

      for (const type of origTypes) {
        if (!newTypes.has(type)) {
          toRemove.push({ module: mod, type });
        }
      }
    }

    if (toAdd.length > 0) {
      await onAddPermissions(user.id, toAdd);
    }
    if (toRemove.length > 0) {
      await onRemovePermissions(user.id, toRemove);
    }

    onSavePermissions(localPermissions);
    setIsSaving(false);
  };

  const handleResetPassword = async () => {
    if (!newPassword.trim()) return;
    setIsResetting(true);
    await onResetPassword(user.id, newPassword);
    setNewPassword("");
    setIsResetting(false);
  };

  const handleDeleteUser = async () => {
    setIsDeleting(true);
    await onDeleteUser(user.id);
    onUserDeleted();
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: "permissions", label: "Permissions" },
    { key: "libraries", label: "Libraries" },
    { key: "account", label: "Account" },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface border border-[var(--color-border)/0.06] rounded-xl w-full max-w-2xl h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">
            {user.username}
          </h2>
          <button
            onClick={onClose}
            className="text-dim-gray hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border px-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? "border-primary text-foreground"
                  : "border-transparent text-medium-gray hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {activeTab === "permissions" && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-medium-gray uppercase">
                      Module
                    </th>
                    {types.map((type) => (
                      <th
                        key={type}
                        className="px-3 py-2 text-center text-xs font-semibold text-medium-gray uppercase"
                      >
                        {type}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {modules.map((module) => (
                    <tr
                      key={module}
                      className="hover:bg-background transition-colors"
                    >
                      <td className="px-3 py-2 text-foreground capitalize">
                        {module}
                      </td>
                      {types.map((type) => (
                        <td key={type} className="px-3 py-2 text-center">
                          <input
                            type="checkbox"
                            checked={
                              localPermissions[module]?.includes(type) || false
                            }
                            onChange={() =>
                              handleTogglePermission(module, type)
                            }
                            className="w-4 h-4 rounded border-border text-primary focus:ring-primary/50 bg-background"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "libraries" && (
            <div>
              {libraries.length === 0 ? (
                <p className="text-dim-gray text-sm">No libraries found</p>
              ) : (
                <div className="space-y-2">
                  {libraries.map((lib) => (
                    <Link
                      key={lib.id}
                      to={`/libraries/${lib.id}`}
                      className="flex items-center justify-between px-3 py-2 bg-background rounded-lg border border-[var(--color-border)/0.06] hover:border-primary/30 transition-all"
                    >
                      <span className="text-sm text-foreground">{lib.name}</span>
                      <span className="text-xs text-dim-gray">
                        {lib.seriesCount ?? lib.series?.length ?? 0} series
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "account" && (
            <div className="space-y-8">
              {/* Password Reset */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  Password Reset
                </h3>
                <div className="flex gap-2">
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password"
                    className="flex-1 bg-background border border-[var(--color-border)/0.08] rounded px-3 py-2 text-sm focus:border-primary/50 focus:outline-none"
                  />
                  <PrimaryButton
                    onClick={handleResetPassword}
                    disabled={isResetting || !newPassword.trim()}
                  >
                    {isResetting ? "Resetting..." : "Reset Password"}
                  </PrimaryButton>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="border border-primary/30 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-primary mb-3">
                  Danger Zone
                </h3>
                <p className="text-xs text-medium-gray mb-3">
                  To confirm, type the username:{" "}
                  <span className="text-foreground font-medium">
                    {user.username}
                  </span>
                </p>
                <input
                  type="text"
                  value={confirmUsername}
                  onChange={(e) => setConfirmUsername(e.target.value)}
                  placeholder="Type username to confirm"
                  className="w-full bg-background border border-[var(--color-border)/0.08] rounded px-3 py-2 text-sm focus:border-primary/50 focus:outline-none mb-3"
                />
                <button
                  onClick={handleDeleteUser}
                  disabled={isDeleting || confirmUsername !== user.username}
                  className="px-4 py-2 text-sm font-semibold bg-primary/20 text-primary border border-primary/30 rounded-lg hover:bg-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isDeleting ? "Deleting..." : "Delete User"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border">
          {activeTab === "permissions" ? (
            <PrimaryButton
              onClick={handleSavePermissions}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save Permissions"}
            </PrimaryButton>
          ) : (
            <div />
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 text-medium-gray text-sm hover:text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export { UserModal };
