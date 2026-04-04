import type { ICategories } from "@on-library/shared";

interface ICategoriesRepo {
  query(name?: string): Promise<ICategories[]>;
  getById(id: string): Promise<ICategories | null>;
  create(ICategories: Omit<ICategories, "id">): Promise<ICategories>;
  update(
    id: string,
    ICategories: Partial<ICategories>,
  ): Promise<ICategories | null>;
  delete(id: string): Promise<boolean>;
}


export type { ICategoriesRepo };