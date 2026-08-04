import type { IChapter } from "./chapter.interface.ts";
import type { MediaType } from "../enums/media-type.enum.ts";

export interface IMedia {
  id?: string;
  chapter?: IChapter;
  idChapter: string;
  pageNumber: number;
  url: string;
  type: MediaType;
  createdAt?: Date;
}