import type { IPages } from "@on-library/shared";
import type { IPagesRepo } from "../../application/features/pages/pages-repo.ts";
import type { PrismaClient } from "../../../prisma/prisma-client/client.ts";

class PagesDao implements IPagesRepo {
  private client: PrismaClient;

  constructor(client: PrismaClient) {
    this.client = client;
  }

  async query(idChapter: string): Promise<IPages[]> {
    return await this.client.pages.findMany({
      where: {
        idChapter,
      },
      orderBy: {
        pageNumber: "asc",
      },
    });
  }

  async getById(id: string): Promise<IPages | null> {
    return await this.client.pages.findUnique({
      where: { id },
    });
  }

  async create(page: Omit<IPages, "id" | "url"> & { url: string }): Promise<IPages> {
    return await this.client.pages.create({
      data: {
        idChapter: page.idChapter,
        pageNumber: page.pageNumber,
        type: page.type,
        url: page.url,
      },
    });
  }

  async update(id: string, page: Partial<IPages> & { url?: string }): Promise<IPages | null> {
    const data: any = {};
    
    if (page.pageNumber !== undefined) data.pageNumber = page.pageNumber;
    if (page.type !== undefined) data.type = page.type;
    if (page.url !== undefined) data.url = page.url;

    return await this.client.pages.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await this.client.pages.delete({
      where: { id },
    });
  }
}

export { PagesDao };
