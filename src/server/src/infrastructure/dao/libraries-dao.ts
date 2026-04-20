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
      where: { id },
      include: {
        librariesOnSeries: true,
      },
    });
  }

  async getByIdAndUserId(
    id: string,
    userId: string,
  ): Promise<ILibraries | null> {
    const libraries = await this.client.libraries.findUnique({
      where: { id, idUser: userId },
      include: {
        librariesOnSeries: {
          select: {
            serie: {
              select: {
                id: true,
                title: true,
                description: true,
                pictureUrl: true,
                author: true,
                publicationDate: true,
                category: true,
                tagsOnSeries: {
                  select: {
                    tag: {
                      select: {
                        name: true,
                      },
                    },
                  },
                },
                // Aquí realizamos el conteo
                _count: {
                  select: { chapters: true },
                },
              },
            },
          },
        },
      },
    });

    return libraries;
  }

  async getByUserId(userId: string): Promise<ILibraries[]> {
    return await this.client.libraries.findMany({
      where: { idUser: userId },
    });
  }

  async existsSerie(idSerie: string): Promise<boolean> {
    const serie = await this.client.series.findUnique({
      where: { id: idSerie },
    });
    return !!serie;
  }

  async create(library: Omit<ILibraries, "id">): Promise<ILibraries> {
    const created = await this.client.libraries.create({
      data: {
        name: library.name,
        idUser: library.idUser,
        isPublic: library.isPublic ?? false,
      },
    });
    return created;
  }

  async addSerie(id: string, idSerie: string): Promise<void> {
    await this.client.librariesOnSeries.create({
      data: {
        idLibrary: id,
        idSerie,
      },
    });
  }

  async removeSerie(id: string, idSerie: string): Promise<void> {
    await this.client.librariesOnSeries.delete({
      where: {
        idSerie_idLibrary: {
          idSerie,
          idLibrary: id,
        },
      },
    });
  }

  async update(
    id: string,
    library: Partial<ILibraries>,
  ): Promise<ILibraries | null> {
    const updated = await this.client.libraries.update({
      where: { id },
      data: {
        ...(library.name && { name: library.name }),
        ...(library.isPublic !== undefined && { isPublic: library.isPublic }),
      },
    });
    return updated;
  }

  async delete(id: string): Promise<void> {
    await this.client.libraries.delete({ where: { id } });
  }
}

export { LibrariesDao };
