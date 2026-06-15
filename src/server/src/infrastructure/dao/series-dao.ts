import type { ISeries } from "@on-library/shared";
import type { IQuerySeries } from "../../application/features/series/query-series.ts";
import type { ISeriesRepo } from "../../application/features/series/series-repo.ts";
import type { PrismaClient } from "../../../prisma/prisma-client/client.ts";
import type {
  ICreateSerie,
  IUpdateSeries,
} from "../../application/features/series/serie.interface.ts";

class SeriesDao implements ISeriesRepo {
  private client: PrismaClient;

  constructor(client: PrismaClient) {
    this.client = client;
  }

  async query(q?: IQuerySeries): Promise<ISeries[]> {
    return await this.client.series.findMany({
      include: {
        category: true,
        tagsOnSeries: {
          include: {
            tag: true,
          },
        },
      },
    });
  }

  async getById(id: string): Promise<ISeries | null> {
    return await this.client.series.findUnique({
      where: { id },
      include: {
        category: true,
        tagsOnSeries: {
          include: {
            tag: true,
          },
        },
        chapters: {
          orderBy: {
            number: "asc",
          },
        },
      },
    });
  }

  async create(series: ICreateSerie): Promise<ISeries> {
    return (await this.client.series.create({
      data: {
        title: series.title,
        pictureUrl: series.pictureUrl,
        description: series.description,
        author: series.author,
        publicationDate: series.publicationDate,
        idCategory: series.idCategory,
        tagsOnSeries: {
          createMany: {
            data: series.tags.map((idTag) => ({
              idTag,
            })),
          },
        },
      },
      include: {
        category: true,
        tagsOnSeries: {
          include: { tag: true },
        },
      },
    })) as ISeries;
  }
  async update(id: string, series: IUpdateSeries): Promise<ISeries | null> {
    const data: any = {};
    if (series.title) data.title = series.title;
    if (series.pictureUrl) data.pictureUrl = series.pictureUrl;
    if (series.description) data.description = series.description;
    if (series.author) data.author = series.author;
    if (series.publicationDate) data.publicationDate = series.publicationDate;
    if (series.idCategory) data.idCategory = series.idCategory;

    if (series.tags && series.tags.length > 0) {
      data.tagsOnSeries = {
        createMany: {
          data: series.tags.map((idTag) => ({
            idTag,
          })),
        },
      };
    }

    return await this.client.series.update({
      where: { id },
      data,
      include: {
        category: true,
        tagsOnSeries: {
          include: { tag: true },
        },
      },
    });
  }

  async removeTags(idSeries: string, tagIds: string[]): Promise<void> {
    await this.client.tagsOnSeries.deleteMany({
      where: {
        idSeries,
        idTag: { in: tagIds },
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.client.series.delete({
      where: {
        id,
      },
    });
  }
}

export { SeriesDao };
