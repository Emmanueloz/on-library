import { MediaType, type IMedia } from "@on-library/shared";
import type { IMediaRepo } from "./media-repo.ts";
import type { IMediaStorageRepo } from "../../common/media-storage-repo.ts";

class MediaService {
  protected readonly mediaRepo: IMediaRepo;
  protected readonly mediaStorage: IMediaStorageRepo;

  constructor(mediaRepo: IMediaRepo, mediaStorage: IMediaStorageRepo) {
    this.mediaRepo = mediaRepo;
    this.mediaStorage = mediaStorage;
  }

  async query(idChapter: string): Promise<IMedia[]> {
    return await this.mediaRepo.query(idChapter);
  }

  async getById(id: string): Promise<IMedia | null> {
    return await this.mediaRepo.getById(id);
  }

  async create(
    media: Omit<IMedia, "id" | "url"> & { url: string },
  ): Promise<IMedia> {
    return await this.mediaRepo.create(media);
  }

  async update(
    id: string,
    media: Partial<IMedia> & { url?: string },
  ): Promise<IMedia | null> {
    return await this.mediaRepo.update(id, media);
  }

  async delete(id: string): Promise<void> {
    return await this.mediaRepo.delete(id);
  }

  async createWithImage(params: {
    idChapter: string;
    pageNumber: number;
    type: MediaType;
    fileName: string;
    buffer: Buffer;
    baseUrl?: string;
  }): Promise<IMedia> {
    const fileName = this.mediaStorage.generateFileName(params.fileName);
    const url = await this.mediaStorage.saveMedia({
      folder: params.idChapter,
      fileName,
      buffer: params.buffer,
      baseUrl: params.baseUrl,
    });

    return await this.mediaRepo.create({
      idChapter: params.idChapter,
      pageNumber: params.pageNumber,
      type: MediaType.IMAGE,
      url,
    });
  }

  async createWithEpub(params: {
    idChapter: string;
    fileName: string;
    buffer: Buffer;
    baseUrl?: string;
  }): Promise<IMedia> {
    const existingMedia = await this.mediaRepo.query(params.idChapter);
    for (const m of existingMedia) {
      if (m.type === MediaType.EPUB) {
        await this.mediaStorage.deleteMedia(m.url);
        await this.mediaRepo.delete(m.id!);
      }
    }

    const fileName = this.mediaStorage.generateFileName(params.fileName);
    const url = await this.mediaStorage.saveMedia({
      folder: params.idChapter,
      fileName,
      buffer: params.buffer,
      baseUrl: params.baseUrl,
    });

    return await this.mediaRepo.create({
      idChapter: params.idChapter,
      pageNumber: 0,
      type: MediaType.EPUB,
      url,
    });
  }

  async updateWithImage(params: {
    id: string;
    newPageNumber?: number;
    newType?: MediaType;
    newFileName?: string;
    newBuffer?: Buffer;
    oldUrl?: string;
    baseUrl?: string;
  }): Promise<IMedia | null> {
    let newUrl = params.oldUrl;

    if (params.newFileName && params.newBuffer) {
      if (params.oldUrl) {
        await this.mediaStorage.deleteMedia(params.oldUrl);
      }

      const fileName = this.mediaStorage.generateFileName(params.newFileName);

      const folder = params.oldUrl
        ? this.extractFolderFromUrl(params.oldUrl)
        : "";

      newUrl = await this.mediaStorage.saveMedia({
        folder,
        fileName,
        buffer: params.newBuffer,
        baseUrl: params.baseUrl,
      });
    }

    const updateData: Partial<IMedia> = {};
    if (params.newPageNumber !== undefined)
      updateData.pageNumber = params.newPageNumber;
    if (params.newType !== undefined) updateData.type = params.newType as any;
    if (newUrl !== undefined) updateData.url = newUrl;

    if (Object.keys(updateData).length === 0) {
      return await this.mediaRepo.getById(params.id);
    }

    return await this.mediaRepo.update(params.id, updateData);
  }

  private extractFolderFromUrl(url: string): string {
    try {
      const pathname = new URL(url).pathname;
      const parts = pathname.split("/");
      return parts[parts.length - 2] || "";
    } catch {
      return "";
    }
  }

  async createManyWithImages(params: {
    idChapter: string;
    pages: Array<{
      pageNumber: number;
      type: MediaType;
      fileName: string;
      buffer: Buffer;
    }>;
    baseUrl?: string;
  }): Promise<IMedia[]> {
    const createdMedia: IMedia[] = [];

    for (const page of params.pages) {
      const fileName = this.mediaStorage.generateFileName(page.fileName);
      const url = await this.mediaStorage.saveMedia({
        folder: params.idChapter,
        fileName,
        buffer: page.buffer,
        baseUrl: params.baseUrl,
      });

      const created = await this.mediaRepo.create({
        idChapter: params.idChapter,
        pageNumber: page.pageNumber,
        type: MediaType.IMAGE,
        url,
      });

      createdMedia.push(created);
    }

    return createdMedia;
  }
}

export { MediaService };
