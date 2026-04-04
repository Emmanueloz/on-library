import type { ICategories } from "@on-library/shared";
import type { ICategoriesRepo } from "../../application/features/categories/categories-repo.ts";
import type { PrismaClient } from "../../../prisma/prisma-client/client.ts";

class CategoriesDao implements ICategoriesRepo {
  private client: PrismaClient;

  constructor(client: PrismaClient) {
    this.client = client;
  }
  async query(name?: string): Promise<ICategories[]> {
    return await this.client.categories.findMany();
  }
  async getById(id: string): Promise<ICategories | null> {
    return await this.client.categories.findUnique({
      where: {
        id,
      },
    });
  }
  async create(category: Omit<ICategories, "id">): Promise<ICategories> {
    return await this.client.categories.create({
      data: {
        name: category.name,
      },
    });
  }
  async update(
    id: string,
    category: ICategories,
  ): Promise<ICategories | null> {
    return await this.client.categories.update({
      where: {
        id,
      },
      data: {
        name: category.name,
      },
    });
  }
  async delete(id: string): Promise<boolean> {
    await this.client.categories.delete({
      where: {
        id,
      },
    });
    return true;
  }
}

export { CategoriesDao };
