import type { ILibraries } from "@on-library/shared";
import type { ILibrariesRepo } from "./libraries-repo.ts";

class LibrariesService {
  protected readonly librariesRepo: ILibrariesRepo;

  constructor(librariesRepo: ILibrariesRepo) {
    this.librariesRepo = librariesRepo;
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

  async removeSerie(id: string, idSerie: String): Promise<void> {
    return await this.librariesRepo.removeSerie(id, idSerie);
  }
  async update(
    id: string,
    library: Partial<ILibraries>,
  ): Promise<ILibraries | null> {
    return await this.librariesRepo.update(id, library);
  }
  async delete(id: string): Promise<void> {
    return await this.librariesRepo.delete(id);
  }
  async getByUserId(userId: string): Promise<ILibraries[]> {
    return await this.librariesRepo.getByUserId(userId);
  }
  async getByIdAndUserId(
    id: string,
    userId: string,
  ): Promise<ILibraries | null> {
    return await this.librariesRepo.getByIdAndUserId(id, userId);
  }
  async existsSerie(idSerie: string): Promise<boolean> {
    return await this.librariesRepo.existsSerie(idSerie);
  }
  async getBySerieId(
    idSerie: string,
    idUser: string,
  ): Promise<ILibraries | null> {
    return await this.librariesRepo.getBySerieId(idSerie, idUser);
  }
}

export { LibrariesService };
