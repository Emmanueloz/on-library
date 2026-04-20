import type { FastifyInstance } from "fastify";
import {
  LibraryId,
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
      return libraries;
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
        id: library.id,
        name: library.name,
        isPublic: library.isPublic,
        createdAt: library.createdAt,
        series:
          (library as any).librariesOnSeries?.map((ls: any) => ({
            id: ls.serie.id,
            title: ls.serie.title,
            description: ls.serie.description,
            pictureUrl: ls.serie.pictureUrl,
            author: ls.serie.author,
            category: ls.serie.category?.name,
            tags: ls.serie.tagsOnSeries?.map((ts: any) => ts.tag.name),
            chaptersCount: ls.serie._count?.chapters || 0,
          })) || [],
      };
    },
  );
}
