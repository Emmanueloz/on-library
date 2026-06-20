import type { FastifyInstance } from "fastify";
import { SerieId, SerieAndChapterId, type SerieAndChapterIdType } from "../../schemas/history/params.ts";

export default async function (fastify: FastifyInstance) {
  fastify.delete<{ Params: { idSerie: string } }>(
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

      await fastify.readingHistoryService.deleteByUserAndSerie(userId, idSerie);

      return reply.status(204).send({
        message: "Reading history deleted successfully",
      });
    },
  );

  fastify.delete<{ Params: SerieAndChapterIdType }>(
    "/:idSerie/chapter/:idChapter",
    {
      onRequest: [fastify.authenticate],
      schema: {
        tags: ["History"],
        params: SerieAndChapterId,
        security: [{ bearerAuth: [] }],
      },
    },
    async (request, reply) => {
      const userId = request.user.id;
      const { idSerie, idChapter } = request.params;

      const isFollowing = await fastify.followingService.isFollowing(
        userId,
        idSerie,
      );

      if (!isFollowing) {
        return reply.status(403).send({
          message: "You are not following this serie",
        });
      }

      await fastify.readingHistoryService.markAsUnread(userId, idChapter);

      return reply.status(204).send({
        message: "Chapter marked as unread",
      });
    },
  );
}
