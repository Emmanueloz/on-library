import type { MediaType } from "../enums/media-type.enum.ts";

export interface IBookmark {
  id?: string;
  idUser: string;
  idChapter: string;
  type: MediaType;
  page: number;
  createdAt?: Date;
}
