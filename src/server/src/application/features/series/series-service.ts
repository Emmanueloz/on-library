import type { ISeries } from "@on-library/shared";
import type { IQuerySeries } from "./query-series.ts";
import type { ISeriesRepo } from "./series-repo.ts";

class SeriesService {
  protected readonly seriesRepo: ISeriesRepo;
  
  constructor(seriesRepo: ISeriesRepo) {
    this.seriesRepo = seriesRepo;
  }
  async query(query?: IQuerySeries): Promise<ISeries[]> {
    return await this.seriesRepo.query(query);
  }
  async getById(id: string): Promise<ISeries> {
    return await this.seriesRepo.getById(id);
  }
  async create(series: ISeries): Promise<ISeries> {
    return await this.seriesRepo.create(series);
  }
  async update(id: string, series: ISeries): Promise<ISeries | null> {
    return await this.seriesRepo.update(id, series);
  }
  async delete(id: string): Promise<void> {
    return await this.seriesRepo.delete(id);
  }
}

export { SeriesService };