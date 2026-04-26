import type { PermissionsPayload } from "../types";
import type { IUser } from "./user.interface";

interface IUserPayload extends Omit<
  IUser,
  "password" | "createdAt" | "libraries" | "userPermissions"
> {
  permissions: PermissionsPayload;
}

export type { IUserPayload };
