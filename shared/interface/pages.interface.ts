import type { IChapter } from "./chapter.interface.ts";

export interface IPages {
  id?: string;
  chapter?: IChapter;
  idChapter: string;
  pageNumber: number;
  url: string;
  type: string;
  createdAt?: Date;
}
