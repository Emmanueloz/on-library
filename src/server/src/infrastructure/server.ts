import type { FastifyInstance } from "fastify";

import fastifyAutoload from "@fastify/autoload";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastifyStatic from "@fastify/static";
import fastifyPrisma from "@joggr/fastify-prisma";
import fastifyMultipart from "@fastify/multipart";
import fastifyCors from "@fastify/cors";
import { ClientPrisma } from "./services/client-prisma.ts";
import { errorHandler } from "./http/errors/index.ts";
import { MEDIA_DIR } from "./constants/index.ts";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import authPlugin from "./plugins/auth.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const INFRASTRUCTURE_PLUGINS_DIR = join(__dirname, "plugins");

const fastifyMultipartOptions = {
  limits: {
    fileSize: 50 * 1024 * 1024,
  },
  attachFieldsToBody: true,
};

export async function buildServer(fastify: FastifyInstance) {
  fastify.register(fastifyCors, { methods: ["GET", "POST", "PUT", "DELETE"] });
  fastify.register(fastifyMultipart, fastifyMultipartOptions);

  fastify.register(fastifySwagger, {
    openapi: {
      info: {
        title: "OnLibrary API",
        description: "API documentation for OnLibrary",
        version: "0.0.0",
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
    },
  });
  fastify.register(fastifySwaggerUi, {
    routePrefix: "/documentation",
  });
  console.log(MEDIA_DIR);

  fastify.register(fastifyStatic, {
    root: MEDIA_DIR,
    prefix: "/media/",
  });

  const client = new ClientPrisma().getClient();

  fastify.register(fastifyPrisma, {
    client: client,
  });

  await fastify.register(authPlugin);

  fastify.register(fastifyAutoload, {
    dir: INFRASTRUCTURE_PLUGINS_DIR,
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
