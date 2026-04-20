import type { FastifyInstance } from "fastify";
import {
  RegisterSchema,
  type RegisterType,
} from "../../../schemas/auth/register.ts";

export default async function (fastify: FastifyInstance) {
  fastify.post<{ Body: RegisterType }>(
    "",
    {
      schema: {
        tags: ["Auth"],
        body: RegisterSchema,
      },
    },
    async (request, reply) => {
      try {
        const { username, email, password } = request.body;

        const { user, token } = await fastify.authService.register({
          username,
          email,
          password,
        });

        return reply.status(201).send({
          user,
          token,
        });
      } catch (error: any) {
        return reply.status(400).send({ message: error.message });
      }
    },
  );
}
