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

        const { user, token } = await fastify.authService.login({
          email,
          password,
        });

        return {
          token,
          user,
        };
      } catch (error: any) {
        return reply.status(401).send({ message: "Invalid credentials" });
      }
    },
  );
}
