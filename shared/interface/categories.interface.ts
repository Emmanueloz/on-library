import type { ISeries } from "./series.interface.ts";

export interface ICategories {
  id?: string;
  name: string;
  createdAt?: Date;
  series?: ISeries[];
}
