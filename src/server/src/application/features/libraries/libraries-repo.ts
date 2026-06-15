import type { ILibraries } from "@on-library/shared";

interface ILibrariesRepo {
  getById(id: string): Promise<ILibraries | null>;
  getByIdAndUserId(id: string, userId: string): Promise<ILibraries | null>;
  getByUserId(userId: string): Promise<ILibraries[]>;
  existsSerie(idSerie: string): Promise<boolean>;
  getBySerieId(idSerie: string, idUser: string): Promise<ILibraries | null>;
  create(library: Omit<ILibraries, "id">): Promise<ILibraries>;
  addSerie(id: string, idSerie: String): Promise<void>;
  removeSerie(id: string, idSerie: String): Promise<void>;
  update(id: string, library: Partial<ILibraries>): Promise<ILibraries | null>;
  delete(id: string): Promise<void>;
}

export type { ILibrariesRepo };
