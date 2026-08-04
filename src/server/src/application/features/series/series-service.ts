import type { ISeries } from "@on-library/shared";
import type { IQuerySeries } from "./query-series.ts";
import type { ISeriesRepo } from "./series-repo.ts";
import type { ICreateSerie, IUpdateSeries } from "./serie.interface.ts";

class SeriesService {
  protected readonly seriesRepo: ISeriesRepo;

  constructor(seriesRepo: ISeriesRepo) {
    this.seriesRepo = seriesRepo;
  }
  async query(q?: IQuerySeries): Promise<ISeries[]> {
    return await this.seriesRepo.query(q);
  }
  async getById(id: string): Promise<ISeries | null> {
    return await this.seriesRepo.getById(id);
  }
  async getRecent(limit: number): Promise<ISeries[]> {
    return await this.seriesRepo.getRecent(limit);
  }
  async create(series: ICreateSerie): Promise<ISeries> {
    return await this.seriesRepo.create(series);
  }
  async update(id: string, series: IUpdateSeries): Promise<ISeries | null> {
    return await this.seriesRepo.update(id, series);
  }
  async delete(id: string): Promise<void> {
    return await this.seriesRepo.delete(id);
  }
  async removeTags(idSeries: string, tagIds: string[]): Promise<void> {
    return await this.seriesRepo.removeTags(idSeries, tagIds);
  }
}

export { SeriesService };
