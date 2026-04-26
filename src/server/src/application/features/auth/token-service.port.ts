import type { IUserPayload } from "@on-library/shared";

interface ITokenService {
  generateToken(payload: IUserPayload, expiresIn?: string | number): string;
  verifyToken(token: string, secret?: string): IUserPayload;
}

export type { ITokenService };
