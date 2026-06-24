import type { FastifyInstance } from "fastify";
import {
  UserId,
  UserPermissionsBody,
  type UserIdType,
  type UserPermissionsBodyType,
} from "../../schemas/users/params.ts";

export default async function (fastify: FastifyInstance) {
  fastify.put<{ Params: UserIdType; Body: UserPermissionsBodyType }>(
    "/:id/permissions",
    {
      onRequest: [fastify.authenticate],
      schema: {
        tags: ["Users"],
        security: [{ bearerAuth: [] }],
        params: UserId,
        body: UserPermissionsBody,
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const { permissions } = request.body;

      const user = await fastify.usersService.findById(id);

      if (!user) {
        return reply.status(404).send({ message: "User not found" });
      }

      await fastify.usersService.updatePermissions(id, permissions);
      const updatedPermissions = await fastify.usersService.getPermissions(id);

      return reply.status(200).send({
        message: "User permissions updated successfully",
        data: {
          id: user.id,
          username: user.username,
          permissions: updatedPermissions,
        },
      });
    },
  );
}
