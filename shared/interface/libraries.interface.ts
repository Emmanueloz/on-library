import type { ISeries } from "./series.interface.ts";
import type { IUser } from "./user.interface.ts";

export interface ILibraries {
  id?: string;
  name: string;
  user?: IUser;
  idUser: string;
  isPublic: boolean;
  createdAt?: Date;
  series?: ISeries[];
  seriesCount?: number;
}
