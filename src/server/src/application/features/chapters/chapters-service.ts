import type { IChapter } from "@on-library/shared";
import type { IChaptersRepo } from "./chapters-repo.ts";
import type { IQueryChapters } from "./query-chapters.ts";

class ChaptersService {
  protected readonly chaptersRepo: IChaptersRepo;
  constructor(chaptersRepo: IChaptersRepo) {
    this.chaptersRepo = chaptersRepo;
  }

  async query(q?: IQueryChapters): Promise<IChapter[]> {
    return await this.chaptersRepo.query(q);
  }
  async getById(id: string): Promise<IChapter | null> {
    return await this.chaptersRepo.getById(id);
  }
  async create(chapter: IChapter): Promise<IChapter> {
    return await this.chaptersRepo.create(chapter);
  }
  async update(id: string, chapter: IChapter): Promise<IChapter | null> {
    return await this.chaptersRepo.update(id, chapter);
  }
  async delete(id: string): Promise<void> {
    return await this.chaptersRepo.delete(id);
  }
}

export { ChaptersService };
