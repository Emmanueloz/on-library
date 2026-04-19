import type { IUser } from "@on-library/shared";
import type { ILibraries } from "@on-library/shared";

interface IUsersRepo {
  findAll(): Promise<IUser[]>;
  findById(id: string): Promise<IUser | null>;
  update(id: string, user: Partial<IUser>): Promise<IUser | null>;
  resetPassword(userId: string, newPassword: string): Promise<void>;
  getPermissionsByUserId(userId: string): Promise<Record<string, string[]>>;
  setPermissions(userId: string, permissions: Array<{ module: string; type: string }>): Promise<void>;
  getLibrariesByUserId(userId: string): Promise<ILibraries[]>;
  delete(userId: string): Promise<void>;
}

export type { IUsersRepo };