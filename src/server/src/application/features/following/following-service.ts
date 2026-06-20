import type { IFollowingRepo } from "./following-repo.ts";

class FollowingService {
  protected readonly followingRepo: IFollowingRepo;

  constructor(followingRepo: IFollowingRepo) {
    this.followingRepo = followingRepo;
  }

  async getByUserId(userId: string): Promise<any[]> {
    return await this.followingRepo.getByUserId(userId);
  }

  async getByUserIdAndSerieId(
    userId: string,
    idSerie: string,
  ): Promise<any | null> {
    return await this.followingRepo.getByUserIdAndSerieId(userId, idSerie);
  }

  async follow(userId: string, idSerie: string): Promise<void> {
    return await this.followingRepo.follow(userId, idSerie);
  }

  async unfollow(userId: string, idSerie: string): Promise<void> {
    return await this.followingRepo.unfollow(userId, idSerie);
  }

  async isFollowing(userId: string, idSerie: string): Promise<boolean> {
    return await this.followingRepo.isFollowing(userId, idSerie);
  }
}

export { FollowingService };