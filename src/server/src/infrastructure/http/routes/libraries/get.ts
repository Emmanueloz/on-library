import type { FastifyInstance } from "fastify";
import {
  LibraryId,
  LibraryIdSerie,
  type LibraryIdSerieType,
  type LibraryIdType,
} from "../../schemas/libraries/params.ts";

export default async function (fastify: FastifyInstance) {
  fastify.get(
    "/",
    {
      onRequest: [fastify.authenticate],
      schema: {
        tags: ["Libraries"],
        security: [{ bearerAuth: [] }],
      },
    },
    async (request, reply) => {
      const userId = request.user.id;
      const libraries = await fastify.librariesService.getByUserId(userId);
      return {
        message: "Get success libraries",
        data: libraries,
      };
    },
  );

  fastify.get<{ Params: LibraryIdType }>(
    "/:id",
    {
      onRequest: [fastify.authenticate],
      schema: {
        tags: ["Libraries"],
        params: LibraryId,
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
        return reply.status(404).send({ message: "Library not found" });
      }

      return {
        message: "Get success library",
        data: library,
      };
    },
  );

  fastify.get<{ Params: LibraryIdSerieType }>(
    "/serie/:idSerie",
    {
      onRequest: [fastify.authenticate],
      schema: {
        tags: ["Libraries"],
        params: LibraryIdSerie,
        security: [{ bearerAuth: [] }],
      },
    },
    async (request, reply) => {
      const { idSerie } = request.params;

      const userId = request.user.id;
      const library = await fastify.librariesService.getBySerieId(
        idSerie,
        userId,
      );

      if (!library) {
        return reply.status(404).send({ message: "Library not found" });
      }

      return {
        message: "Get success libraries",
        data: library,
      };
    },
  );
}
