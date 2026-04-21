import bcrypt from "bcryptjs";
import type { EncryptService } from "../../application/features/auth/encrypt-service.port.ts";

class BcryptService implements EncryptService {
  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 15);
  }
  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}

export { BcryptService };
