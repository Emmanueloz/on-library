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

  async getChapterMediaType(idChapter: string): Promise<MediaType | null> {
    const media = await this.mediaRepo.query(idChapter);

    if (media.some((m) => m.type === MediaType.IMAGE)) {
      return MediaType.IMAGE;
    }

    if (media.some((m) => m.type === MediaType.EPUB)) {
      return MediaType.EPUB;
    }

    return null;
  }

  async getById(id: string): Promise<IMedia | null> {
    return await this.mediaRepo.getById(id);
  }

  async create(media: Omit<IMedia, "id">): Promise<IMedia> {
    return await this.mediaRepo.create(media);
  }

  async update(
    id: string,
    media: Partial<IMedia>,
  ): Promise<IMedia | null> {
    return await this.mediaRepo.update(id, media);
  }

  async delete(id: string): Promise<void> {
    return await this.mediaRepo.delete(id);
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

  async createManyWithFiles(params: {
    idChapter: string;
    files: Array<{
      pageNumber: number;
      type: MediaType;
      fileName: string;
      buffer: Buffer;
    }>;
    baseUrl?: string;
  }): Promise<IMedia[]> {
    const createdMedia: IMedia[] = [];

    for (const file of params.files) {
      const fileName = this.mediaStorage.generateFileName(file.fileName);
      const url = await this.mediaStorage.saveMedia({
        folder: params.idChapter,
        fileName,
        buffer: file.buffer,
        baseUrl: params.baseUrl,
      });

      const created = await this.mediaRepo.create({
        idChapter: params.idChapter,
        pageNumber: file.pageNumber,
        type: file.type,
        url,
      });

      createdMedia.push(created);
    }

    return createdMedia;
  }
}

export { MediaService };
