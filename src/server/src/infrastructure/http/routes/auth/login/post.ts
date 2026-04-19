import type { FastifyInstance } from "fastify";
import { LoginSchema, type LoginType } from "../../../schemas/auth/login.ts";

export default async function (fastify: FastifyInstance) {
  fastify.post<{ Body: LoginType }>(
    "/",
    {
      schema: {
        tags: ["Auth"],
        body: LoginSchema,
      },
    },
    async (request, reply) => {
      try {
        const { email, password } = request.body;

        const result = await fastify.authService.login({ email, password });

        const token = fastify.jwt.sign(result);

        return {
          token,
          permissions: result.permissions,
        };
      } catch (error: any) {
        return reply.status(401).send({ message: "Invalid credentials" });
      }
    },
  );
}
