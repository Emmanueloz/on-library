import type { PermissionsPayload } from "../types/index.ts";
import type { IUser } from "./user.interface.ts";


interface IUserPayload extends Omit<
  IUser,
  "password" | "createdAt" | "libraries" | "userPermissions"
> {
  permissions: PermissionsPayload;
}

export type { IUserPayload };
