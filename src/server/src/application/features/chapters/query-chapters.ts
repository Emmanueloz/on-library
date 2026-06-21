import type { IChapter } from "@on-library/shared";

interface IQueryChapters {
  title?: string;
  number?: number;
  idSeries?: string;
  orderBy?: "number" | "createdAt";
  orderType?: "asc" | "desc";
}

export type { IQueryChapters };
