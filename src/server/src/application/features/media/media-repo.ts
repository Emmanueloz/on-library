import type { IMedia } from "@on-library/shared";

interface IMediaRepo {
  query(idChapter: string): Promise<IMedia[]>;
  getById(id: string): Promise<IMedia | null>;
  create(media: Omit<IMedia, "id">): Promise<IMedia>;
  update(id: string, media: Partial<IMedia>): Promise<IMedia | null>;
  delete(id: string): Promise<void>;
}

export type { IMediaRepo };
