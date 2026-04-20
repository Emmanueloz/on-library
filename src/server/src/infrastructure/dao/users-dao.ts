import type { IUser, ILibraries } from "@on-library/shared";
import type { IUsersRepo } from "../../application/features/users/users-repo.ts";
import type { PrismaClient } from "../../../prisma/prisma-client/client.ts";

class UsersDao implements IUsersRepo {
  private client: PrismaClient;

  constructor(client: PrismaClient) {
    this.client = client;
  }

  async query(): Promise<IUser[]> {
    return await this.client.user.findMany({
      include: {
        userPermissions: {
          include: {
            permission: true,
          },
        },
      },
    });
  }

  async findById(id: string): Promise<IUser | null> {
    return await this.client.user.findUnique({
      where: { id },
      include: {
        userPermissions: {
          include: {
            permission: true,
          },
        },
        libraries: true,
      },
    });
  }

  async resetPassword(userId: string, newPassword: string): Promise<void> {
    await this.client.user.update({
      where: { id: userId },
      data: { password: newPassword },
    });
  }

  async getPermissionsByUserId(
    userId: string,
  ): Promise<Record<string, string[]>> {
    const user = await this.client.user.findUnique({
      where: { id: userId },
      include: {
        userPermissions: {
          include: {
            permission: true,
          },
        },
      },
    });

    if (!user) return {};

    return user.userPermissions.reduce(
      (acc, up) => {
        const moduleName = up.permission.name;
        const permType = up.permission.type.toLowerCase();
        if (!acc[moduleName]) {
          acc[moduleName] = [];
        }
        acc[moduleName].push(permType);
        return acc;
      },
      {} as Record<string, string[]>,
    );
  }

  async updatePermissions(
    userId: string,
    permissions: Array<{ module: string; type: string }>,
  ): Promise<void> {
    const orConditions = permissions.map((p) => ({
      name: p.module,
      type: p.type as "READ" | "WRITE" | "DELETE",
    }));

    const permissionRecords = await this.client.permissions.findMany({
      where: {
        OR: orConditions,
      },
    });

    await this.client.userPermissions.createMany({
      data: permissionRecords.map((p) => ({
        idUser: userId,
        idPermission: p.id,
      })),
    });
  }

  async deletePermissions(
    userId: string,
    permissions: Array<{ module: string; type: string }>,
  ): Promise<void> {
    const orConditions = permissions.map((p) => ({
      name: p.module,
      type: p.type as "READ" | "WRITE" | "DELETE",
    }));

    const permissionRecords = await this.client.permissions.findMany({
      where: {
        OR: orConditions,
      },
    });

    await this.client.userPermissions.deleteMany({
      where: {
        idUser: userId,
        idPermission: {
          in: permissionRecords.map((p) => p.id),
        },
      },
    });
  }

  async getLibrariesByUserId(userId: string): Promise<ILibraries[]> {
    return await this.client.libraries.findMany({
      where: { idUser: userId },
    });
  }

  async delete(userId: string): Promise<void> {
    await this.client.user.delete({ where: { id: userId } });
  }
}

export { UsersDao };
