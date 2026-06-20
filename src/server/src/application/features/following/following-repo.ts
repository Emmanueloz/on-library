interface IFollowingRepo {
  getByUserId(userId: string): Promise<any[]>;
  getByUserIdAndSerieId(userId: string, idSerie: string): Promise<any | null>;
  follow(userId: string, idSerie: string): Promise<void>;
  unfollow(userId: string, idSerie: string): Promise<void>;
  isFollowing(userId: string, idSerie: string): Promise<boolean>;
}

export type { IFollowingRepo };