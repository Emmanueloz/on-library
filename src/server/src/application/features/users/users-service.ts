import type { IUser, ILibraries } from "@on-library/shared";
import type { IUsersRepo } from "./users-repo.ts";

class UsersService {
  private repo: IUsersRepo;

  constructor(repo: IUsersRepo) {
    this.repo = repo;
  }

  async findAll(): Promise<IUserWithPermissions[]> {
    const users = await this.repo.findAll();
    return users.map((user) => this.mapUserWithPermissions(user));
  }

  async findById(id: string): Promise<IUserWithPermissions | null> {
    const user = await this.repo.findById(id);
    if (!user) return null;
    return this.mapUserWithPermissions(user);
  }

  async update(id: string, data: Partial<IUser>): Promise<IUserWithPermissions | null> {
    const user = await this.repo.update(id, data);
    if (!user) return null;
    return this.mapUserWithPermissions(user);
  }

  async resetPassword(userId: string, newPassword: string): Promise<void> {
    return this.repo.resetPassword(userId, newPassword);
  }

  async getPermissions(userId: string): Promise<Record<string, string[]>> {
    return this.repo.getPermissionsByUserId(userId);
  }

  async setPermissions(
    userId: string,
    permissions: Array<{ module: string; type: string }>
  ): Promise<void> {
    return this.repo.setPermissions(userId, permissions);
  }

  async getLibraries(userId: string): Promise<ILibraries[]> {
    return this.repo.getLibrariesByUserId(userId);
  }

  async delete(userId: string): Promise<void> {
    const user = await this.repo.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    await this.repo.delete(userId);
  }

  private mapUserWithPermissions(user: IUser): IUserWithPermissions {
    const permissions: Record<string, string[]> = {};
    for (const up of user.userPermissions || []) {
      const moduleName = up.permission.name;
      const permType = up.permission.type.toLowerCase();
      if (!permissions[moduleName]) {
        permissions[moduleName] = [];
      }
      permissions[moduleName].push(permType);
    }
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt || new Date(),
      permissions,
    };
  }
}

interface IUserWithPermissions {
  id: string;
  username: string;
  email: string;
  createdAt?: Date;
  permissions: Record<string, string[]>;
}

export { UsersService };
export type { IUserWithPermissions };