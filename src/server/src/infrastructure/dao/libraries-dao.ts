import type { ILibraries } from "@on-library/shared";
import type { PrismaClient } from "../../../prisma/prisma-client/client.ts";
import type { ILibrariesRepo } from "../../application/features/libraries/libraries-repo.ts";

class LibrariesDao implements ILibrariesRepo {
  private client: PrismaClient;

  constructor(client: PrismaClient) {
    this.client = client;
  }

  async query(name: string): Promise<ILibraries[]> {
    return await this.client.libraries.findMany();
  }
  async getById(id: string): Promise<ILibraries | null> {
    return await this.client.libraries.findUnique({
      where: {
        id,
      },
      include: {
        librariesOnSeries: true,
      },
    });
  }
  async create(library: Omit<ILibraries, "id">): Promise<ILibraries> {
    throw new Error("Method not implemented.");
  }
  async addSerie(id: string, idSerie: String): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async update(
    id: string,
    library: Partial<ILibraries>,
  ): Promise<ILibraries | null> {
    throw new Error("Method not implemented.");
  }
  async delete(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}

export { LibrariesDao };
