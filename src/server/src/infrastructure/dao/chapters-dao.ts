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
    const orderBy: any[] = [] 
    
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
        orderBy.length = 0;
        orderBy.push({ groupNum: q.orderType }, { number: q.orderType });
      } else if (q.orderBy == "createdAt") {
        orderBy.length = 0;
        orderBy.push({ createdAt: q.orderType });
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
        groupNum: true,
        groupTitle: true,
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
          select: { media: true },
        },
      },
    });

    return chapters.map(({ id, title, number, idSeries, groupNum, groupTitle, series, _count }) => ({
      id,
      title,
      number,
      idSeries,
      groupNum: groupNum ?? null,
      groupTitle: groupTitle ?? null,
      series,
      mediaCount: _count.media,
    }));
  }

  async getById(id: string): Promise<IChapter | null> {
    const chapter = await this.client.chapter.findUnique({
      where: { id },
      include: {
        media: true,
        series: true,
      },
    });
    
    return chapter as IChapter | null;
  }

  async getLatestBySeries(limit: number): Promise<IChapter[]> {
    const chapters = await this.client.chapter.findMany({
      distinct: ['idSeries'],
      orderBy: [{ createdAt: 'desc'},{groupNum: 'desc'}, { number: 'desc' }],
      take: limit,
      where: {
        media: { some: {} },
      },
      select: {
        id: true,
        title: true,
        number: true,
        idSeries: true,
        groupNum: true,
        groupTitle: true,
        createdAt: true,
        series: {
          select: {
            id: true,
            title: true,
            pictureUrl: true,
            category: { select: { name: true } },
          },
        },
        _count: { select: { media: true } },
      },
    });

    const result = chapters.map(
      ({ id, title, number, idSeries, groupNum, groupTitle, series, _count }) => ({
        id,
        title,
        number,
        idSeries,
        groupNum: groupNum ?? null,
        groupTitle: groupTitle ?? null,
        series,
        mediaCount: _count.media,
      })
    );

    return result as IChapter[];
  }

  async create(chapter: Omit<IChapter, "id">): Promise<IChapter> {

    const data: any = {
      title: chapter.title,
      number: chapter.number,
      idSeries: chapter.idSeries,
    };

    if (chapter.groupNum !== undefined || chapter.groupNum !== null) data.groupNum = chapter.groupNum;
    if (chapter.groupTitle !== undefined || chapter.groupTitle !== null) data.groupTitle = chapter.groupTitle;

    console.log("Creating chapter with data:", data);

    return await this.client.chapter.create({
      data
    });
  }

  async createMany(chapters: Array<Omit<IChapter, "id">>): Promise<IChapter[]> {
    const first = chapters[0];
    if (!first) return [];

    await this.client.chapter.createMany({
      data: chapters.map((ch) => ({
        title: ch.title,
        number: ch.number,
        idSeries: ch.idSeries,
        groupNum: ch.groupNum ?? null,
        groupTitle: ch.groupTitle ?? null,
      })),
    });

    const created = await this.client.chapter.findMany({
      where: {
        idSeries: first.idSeries,
        number: { in: chapters.map((ch) => ch.number) },
      },
      orderBy: [
        { groupNum: "asc" },
        { number: "asc" },
      ],
    });

    return created;
  }

  async update(id: string, chapter: Partial<IChapter>): Promise<IChapter | null> {
    const data: any = {};

    if (chapter.title) data.title = chapter.title;
    if (chapter.number) data.number = chapter.number;
    if (chapter.groupNum !== undefined) data.groupNum = chapter.groupNum;
    if (chapter.groupTitle !== undefined) data.groupTitle = chapter.groupTitle;

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
