import type { PrismaClient } from "../../../prisma/prisma-client/client.ts";
import type { IFollowingRepo } from "../../application/features/following/following-repo.ts";

class FollowingDao implements IFollowingRepo {
  private client: PrismaClient;

  constructor(client: PrismaClient) {
    this.client = client;
  }

  async getByUserId(userId: string): Promise<any[]> {
    const result = await this.client.followingSeries.findMany({
      where: { idUser: userId },
      include: {
        serie: {
          select: {
            id: true,
            title: true,
            description: true,
            pictureUrl: true,
            author: true,
            publicationDate: true,
            category: {
              select: {
                id: true,
                name: true,
              },
            },
            chapters: {
              select: {
                id: true,
                number: true,
              },
              orderBy: {
                number: "desc",
              },
              take: 1,
            },
            _count: {
              select: {
                chapters: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return result.map((fs) => ({
      id: fs.id,
      idSerie: fs.idSerie,
      createdAt: fs.createdAt,
      serie: {
        id: fs.serie.id,
        title: fs.serie.title,
        description: fs.serie.description,
        pictureUrl: fs.serie.pictureUrl,
        author: fs.serie.author,
        publicationDate: fs.serie.publicationDate,
        category: fs.serie.category,
        chaptersCount: fs.serie._count.chapters,
        lastChapter: fs.serie.chapters[0] || null,
      },
    }));
  }

  async getByUserIdAndSerieId(
    userId: string,
    idSerie: string,
  ): Promise<any | null> {
    return await this.client.followingSeries.findUnique({
      where: {
        idUser_idSerie: {
          idUser: userId,
          idSerie: idSerie,
        },
      },
      include: {
        serie: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }

  async follow(userId: string, idSerie: string): Promise<void> {
    await this.client.followingSeries.create({
      data: {
        idUser: userId,
        idSerie: idSerie,
      },
    });
  }

  async unfollow(userId: string, idSerie: string): Promise<void> {
    await this.client.followingSeries.delete({
      where: {
        idUser_idSerie: {
          idUser: userId,
          idSerie: idSerie,
        },
      },
    });
  }

  async isFollowing(userId: string, idSerie: string): Promise<boolean> {
    const result = await this.client.followingSeries.findUnique({
      where: {
        idUser_idSerie: {
          idUser: userId,
          idSerie: idSerie,
        },
      },
    });
    return !!result;
  }
}

export { FollowingDao };