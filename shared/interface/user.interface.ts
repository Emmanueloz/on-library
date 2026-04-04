import type { ILibraries } from "./libraries.interface.ts";

export interface IUser {
  id?: string;
  username: string;
  email: string;
  password: string;
  createdAt?: Date;
  libraries?: ILibraries[];
}
