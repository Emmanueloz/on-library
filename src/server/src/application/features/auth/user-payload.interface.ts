import type { IUser } from "@on-library/shared";

interface IUserPayload extends Omit<
  IUser,
  "password" | "createdAt" | "libraries" | "userPermissions"
> {
  permissions: Record<string, string[]>;
}

export type { IUserPayload };
