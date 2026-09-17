import type { IBookmark, MediaType } from "@on-library/shared";

interface IBookmarkRepo {
  getByUserAndChapter(userId: string, idChapter: string): Promise<IBookmark[]>;
  findByPage(
    userId: string,
    idChapter: string,
    type: MediaType,
    page: number,
  ): Promise<IBookmark | null>;
  findById(id: string): Promise<IBookmark | null>;
  create(
    userId: string,
    idChapter: string,
    type: MediaType,
    page: number,
  ): Promise<IBookmark>;
  deleteById(id: string): Promise<void>;
  deleteByUserAndChapter(userId: string, idChapter: string): Promise<void>;
  deleteByUserAndSerie(userId: string, idSerie: string): Promise<void>;
}

export type { IBookmarkRepo };
