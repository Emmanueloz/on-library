import type { FastifyInstance} from "fastify";

export default async function (fastify: FastifyInstance) {
  fastify.delete<{ Params: { id: string } }>(
    "/:id",
    {
      onRequest: [fastify.authenticate],
      schema: {
        tags: ["Libraries"],
        security: [{ bearerAuth: [] }],
      },
    },
    async (request, reply ) => {
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

      return reply.status(204).send();
    },
  );

  fastify.delete<{ Params: { id: string; idSerie: string } }>(
    "/:id/serie/:idSerie",
    {
      onRequest: [fastify.authenticate],
      schema: {
        tags: ["Libraries"],
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

      return reply.status(204).send();
    },
  );
}
