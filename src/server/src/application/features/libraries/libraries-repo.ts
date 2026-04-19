import type { ILibraries } from "@on-library/shared";

interface ILibrariesRepo {
  query(name: string): Promise<ILibraries[]>;
  getById(id: string): Promise<ILibraries | null>;
  getByIdAndUserId(id: string, userId: string): Promise<ILibraries | null>;
  getByUserId(userId: string): Promise<ILibraries[]>;
  existsSerie(idSerie: string): Promise<boolean>;
  create(
    library: Omit<ILibraries, "id"> ,
  ): Promise<ILibraries>;

  addSerie(id:string,idSerie:String):Promise<void>;
  removeSerie(id:string,idSerie:String):Promise<void>;
  update(
    id: string,
    library: Partial<ILibraries>,
  ): Promise<ILibraries | null>;
  delete(id: string): Promise<void>;
}

export type { ILibrariesRepo };
