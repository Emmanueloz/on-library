import type { ISeries } from "@on-library/shared";
import type { IQuerySeries } from "./query-series.ts";
import type { ICreateSerie, IUpdateSeries } from "./serie.interface.ts";

interface ISeriesRepo {
  query(q?: IQuerySeries): Promise<ISeries[]>;
  getById(id: string): Promise<ISeries | null>;
  create(series: ICreateSerie): Promise<ISeries>;
  update(id: string, series: IUpdateSeries): Promise<ISeries | null>;
  delete(id: string): Promise<void>;
  removeTags(idSeries: string, tagIds: string[]): Promise<void>;
}

export type { ISeriesRepo };
