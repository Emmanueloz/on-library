import type { IPages } from "@on-library/shared";

interface IPagesRepo {
  query(idChapter: string): Promise<IPages[]>;
  getById(id: string): Promise<IPages | null>;
  create(page: Omit<IPages, "id"> ): Promise<IPages>;
  update(id: string, page: Partial<IPages>): Promise<IPages | null>;
  delete(id: string): Promise<void>;
}

export type { IPagesRepo };
