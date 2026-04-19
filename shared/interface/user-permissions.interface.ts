import type { IPermissions } from "./permissions.interface.ts";

export interface IUserPermissions {
  idUser: string;
  idPermission: string;
  permission: IPermissions;
}