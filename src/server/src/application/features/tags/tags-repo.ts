import type {ITags } from "@on-library/shared";

interface ITagsRepo {
  query(name?: string): Promise<ITags[]>;
  getById(id: string): Promise<ITags | null>;
  create(tags: Omit<ITags, "id">): Promise<ITags>;
  update(id: string, tags: Partial<ITags>): Promise<ITags | null>;
  delete(id: string): Promise<void>;
}

export type { ITagsRepo };