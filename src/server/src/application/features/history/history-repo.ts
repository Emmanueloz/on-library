interface IReadChaptersRepo {
  getReadChapterIds(userId: string, idSerie: string): Promise<string[]>;
  markAsRead(userId: string, idChapter: string): Promise<void>;
  markAsUnread(userId: string, idChapter: string): Promise<void>;
  markRangeAsRead(userId: string, idSerie: string, upToChapterId: string): Promise<void>;
  deleteByUserAndSerie(userId: string, idSerie: string): Promise<void>;
  getReadChaptersBySerie(userId: string, idSerie: string): Promise<any[]>;
}

export type { IReadChaptersRepo };
