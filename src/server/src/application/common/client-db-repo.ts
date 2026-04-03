import type { PrismaClient } from "@prisma/client/extension";

interface IClientDbRepo {
  getClient(): PrismaClient;
}

export type { IClientDbRepo };
