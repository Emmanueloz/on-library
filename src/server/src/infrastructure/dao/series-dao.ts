import type { ISeries } from "@on-library/shared";
import type { IQuerySeries } from "../../application/features/series/query-series.ts";
import type { ISeriesRepo } from "../../application/features/series/series-repo.ts";
import type { PrismaClient } from "../../../prisma/prisma-client/client.ts";

class SeriesDao implements ISeriesRepo {
  private client: PrismaClient;

  constructor(client: PrismaClient) {
    this.client = client;
  }

  async query(query?: IQuerySeries): Promise<ISeries[]> {
    const series = await this.client.series.findMany({
      include: {
        category: true,
        tagsOnSeries: {
          include: {
            tag: true,
          },
        },
      },
    });

    console.log(series);

    return series;
  }
  async getById(id: string): Promise<ISeries> {
    throw new Error("Method not implemented.");
  }
  async create(series: Omit<ISeries, "id">): Promise<ISeries> {
    return await this.client.series.create({
      data: {
        title: series.title,
        description: series.description,
        author: series.author,
        publicationDate: series.publicationDate,
        idCategory: series.idCategory,
      },
    });
  }
  async update(id: string, series: Partial<ISeries>): Promise<ISeries> {
    throw new Error("Method not implemented.");
  }
  async delete(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}

export { SeriesDao };
