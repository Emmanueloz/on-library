import type { FastifyInstance } from "fastify";
import type { ITokenService } from "../../application/features/auth/token-service.port.ts";
import type { IUserPayload } from "../../application/features/auth/user-payload.interface.ts";

class JwtService implements ITokenService {
  private readonly fastify: FastifyInstance;
  constructor(fastify: FastifyInstance) {
    this.fastify = fastify;
  }
  generateToken(payload: IUserPayload, expiresIn?: string | number): string {
    return this.fastify.jwt.sign(payload, { expiresIn: expiresIn || "30 days" });
  }

  verifyToken(token: string, secret?: string) {
    return this.fastify.jwt.verify<IUserPayload>(token);
  }
}

export { JwtService };
