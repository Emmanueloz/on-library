import type { IUser, ILibraries, IUserPayload } from "@on-library/shared";
import type { IUsersRepo } from "./users-repo.ts";
import type { EncryptService } from "../auth/encrypt-service.port.ts";

class UsersService {
  private readonly repo: IUsersRepo;
  private readonly encryptService: EncryptService;

  constructor(repo: IUsersRepo, encryptService: EncryptService) {
    this.repo = repo;
    this.encryptService = encryptService;

  }

  async query(): Promise<IUserPayload[]> {
    const users = await this.repo.query();
    return users.map((user) => this.mapUserWithPermissions(user));
  }

  async findById(id: string): Promise<IUserPayload | null> {
    const user = await this.repo.findById(id);
    if (!user) return null;
    return this.mapUserWithPermissions(user);
  }

  async resetPassword(userId: string, newPassword: string): Promise<void> {
    const hashedPassword = await this.encryptService.hashPassword(newPassword);
    return this.repo.resetPassword(userId, hashedPassword);
  }

  async getPermissions(userId: string): Promise<Record<string, string[]>> {
    return this.repo.getPermissionsByUserId(userId);
  }

  async updatePermissions(
    userId: string,
    permissions: Array<{ module: string; type: string }>,
  ): Promise<void> {
    return this.repo.updatePermissions(userId, permissions);
  }

  async deletePermissions(
    userId: string,
    permissions: Array<{ module: string; type: string }>,
  ): Promise<void> {
    return this.repo.deletePermissions(userId, permissions);
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

  private mapUserWithPermissions(user: IUser): IUserPayload {
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
      permissions,
    };
  }
}

export { UsersService };
