import "dotenv/config";
import fastify from "fastify";
import { buildServer } from "./infrastructure/server.ts";

async function start() {
  const app = fastify({
    logger: {
      transport: {
        target: "pino-pretty",
      },
      redact: {
        paths: ["[*].password", "[*].user"],
        censor: "***",
      },
    },
  });
  app.register(buildServer);

  try {
    await app.listen({
      port: 4000,
      host: "0.0.0.0",
    });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();
