import type { FastifyInstance } from "fastify";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import fastifyAutoload from "@fastify/autoload";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastifyStatic from "@fastify/static";
import fastifyPrisma from "@joggr/fastify-prisma";

import { ClientPrisma } from "./services/client-prisma.ts";
import { errorHandler } from "./http/errors/index.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

declare module "fastify" {
  interface FastifySchema {
    tags?: string[];
    description?: string;
    summary?: string;
  }
}

export async function buildServer(fastify: FastifyInstance) {
  fastify.register(fastifySwagger);
  fastify.register(fastifySwaggerUi, {
    routePrefix: "/documentation",
  });
  console.log(join(__dirname, "../../media"));

  fastify.register(fastifyStatic, {
    root: join(__dirname, "../../media"),
    prefix: "/media/",
  });

  fastify.register(fastifyAutoload, {
    dir: join(__dirname, "plugins"),
    forceESM: true,
  });

  const client = new ClientPrisma().getClient();

  fastify.register(fastifyPrisma, {
    client: client,
  });

  fastify.register(fastifyAutoload, {
    dir: join(__dirname, "services"),
    forceESM: true,
  });

  fastify.register(fastifyAutoload, {
    dir: join(__dirname, "http/routes"),
    routeParams: true,
    options: {
      prefix: "/api",
    },
    forceESM: true,
  });

  fastify.setErrorHandler(errorHandler);

  fastify.ready(() => {
    fastify.log.info(fastify.printRoutes());
  });
}
