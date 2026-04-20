import type { IUser } from "@on-library/shared";
import type { ILibraries } from "@on-library/shared";

interface IUsersRepo {
  query(): Promise<IUser[]>;
  findById(id: string): Promise<IUser | null>;
  resetPassword(userId: string, newPassword: string): Promise<void>;
  getPermissionsByUserId(userId: string): Promise<Record<string, string[]>>;
  updatePermissions(
    userId: string,
    permissions: Array<{ module: string; type: string }>,
  ): Promise<void>;
  deletePermissions(
    userId: string,
    permissions: Array<{ module: string; type: string }>,
  ): Promise<void>;
  getLibrariesByUserId(userId: string): Promise<ILibraries[]>;
  delete(userId: string): Promise<void>;
}

export type { IUsersRepo };
