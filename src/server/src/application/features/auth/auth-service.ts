import type { IUser } from "@on-library/shared";
import type { IAuthRepo } from "./auth-repo.ts";
import type { IUserPayload } from "./user-payload.interface.ts";
import type { ITokenService } from "./token-service.port.ts";

interface RegisterInput {
  username: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface ResultPayload {
  user: IUserPayload;
  token: string;
}

class AuthService {
  private readonly repo: IAuthRepo;
  private readonly tokenService: ITokenService;

  constructor(repo: IAuthRepo, tokenService: ITokenService) {
    this.repo = repo;
    this.tokenService = tokenService;
  }

  async register(input: RegisterInput): Promise<ResultPayload> {
    const existingUser = await this.repo.findByEmail(input.email);
    if (existingUser) {
      throw new Error("Email already registered");
    }

    const existingUsername = await this.repo.findById(input.username);
    if (existingUsername) {
      throw new Error("Username already taken");
    }

    console.log("create");

    const user = await this.repo.create({
      username: input.username,
      email: input.email,
      password: input.password,
    });

    const payload = {
      id: user.id,
      email: user.email,
      username: user.username,
      permissions: this.getPermissions(user),
    };

    const token = this.tokenService.generateToken(payload);

    return {
      user: payload,
      token,
    };
  }

  async login(input: LoginInput): Promise<ResultPayload> {
    const user = await this.repo.findByEmail(input.email);

    if (!user || user.password !== input.password) {
      throw new Error("Invalid credentials");
    }

    const payload = {
      id: user.id,
      email: user.email,
      username: user.username,
      permissions: this.getPermissions(user),
    };

    const token = this.tokenService.generateToken(payload);

    return {
      user: payload,
      token,
    };
  }

  private getPermissions(user: IUser) {
    return (
      user.userPermissions?.reduce(
        (acc, up) => {
          const module = up.permission.name;
          const type = up.permission.type.toLowerCase();
          if (!acc[module]) {
            acc[module] = [];
          }
          acc[module].push(type);
          return acc;
        },
        {} as Record<string, string[]>,
      ) || {}
    );
  }

  async getProfile(userId: string): Promise<IUser | null> {
    return this.repo.findById(userId);
  }

  async updateProfile(
    userId: string,
    data: { username?: string; email?: string },
  ): Promise<IUser | null> {
    return this.repo.update(userId, data);
  }

  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<boolean> {
    const user = await this.repo.findById(userId);
    if (!user || user.password !== oldPassword) {
      return false;
    }
    await this.repo.update(userId, { password: newPassword });
    return true;
  }

  async emailExists(email: string, excludeUserId?: string): Promise<boolean> {
    const user = await this.repo.findByEmail(email);
    if (!user) return false;
    if (excludeUserId && user.id === excludeUserId) return false;
    return true;
  }

  async usernameExists(
    username: string,
    excludeUserId?: string,
  ): Promise<boolean> {
    const user = await this.repo.findByUsername(username);
    if (!user) return false;
    if (excludeUserId && user.id === excludeUserId) return false;
    return true;
  }
}

export { AuthService };
export type { RegisterInput, LoginInput };
