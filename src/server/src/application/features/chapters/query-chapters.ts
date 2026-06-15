import type { IChapter } from "@on-library/shared";

interface IQueryChapters extends Partial<IChapter> {
  orderBy: "number" | "createdAt";
  orderType: "asc" | "desc";
}

export type { IQueryChapters };
