import { use, useState } from "react";
import { useUsers } from "../../hooks/useUsers";
import { AuthContext } from "../../context/AuthContex";
import type { IUserPayload, ILibraries } from "@on-library/shared";
import { UserModal } from "../../components/Dashboard/UserModal";

function Users() {
  const {
    users,
    isLoading,
    errorUsers,
    addPermissions,
    removePermissions,
    fetchUserLibraries,
    resetPassword,
    deleteUser,
  } = useUsers();

  const [selectedUser, setSelectedUser] = useState<IUserPayload | null>(null);
  const [originalPermissions, setOriginalPermissions] = useState<
    Record<string, string[]>
  >({});
  const [userLibraries, setUserLibraries] = useState<ILibraries[]>([]);

  const authContext = use(AuthContext);

  if (!authContext) {
    throw new Error("useAuth must be used within a AuthProvider");
  }

  if (isLoading) {
    return (
      <div className="h-full bg-background flex items-center justify-center">
        <p className="text-medium-gray">loading...</p>
      </div>
    );
  }

  const handleSelectUser = async (user: IUserPayload) => {
    setSelectedUser(user);
    const userPerms = user.permissions || {};
    setOriginalPermissions(userPerms);
    if (user.id) {
      const libs = await fetchUserLibraries(user.id);
      setUserLibraries(libs);
    }
  };

  const handleSavePermissions = (
    permissions: Record<string, string[]>,
  ) => {
    setOriginalPermissions(permissions);
  };

  const handleUserDeleted = () => {
    setSelectedUser(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Users</h1>
        <p className="text-sm text-medium-gray">
          Manage users and their permissions
        </p>
      </div>

      {errorUsers && <p className="text-primary text-sm">{errorUsers}</p>}

      <section className="bg-surface border border-[var(--color-border)/0.06] rounded-xl p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-semibold text-medium-gray uppercase">
                  Username
                </th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-medium-gray uppercase">
                  Email
                </th>
                <th className="px-3 py-2 text-right text-xs font-semibold text-medium-gray uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className={`hover:bg-background transition-colors cursor-pointer ${
                    selectedUser?.id === user.id ? "bg-primary/5" : ""
                  }`}
                  onClick={() => handleSelectUser(user)}
                >
                  <td className="px-3 py-2 text-foreground font-medium">
                    {user.username}
                  </td>
                  <td className="px-3 py-2 text-medium-gray">{user.email}</td>
                  <td className="px-3 py-2 text-right">
                    <span className="text-xs text-dim-gray">
                      {selectedUser?.id === user.id
                        ? "Selected"
                        : "Click to select"}
                    </span>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="px-3 py-8 text-center text-dim-gray"
                  >
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {selectedUser && (
        <UserModal
          user={selectedUser}
          libraries={userLibraries}
          originalPermissions={originalPermissions}
          onClose={() => setSelectedUser(null)}
          onAddPermissions={addPermissions}
          onRemovePermissions={removePermissions}
          onSavePermissions={handleSavePermissions}
          onResetPassword={resetPassword}
          onDeleteUser={deleteUser}
          onUserDeleted={handleUserDeleted}
        />
      )}
    </div>
  );
}

export { Users };
