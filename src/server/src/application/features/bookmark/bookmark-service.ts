import type { IBookmark, MediaType } from "@on-library/shared";
import type { IBookmarkRepo } from "./bookmark-repo.ts";

class BookmarkService {
  protected readonly bookmarkRepo: IBookmarkRepo;

  constructor(bookmarkRepo: IBookmarkRepo) {
    this.bookmarkRepo = bookmarkRepo;
  }

  async getByUserAndChapter(
    userId: string,
    idChapter: string,
  ): Promise<IBookmark[]> {
    return await this.bookmarkRepo.getByUserAndChapter(userId, idChapter);
  }

  async findByPage(
    userId: string,
    idChapter: string,
    type: MediaType,
    page: number,
  ): Promise<IBookmark | null> {
    return await this.bookmarkRepo.findByPage(userId, idChapter, type, page);
  }

  async findById(id: string): Promise<IBookmark | null> {
    return await this.bookmarkRepo.findById(id);
  }

  async create(
    userId: string,
    idChapter: string,
    type: MediaType,
    page: number,
  ): Promise<IBookmark> {
    return await this.bookmarkRepo.create(userId, idChapter, type, page);
  }

  async deleteById(id: string): Promise<void> {
    return await this.bookmarkRepo.deleteById(id);
  }

  async deleteByUserAndChapter(
    userId: string,
    idChapter: string,
  ): Promise<void> {
    return await this.bookmarkRepo.deleteByUserAndChapter(userId, idChapter);
  }

  async deleteByUserAndSerie(userId: string, idSerie: string): Promise<void> {
    return await this.bookmarkRepo.deleteByUserAndSerie(userId, idSerie);
  }
}

export { BookmarkService };
