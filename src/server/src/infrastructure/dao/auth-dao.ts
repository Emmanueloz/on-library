import type { IUser } from "@on-library/shared";
import type { IAuthRepo } from "../../application/features/auth/auth-repo.ts";
import type { PrismaClient } from "../../../prisma/prisma-client/client.ts";

class AuthDao implements IAuthRepo {
  private client: PrismaClient;

  constructor(client: PrismaClient) {
    this.client = client;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await this.client.user.findUnique({
      where: { email },
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

  async findByUsername(username: string): Promise<IUser | null> {
    return await this.client.user.findFirst({
      where: { username },
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

  async create(
    input: Omit<IUser, "id" | "createdAt" | "libraries">,
  ): Promise<IUser> {
    const permissions = await this.client.permissions.findMany({
      include: { userPermissions: true },
      where: {
        OR: [
          {
            // Condición 1: No son 'users' Y son 'READ'
            AND: [{ name: { not: "users" } }, { type: "READ" }],
          },
          {
            // Condición 2: Todos los de 'libraries'
            name: "libraries",
          },
          {
            // Condición 3: Todos los de 'books'
            name: "following",
          },
          {
            // Condición 4: Todos los de 'history'
            name: "history",
          },
        ],
      },
    });

    console.log("permisions", permissions);

    return await this.client.user.create({
      data: {
        username: input.username,
        email: input.email,
        password: input.password,
        userPermissions: {
          createMany: {
            data: permissions.map((p) => ({
              idPermission: p.id,
            })),
          },
        },
      },
      include: {
        userPermissions: {
          include: {
            permission: true,
          },
        },
      },
    });
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

  async update(id: string, data: Partial<IUser>): Promise<IUser | null> {
    return await this.client.user.update({
      where: { id },
      data: {
        ...(data.username && { username: data.username }),
        ...(data.email && { email: data.email }),
        ...(data.password && { password: data.password }),
      },
      include: {
        userPermissions: {
          include: {
            permission: true,
          },
        },
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.client.user.delete({ where: { id } });
  }
}

export { AuthDao };
