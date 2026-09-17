import type { IBookmark, MediaType } from "@on-library/shared";
import type { PrismaClient } from "../../../prisma/prisma-client/client.ts";
import type { IBookmarkRepo } from "../../application/features/bookmark/bookmark-repo.ts";

class BookmarkDao implements IBookmarkRepo {
  private client: PrismaClient;

  constructor(client: PrismaClient) {
    this.client = client;
  }

  async getByUserAndChapter(
    userId: string,
    idChapter: string,
  ): Promise<IBookmark[]> {
    const result = await this.client.bookmark.findMany({
      where: { idUser: userId, idChapter },
      orderBy: { page: "asc" },
    });

    return result as IBookmark[];
  }

  async findByPage(
    userId: string,
    idChapter: string,
    type: MediaType,
    page: number,
  ): Promise<IBookmark | null> {
    const result = await this.client.bookmark.findUnique({
      where: {
        idUser_idChapter_type_page: {
          idUser: userId,
          idChapter,
          type,
          page,
        },
      },
    });

    return result as IBookmark | null;
  }

  async findById(id: string): Promise<IBookmark | null> {
    const result = await this.client.bookmark.findUnique({
      where: { id },
    });

    return result as IBookmark | null;
  }

  async create(
    userId: string,
    idChapter: string,
    type: MediaType,
    page: number,
  ): Promise<IBookmark> {
    const result = await this.client.bookmark.create({
      data: {
        idUser: userId,
        idChapter,
        type,
        page,
      },
    });

    return result as IBookmark;
  }

  async deleteById(id: string): Promise<void> {
    await this.client.bookmark.delete({
      where: { id },
    });
  }

  async deleteByUserAndChapter(
    userId: string,
    idChapter: string,
  ): Promise<void> {
    await this.client.bookmark.deleteMany({
      where: { idUser: userId, idChapter },
    });
  }

  async deleteByUserAndSerie(userId: string, idSerie: string): Promise<void> {
    await this.client.bookmark.deleteMany({
      where: {
        idUser: userId,
        chapter: { idSeries: idSerie },
      },
    });
  }
}

export { BookmarkDao };
