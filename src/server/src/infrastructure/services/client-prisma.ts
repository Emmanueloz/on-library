import type { PrismaClient as Client } from "@prisma/client/extension";
import type { IClientDbRepo } from "../../application/common/client-db-repo.ts";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../../../prisma/prisma-client/client.ts";
import { config } from "../../config/index.ts";


declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

class ClientPrisma implements IClientDbRepo {
  private client: Client;
  getClient(): Client {
    if (!this.client) {
      this.client = new PrismaClient({
        adapter: new PrismaBetterSqlite3({
          url: config.databaseUrl,
        }),
      });
    }

    return this.client;
  }
}

export { ClientPrisma };
