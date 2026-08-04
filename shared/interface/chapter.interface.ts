import type { ISeries } from "./series.interface.ts";
import type { IMedia } from "./media.interface.ts";

export interface IChapter {
  id?: string;
  title: string;
  number: number;
  series?: Partial<ISeries>;
  idSeries: string;
  media?: IMedia[];
  mediaCount?: number;
  createdAt?: Date;
  groupNum?: number | null;
  groupTitle?: string | null;
}
