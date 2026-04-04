import type { ICategories } from "@on-library/shared";
import type { ICategoriesRepo } from "./categories-repo.ts";

class CategoriesServices {
  protected readonly categoriesRepo: ICategoriesRepo;
  constructor(categoriesRepo: ICategoriesRepo) {
    this.categoriesRepo = categoriesRepo;
  }

  async query(name?: string): Promise<ICategories[]> {
    return await this.categoriesRepo.query(name);
  }
  async getById(id: string): Promise<ICategories | null> {
    return await this.categoriesRepo.getById(id);
  }
  async create(tags: ICategories): Promise<ICategories> {
    return await this.categoriesRepo.create(tags);
  }
  async update(id: string, tags: ICategories): Promise<ICategories | null> {
    return await this.categoriesRepo.update(id, tags);
  }
  async delete(id: string): Promise<void> {
    await this.categoriesRepo.delete(id);
  }
}

export { CategoriesServices };