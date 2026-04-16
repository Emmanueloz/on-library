import type { ISeries } from "@on-library/shared";

interface ICreateSerie extends Omit<ISeries, "id" | "tagsOnSeries"> {
  tags: string[];
}

interface IUpdateSeries extends Partial<ICreateSerie> {}

export type { ICreateSerie, IUpdateSeries };
