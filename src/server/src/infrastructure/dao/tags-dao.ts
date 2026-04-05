import type { ITags } from "@on-library/shared";
import type { PrismaClient } from "../../../prisma/prisma-client/client.ts";
import type { ITagsRepo } from "../../application/features/tags/tags-repo.ts";

class TagsDao implements ITagsRepo {
  private client: PrismaClient;

  constructor(client: PrismaClient) {
    this.client = client;
  }
  async query(name?: string): Promise<ITags[]> {
    const tags = await this.client.tags.findMany();
    return tags;
  }

  async getById(id: string): Promise<ITags | null> {
    const tag = await this.client.tags.findUnique({
      where: {
        id,
      },
    });

    return tag;
  }

  async create(tags: ITags): Promise<ITags> {
    const createdTag = await this.client.tags.create({
      data: {
        name: tags.name,
      },
    });
    return createdTag;
  }

  async update(id: string, tags: ITags): Promise<ITags> {
    const updatedTag = await this.client.tags.update({
      where: {
        id,
      },
      data: {
        name: tags.name,
      },
    });
    return updatedTag;
  }

  async delete(id: string): Promise<void> {
    await this.client.tags.delete({
      where: {
        id,
      },
    });
  }
}

export { TagsDao };
