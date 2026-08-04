import type { IChapter } from "@on-library/shared";
import type { IQueryChapters } from "./query-chapters.ts";

interface IChaptersRepo {
  query(q?: IQueryChapters): Promise<IChapter[]>;
  getById(id: string): Promise<IChapter | null>;
  getLatestBySeries(limit: number): Promise<IChapter[]>;
  create(chapter: Omit<IChapter, "id">): Promise<IChapter>;
  createMany(chapters: Array<Omit<IChapter, "id">>): Promise<IChapter[]>;
  update(id: string, chapter: Partial<IChapter>): Promise<IChapter | null>;
  delete(id: string): Promise<void>;
}

export type { IChaptersRepo };
