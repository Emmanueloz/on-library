import type { FastifyInstance } from "fastify";
import {
  LibraryIdAndSerieId,
  type LibraryIdAndSerieIdType,
  type LibraryIdType,
} from "../../schemas/libraries/params.ts";

export default async function (fastify: FastifyInstance) {
  fastify.delete<{ Params: LibraryIdType }>(
    "/:id",
    {
      onRequest: [fastify.authenticate],
      schema: {
        tags: ["Libraries"],
        security: [{ bearerAuth: [] }],
      },
    },
    async (request, reply) => {
      const userId = request.user.id;
      const { id } = request.params;

      const library = await fastify.librariesService.getByIdAndUserId(
        id,
        userId,
      );

      if (!library) {
        return reply
          .status(404)
          .send({ message: "Library not found or not owned by user" });
      }

      await fastify.librariesService.delete(id);

      return reply.status(204).send({ message: "Delete library success" });
    },
  );

  fastify.delete<{ Params: LibraryIdAndSerieIdType }>(
    "/:id/serie/:idSerie",
    {
      onRequest: [fastify.authenticate],
      schema: {
        tags: ["Libraries"],
        params: LibraryIdAndSerieId,
        security: [{ bearerAuth: [] }],
      },
    },
    async (request, reply) => {
      const userId = request.user.id;
      const { id, idSerie } = request.params;

      const library = await fastify.librariesService.getByIdAndUserId(
        id,
        userId,
      );

      if (!library) {
        return reply
          .status(404)
          .send({ message: "Library not found or not owned by user" });
      }

      await fastify.librariesService.removeSerie(id, idSerie);

      return reply.status(204).send({
        message: "Delete serie in library",
      });
    },
  );
}
