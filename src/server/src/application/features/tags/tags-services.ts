import type { ITags } from "@on-library/shared";
import type { ITagsRepo } from "./tags-repo.ts";

class TagsServices {
  protected readonly tagsRepo: ITagsRepo;

  constructor(tagsRepo: ITagsRepo) {
    this.tagsRepo = tagsRepo;
  }

  async query(name?: string): Promise<ITags[]> {
    return await this.tagsRepo.query(name);
  }
  async getById(id: string): Promise<ITags | null> {
    return await this.tagsRepo.getById(id);
  }
  async create(tags: ITags): Promise<ITags> {
    return await this.tagsRepo.create(tags);
  }
  async update(id: string, tags: ITags): Promise<ITags | null> {
    return await this.tagsRepo.update(id, tags);
  }
  async delete(id: string): Promise<void> {
    return await this.tagsRepo.delete(id);
  }
}

export { TagsServices };