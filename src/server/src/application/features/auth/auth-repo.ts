import type { IUser } from "@on-library/shared";

interface IAuthRepo {
  findByEmail(email: string): Promise<IUser | null>;
  findById(id: string): Promise<IUser | null>;
  findByUsername(username: string): Promise<IUser | null>;
  create(user: Omit<IUser, "id" | "createdAt" | "libraries">): Promise<IUser>;
  query(): Promise<IUser[]>;
  update(id: string, user: Partial<IUser>): Promise<IUser | null>;
  delete(id: string): Promise<void>;
}

export type { IAuthRepo };