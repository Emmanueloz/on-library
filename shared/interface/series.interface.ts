import type { ICategories } from "./categories.interface.ts";
import type { IChapter } from "./chapter.interface.ts";

export interface ISeries {
  id?: string;
  title: string;
  description: string;
  author: string;
  createdAt?: Date;
  publicationDate: Date;
  category?: ICategories;
  idCategory: string;
  chapters?: IChapter[];
}
