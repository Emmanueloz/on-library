import type { IPages } from "@on-library/shared";
import type { IPagesRepo } from "./pages-repo.ts";
import type { IImageStorageRepo } from "../../common/image-storage-repo.ts";

class PagesService {
  protected readonly pagesRepo: IPagesRepo;
  protected readonly imageStorage: IImageStorageRepo;

  constructor(pagesRepo: IPagesRepo, imageStorage: IImageStorageRepo) {
    this.pagesRepo = pagesRepo;
    this.imageStorage = imageStorage;
  }

  async query(idChapter: string): Promise<IPages[]> {
    return await this.pagesRepo.query(idChapter);
  }

  async getById(id: string): Promise<IPages | null> {
    return await this.pagesRepo.getById(id);
  }

  async create(page: Omit<IPages, "id" | "url"> & { url: string }): Promise<IPages> {
    return await this.pagesRepo.create(page);
  }

  async update(id: string, page: Partial<IPages> & { url?: string }): Promise<IPages | null> {
    return await this.pagesRepo.update(id, page);
  }

  async delete(id: string): Promise<void> {
    return await this.pagesRepo.delete(id);
  }

  async createWithImage(params: {
    idChapter: string;
    pageNumber: number;
    type: string;
    fileName: string;
    buffer: Buffer;
    baseUrl?: string;
  }): Promise<IPages> {
    const fileName = this.imageStorage.generateFileName(params.fileName);
    const url = await this.imageStorage.saveImage({
      folder: params.idChapter,
      fileName,
      buffer: params.buffer,
      baseUrl: params.baseUrl,
    });

    return await this.pagesRepo.create({
      idChapter: params.idChapter,
      pageNumber: params.pageNumber,
      type: params.type,
      url,
    });
  }

  async updateWithImage(params: {
    id: string;
    newPageNumber?: number;
    newType?: string;
    newFileName?: string;
    newBuffer?: Buffer;
    oldUrl?: string;
    baseUrl?: string;
  }): Promise<IPages | null> {
    let newUrl = params.oldUrl;

    if (params.newFileName && params.newBuffer) {
      if (params.oldUrl) {
        await this.imageStorage.deleteImage(params.oldUrl);
      }

      const fileName = this.imageStorage.generateFileName(params.newFileName);
      
      const folder = params.oldUrl 
        ? this.extractFolderFromUrl(params.oldUrl) 
        : "";

      newUrl = await this.imageStorage.saveImage({
        folder,
        fileName,
        buffer: params.newBuffer,
        baseUrl: params.baseUrl,
      });
    }

    const updateData: Partial<IPages> = {};
    if (params.newPageNumber !== undefined) updateData.pageNumber = params.newPageNumber;
    if (params.newType !== undefined) updateData.type = params.newType;
    if (newUrl !== undefined) updateData.url = newUrl;

    if (Object.keys(updateData).length === 0) {
      return await this.pagesRepo.getById(params.id);
    }

    return await this.pagesRepo.update(params.id, updateData);
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
      type: string;
      fileName: string;
      buffer: Buffer;
    }>;
    baseUrl?: string;
  }): Promise<IPages[]> {
    const createdPages: IPages[] = [];

    for (const page of params.pages) {
      const fileName = this.imageStorage.generateFileName(page.fileName);
      const url = await this.imageStorage.saveImage({
        folder: params.idChapter,
        fileName,
        buffer: page.buffer,
        baseUrl: params.baseUrl,
      });

      const created = await this.pagesRepo.create({
        idChapter: params.idChapter,
        pageNumber: page.pageNumber,
        type: page.type,
        url,
      });

      createdPages.push(created);
    }

    return createdPages;
  }
}

export { PagesService };
