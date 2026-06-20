import type { IReadChaptersRepo } from "./history-repo.ts";

class ReadingHistoryService {
  protected readonly readChaptersRepo: IReadChaptersRepo;

  constructor(readChaptersRepo: IReadChaptersRepo) {
    this.readChaptersRepo = readChaptersRepo;
  }

  async getReadChapterIds(userId: string, idSerie: string): Promise<string[]> {
    return await this.readChaptersRepo.getReadChapterIds(userId, idSerie);
  }

  async markAsRead(userId: string, idChapter: string): Promise<void> {
    return await this.readChaptersRepo.markAsRead(userId, idChapter);
  }

  async markAsUnread(userId: string, idChapter: string): Promise<void> {
    return await this.readChaptersRepo.markAsUnread(userId, idChapter);
  }

  async markRangeAsRead(
    userId: string,
    idSerie: string,
    upToChapterId: string,
  ): Promise<void> {
    return await this.readChaptersRepo.markRangeAsRead(
      userId,
      idSerie,
      upToChapterId,
    );
  }

  async deleteByUserAndSerie(
    userId: string,
    idSerie: string,
  ): Promise<void> {
    return await this.readChaptersRepo.deleteByUserAndSerie(userId, idSerie);
  }

  async getReadChaptersBySerie(userId: string, idSerie: string): Promise<any[]> {
    return await this.readChaptersRepo.getReadChaptersBySerie(userId, idSerie);
  }
}

export { ReadingHistoryService };
