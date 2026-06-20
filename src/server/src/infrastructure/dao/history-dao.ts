import type { PrismaClient } from "../../../prisma/prisma-client/client.ts";
import type { IReadChaptersRepo } from "../../application/features/history/history-repo.ts";

class ReadChaptersDao implements IReadChaptersRepo {
  private client: PrismaClient;

  constructor(client: PrismaClient) {
    this.client = client;
  }

  async getReadChapterIds(userId: string, idSerie: string): Promise<string[]> {
    const result = await this.client.readChapters.findMany({
      where: {
        idUser: userId,
        chapter: {
          idSeries: idSerie,
        },
      },
      select: {
        idChapter: true,
      },
    });

    return result.map((rc) => rc.idChapter);
  }

  async markAsRead(userId: string, idChapter: string): Promise<void> {
    await this.client.readChapters.upsert({
      where: {
        idUser_idChapter: {
          idUser: userId,
          idChapter: idChapter,
        },
      },
      create: {
        idUser: userId,
        idChapter: idChapter,
      },
      update: {},
    });
  }

  async markAsUnread(userId: string, idChapter: string): Promise<void> {
    await this.client.readChapters.deleteMany({
      where: {
        idUser: userId,
        idChapter: idChapter,
      },
    });
  }

  async markRangeAsRead(
    userId: string,
    idSerie: string,
    upToChapterId: string,
  ): Promise<void> {
    const chapters = await this.client.chapter.findMany({
      where: {
        idSeries: idSerie,
      },
      select: {
        id: true,
        number: true,
      },
      orderBy: {
        number: "asc",
      },
    });

    const upToChapter = await this.client.chapter.findUnique({
      where: { id: upToChapterId },
    });

    if (!upToChapter) return;

    const chaptersToMark = chapters.filter(
      (c) => c.number <= upToChapter.number,
    );

    await Promise.all(
      chaptersToMark.map((c) =>
        this.client.readChapters.upsert({
          where: {
            idUser_idChapter: {
              idUser: userId,
              idChapter: c.id,
            },
          },
          create: {
            idUser: userId,
            idChapter: c.id,
          },
          update: {},
        }),
      ),
    );
  }

  async deleteByUserAndSerie(userId: string, idSerie: string): Promise<void> {
    await this.client.readChapters.deleteMany({
      where: {
        idUser: userId,
        chapter: {
          idSeries: idSerie,
        },
      },
    });
  }

  async getReadChaptersBySerie(userId: string, idSerie: string): Promise<any[]> {
    const result = await this.client.readChapters.findMany({
      where: {
        idUser: userId,
        chapter: {
          idSeries: idSerie,
        },
      },
      include: {
        chapter: {
          select: {
            id: true,
            title: true,
            number: true,
          },
        },
      },
      orderBy: {
        chapter: {
          number: "asc",
        },
      },
    });

    return result.map((rc) => ({
      id: rc.id,
      idChapter: rc.idChapter,
      readAt: rc.readAt,
      chapter: rc.chapter,
    }));
  }
}

export { ReadChaptersDao };
