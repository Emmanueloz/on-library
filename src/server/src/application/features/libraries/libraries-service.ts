import type { ILibraries } from "@on-library/shared";
import type { ILibrariesRepo } from "./libraries-repo.ts";

class LibrariesService {
  protected readonly librariesRepo: ILibrariesRepo;

  constructor(librariesRepo: ILibrariesRepo) {
    this.librariesRepo = librariesRepo;
  }

  async query(name: string): Promise<ILibraries[]> {
    return await this.librariesRepo.query(name);
  }
  async getById(id: string): Promise<ILibraries | null> {
    return await this.librariesRepo.getById(id);
  }
  async create(library: Omit<ILibraries, "id">): Promise<ILibraries> {
    return await this.librariesRepo.create(library);
  }
  async addSerie(id: string, idSerie: String): Promise<void> {
    return await this.librariesRepo.addSerie(id, idSerie);
  }
  async update(
    id: string,
    library: Partial<ILibraries>,
  ): Promise<ILibraries | null> {
    return await this.update(id, library);
  }
  async delete(id: string): Promise<void> {
    return await this.delete(id);
  }
}

export { LibrariesService };
