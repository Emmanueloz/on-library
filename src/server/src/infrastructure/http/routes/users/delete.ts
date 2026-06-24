import type { FastifyInstance } from "fastify";
import {
  DeletePermissionsBody,
  UserId,
  type DeletePermissionsBodyType,
  type UserIdType,
} from "../../schemas/users/params.ts";

export default async function (fastify: FastifyInstance) {
  fastify.delete<{ Params: UserIdType }>(
    "/:id",
    {
      onRequest: [fastify.authenticate],
      schema: {
        tags: ["Users"],
        security: [{ bearerAuth: [] }],
        params: UserId,
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const user = await fastify.usersService.findById(id);

      if (!user) {
        return reply.status(404).send({ message: "User not found" });
      }

      await fastify.usersService.delete(id);

      return reply.status(204).send(
        {
          message: "User deleted successfully",
        }
      );
    },
  );

  fastify.delete<{ Params: UserIdType; Body: DeletePermissionsBodyType }>(
    "/:id/permissions",
    {
      onRequest: [fastify.authenticate],
      schema: {
        tags: ["Users"],
        security: [{ bearerAuth: [] }],
        params: UserId,
        body: DeletePermissionsBody,
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const user = await fastify.usersService.findById(id);

      if (!user) {
        return reply.status(404).send({ message: "User not found" });
      }

      await fastify.usersService.deletePermissions(id, request.body.permissions);

      return reply.status(204).send({
        message: "User permissions deleted successfully",
      });
    },
  );
}
