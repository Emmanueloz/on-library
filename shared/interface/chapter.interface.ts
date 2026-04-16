import type { ISeries } from "./series.interface.ts";
import type { IPages } from "./pages.interface.ts";

export interface IChapter {
  id?: string;
  series?: Partial<ISeries>;
  idSeries: string;
  pages?: IPages[];
  title: string;
  number: number;
  createdAt?: Date;
}
