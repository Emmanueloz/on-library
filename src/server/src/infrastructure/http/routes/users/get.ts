import type { FastifyInstance } from "fastify";
import { UserId, type UserIdType } from "../../schemas/users/params.ts";

export default async function (fastify: FastifyInstance) {
  fastify.get<{ Params: UserIdType }>(
    "/",
    {
      onRequest: [fastify.authenticate],
      schema: {
        tags: ["Users"],
        security: [{ bearerAuth: [] }],
      },
    },
    async (request, reply) => {
      const users = await fastify.usersService.query();
      
      return reply.status(200).send({
        message: "Users retrieved successfully",
        data: users,
      });
    },
  );

  fastify.get<{ Params: UserIdType }>(
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

      return reply.status(200).send({
        message: "User retrieved successfully",
        data:user,
      });
    },
  );

  fastify.get<{ Params: UserIdType }>(
    "/:id/libraries",
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

      const libraries = await fastify.usersService.getLibraries(id);

      return reply.status(200).send({
        message: "Libraries retrieved successfully",
        data: libraries,
      });
    },
  );
}
