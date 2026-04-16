import type { IChapter } from "@on-library/shared";
import type { IChaptersRepo } from "../../application/features/chapters/chapters-repo.ts";
import type { PrismaClient } from "../../../prisma/prisma-client/client.ts";
import type { IQueryChapters } from "../../application/features/chapters/query-chapters.ts";

class ChaptersDao implements IChaptersRepo {
  private client: PrismaClient;

  constructor(client: PrismaClient) {
    this.client = client;
  }

  async query(q?: IQueryChapters): Promise<IChapter[]> {
    if (q) {
      const where: any = {};

      if (q.idSeries) {
        where.idSeries = q.idSeries;
      }

      if (q.title) {
        where.title = { contains: q.title };
      }

      if (q.number) {
        where.number = q.number;
      }

      return await this.client.chapter.findMany({
        where: where,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          series: {
            omit: {
              author: true,
              description: true,
              idCategory: true,
              createdAt: true,
              publicationDate: true,
            },
            include: {
              category: {
                omit: {
                  createdAt: true,
                  id: true,
                },
              },
            },
          },
        },
      });
    }

    return await this.client.chapter.findMany();
  }

  async getById(id: string): Promise<IChapter | null> {
    return await this.client.chapter.findUnique({
      where: { id },
      include: {
        pages: true,
        series: true,
      },
    });
  }

  async create(chapter: Omit<IChapter, "id">): Promise<IChapter> {
    return await this.client.chapter.create({
      data: {
        title: chapter.title,
        number: chapter.number,
        idSeries: chapter.idSeries,
      },
    });
  }

  async update(id: string, chapter: IChapter): Promise<IChapter | null> {
    return await this.client.chapter.update({
      where: { id },
      data: {
        title: chapter.title,
        number: chapter.number,
        idSeries: chapter.idSeries,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.client.chapter.delete({
      where: { id },
    });
  }
}

export { ChaptersDao };
