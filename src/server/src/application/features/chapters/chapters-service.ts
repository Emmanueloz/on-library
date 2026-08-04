import type { IChapter } from "@on-library/shared";
import type { IChaptersRepo } from "./chapters-repo.ts";
import type { IQueryChapters } from "./query-chapters.ts";
import type { ISpreadsheetParserRepo } from "../../common/spreadsheet-parser-repo.ts";

class ChaptersService {
  protected readonly chaptersRepo: IChaptersRepo;
  protected readonly spreadsheetParser: ISpreadsheetParserRepo;

  constructor(chaptersRepo: IChaptersRepo, spreadsheetParser: ISpreadsheetParserRepo) {
    this.chaptersRepo = chaptersRepo;
    this.spreadsheetParser = spreadsheetParser;
  }

  async query(q?: IQueryChapters): Promise<IChapter[]> {
    return await this.chaptersRepo.query(q);
  }
  async getById(id: string): Promise<IChapter | null> {
    return await this.chaptersRepo.getById(id);
  }
  async getLatestBySeries(limit: number): Promise<IChapter[]> {
    return await this.chaptersRepo.getLatestBySeries(limit);
  }
  async create(chapter: IChapter): Promise<IChapter> {
    return await this.chaptersRepo.create(chapter);
  }
  async createMany(chapters: Array<Omit<IChapter, "id">>): Promise<IChapter[]> {
    return await this.chaptersRepo.createMany(chapters);
  }
  async importChapters(buffer: Buffer, idSeries: string): Promise<IChapter[]> {
    const rows = await this.spreadsheetParser.parseChaptersFromBuffer(buffer);
    const chapters = rows.map((row) => ({ ...row, idSeries }));
    return await this.chaptersRepo.createMany(chapters);
  }
  async update(id: string, chapter: Partial<IChapter>): Promise<IChapter | null> {
    return await this.chaptersRepo.update(id, chapter);
  }
  async delete(id: string): Promise<void> {
    return await this.chaptersRepo.delete(id);
  }
}

export { ChaptersService };
