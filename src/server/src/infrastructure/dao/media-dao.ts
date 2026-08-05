import type { IMedia } from "@on-library/shared";
import type { IMediaRepo } from "../../application/features/media/media-repo.ts";
import type { PrismaClient } from "../../../prisma/prisma-client/client.ts";

class MediaDao implements IMediaRepo {
  private client: PrismaClient;

  constructor(client: PrismaClient) {
    this.client = client;
  }

  async query(idChapter: string): Promise<IMedia[]> {
    return await this.client.media.findMany({
      where: {
        idChapter,
      },
      orderBy: {
        pageNumber: "asc",
      },
    }) as IMedia[];
  }

  async getById(id: string): Promise<IMedia | null> {
    return await this.client.media.findUnique({
      where: { id },
    }) as IMedia | null;
  }

  async create(media: Omit<IMedia, "id" | "url"> & { url: string }): Promise<IMedia> {
    return await this.client.media.create({
      data: {
        idChapter: media.idChapter,
        pageNumber: media.pageNumber,
        type: media.type,
        url: media.url,
      },
    }) as IMedia;
  }

  async update(id: string, media: Partial<IMedia> & { url?: string }): Promise<IMedia | null> {
    const data: any = {};

    if (media.pageNumber !== undefined) data.pageNumber = media.pageNumber;
    if (media.type !== undefined) data.type = media.type;
    if (media.url !== undefined) data.url = media.url;

    return await this.client.media.update({
      where: { id },
      data,
    }) as IMedia | null;
  }

  async delete(id: string): Promise<void> {
    await this.client.media.delete({
      where: { id },
    });
  }
}

export { MediaDao };
