import fp from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";
import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import type { IUser } from "@on-library/shared";
import type { IUserPayload } from "../../application/features/auth/user-payload.interface.ts";
import { config } from "../../config/index.ts";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: IUserPayload;
    user: IUser;
  }
}

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply,
    ) => Promise<void>;
  }
}

function extractModuleFromUrl(url: string): string | undefined {
  const pathParts = url.split("/").filter(Boolean);
  if (pathParts.length >= 2 && pathParts[0] === "api") {
    if (pathParts[1] === "auth") {
      return undefined;
    }
    return pathParts[1];
  }
  return undefined;
}

function getRequiredPermission(method: string): string | null {
  switch (method) {
    case "GET":
      return "read";
    case "POST":
    case "PUT":
      return "write";
    case "DELETE":
      return "delete";
    default:
      return null;
  }
}

async function authPlugin(fastify: FastifyInstance) {
  // TODO: Change secret to environment variable JWT_SECRET
  await fastify.register(fastifyJwt, {
    secret: config.secretKey,
  });

  fastify.decorate(
    "authenticate",
    async function (request: FastifyRequest, reply: FastifyReply) {
      const url = request.url;
      const method = request.method;

      try {
        fastify.log.info(`Authenticating request for URL: ${url}, method: ${method}`);
        const decoded = await request.jwtVerify<IUserPayload>();

        const module = extractModuleFromUrl(url);
        fastify.log.info(
          `Authenticating request for module: ${module}, method: ${method}`,
        );

        if (module) {
          const requiredPermission = getRequiredPermission(method);

          if (requiredPermission) {
            const userPermissions = decoded.permissions || {};
            const modulePermissions = userPermissions[module] || [];

            if (!modulePermissions.includes(requiredPermission)) {
              return reply.status(403).send({
                message: `Permission denied: ${requiredPermission} on ${module}`,
              });
            }
          }
        }
      } catch (err) {
        fastify.log.error(`Authentication error: ${err}`);
        return reply.status(401).send({ message: "Unauthorized" });
      }
    },
  );
}

export default fp(authPlugin, {
  name: "auth-plugin",
});
