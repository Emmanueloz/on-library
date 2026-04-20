import type { IUserPayload } from "./user-payload.interface.ts";

interface ITokenService {
  generateToken(payload: IUserPayload, expiresIn?: string | number): string;
  verifyToken(token: string, secret?: string): IUserPayload;
}

export type { ITokenService };
