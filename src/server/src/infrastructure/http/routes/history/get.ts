import type { FastifyInstance } from "fastify";
import { SerieId } from "../../schemas/history/params.ts";

export default async function (fastify: FastifyInstance) {
  fastify.get<{ Params: { idSerie: string } }>(
    "/:idSerie",
    {
      onRequest: [fastify.authenticate],
      schema: {
        tags: ["History"],
        params: SerieId,
        security: [{ bearerAuth: [] }],
      },
    },
    async (request, reply) => {
      const userId = request.user.id;
      const { idSerie } = request.params;

      const isFollowing = await fastify.followingService.isFollowing(
        userId,
        idSerie,
      );

      if (!isFollowing) {
        return reply.status(403).send({
          message: "You are not following this serie",
        });
      }

      const readChapterIds =
        await fastify.readingHistoryService.getReadChapterIds(userId, idSerie);

      const readChapters =
        await fastify.readingHistoryService.getReadChaptersBySerie(
          userId,
          idSerie,
        );

      return {
        message: "Get reading history success",
        data: {
          readChapterIds,
          readChapters,
        },
      };
    },
  );
}
