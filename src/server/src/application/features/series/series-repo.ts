import type { ISeries } from "@on-library/shared";
import type { IQuerySeries } from "./query-series.ts";

interface ISeriesRepo {
  query(query?: IQuerySeries): Promise<ISeries[]>;
  getById(id: string): Promise<ISeries>;
  create(series: Omit<ISeries, "id">): Promise<ISeries>;
  update(id: string, series: Partial<ISeries>): Promise<ISeries | null>;
  delete(id: string): Promise<void>;
}

export type { ISeriesRepo };
