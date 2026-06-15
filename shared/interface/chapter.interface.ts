import type { ISeries } from "./series.interface.ts";
import type { IPages } from "./pages.interface.ts";

export interface IChapter {
  id?: string;
  title: string;
  number: number;
  series?: Partial<ISeries>;
  idSeries: string;
  pages?: IPages[];
  pagesCount?: number;
  createdAt?: Date;
}
