import type { FastifyInstance } from "fastify";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import fastifyAutoload from "@fastify/autoload";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastifyPrisma from "@joggr/fastify-prisma";
import { errorHandler } from "./http/errors/index.ts";
import { PrismaClient } from "../../prisma/prisma-client/client.ts";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { config } from "../config/index.ts";

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)


declare module 'fastify' {
    interface FastifySchema {
        tags?: string[];
        description?: string;
        summary?: string;
    }
}


export async function buildServer(fastify: FastifyInstance) {
    const adapter = new PrismaBetterSqlite3({
        url: config.databaseUrl
    })

    const prisma = new PrismaClient(
        {
            adapter,
        }
    )


    fastify.register(fastifySwagger)
    fastify.register(fastifySwaggerUi, {
        routePrefix: '/documentation'
    })


    fastify.register(fastifyAutoload, {
        dir: join(__dirname, 'plugins'),
        forceESM: true,
    })

    fastify.register(fastifyAutoload, {
        dir: join(__dirname, 'services'),
        forceESM: true,
    })

    fastify.register(fastifyPrisma, {
        client: prisma,
    })

    fastify.register(fastifyAutoload, {
        dir: join(__dirname, 'http/routes'),
        routeParams: true,
        options: {
            prefix: '/api'
        },
        forceESM: true,
    })

    fastify.setErrorHandler(errorHandler);

    fastify.ready(() => {
        fastify.log.info(fastify.printRoutes());
    });
}