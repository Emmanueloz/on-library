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
    const where: any = {};
    const orderBy: any = {};

    if (q?.idSeries) {
      where.idSeries = q.idSeries;
    }

    if (q?.title) {
      where.title = { contains: q.title };
    }

    if (q?.number) {
      where.number = q.number;
    }

    if (q?.orderBy && q.orderType) {
      if (q.orderBy == "number") {
        orderBy.number = q.orderType;
      } else if (q.orderBy == "createdAt") {
        orderBy.createdAt = q.orderType;
      }
    }

    const chapters = await this.client.chapter.findMany({
      where: where,
      orderBy: orderBy,
      select: {
        id: true,
        title: true,
        number: true,
        idSeries: true,
        createdAt: true,
        series: {
          select: {
            id: true,
            title: true,
            pictureUrl: true,
            category: {
              select: {
                name: true,
              },
            },
          },
        },
        _count: {
          select: { pages: true },
        },
      },
    });

    return chapters.map(({ id, title, number, idSeries, series, _count }) => ({
      id,
      title,
      number,
      idSeries,
      series,
      pagesCount: _count.pages,
    }));
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

  async update(id: string, chapter: Partial<IChapter>): Promise<IChapter | null> {
    const data : any = {};

    if (chapter.title) data.title = chapter.title;
    if (chapter.number) data.number = chapter.number;

    return await this.client.chapter.update({
      where: { id },
      data
    });
  }

  async delete(id: string): Promise<void> {
    await this.client.chapter.delete({
      where: { id },
    });
  }
}

export { ChaptersDao };
