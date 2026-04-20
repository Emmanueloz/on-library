import type { FastifyInstance } from "fastify";
import {
  ResetPasswordBody,
  UserId,
  type ResetPasswordBodyType,
  type UserIdType,
} from "../../schemas/users/params.ts";

export default async function (fastify: FastifyInstance) {
  fastify.post<{ Params: UserIdType; Body: ResetPasswordBodyType }>(
    "/:id/reset-password",
    {
      onRequest: [fastify.authenticate],
      schema: {
        tags: ["Users"],
        security: [{ bearerAuth: [] }],
        params: UserId,
        body: ResetPasswordBody,
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const { newPassword } = request.body;

      const user = await fastify.usersService.findById(id);

      if (!user) {
        return reply.status(404).send({ message: "User not found" });
      }

      await fastify.usersService.resetPassword(id, newPassword);

      return { message: "Password updated successfully" };
    },
  );
}
