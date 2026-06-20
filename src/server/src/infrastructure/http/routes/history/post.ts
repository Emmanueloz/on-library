import type { FastifyInstance } from "fastify";
import { SerieAndChapterId, type SerieAndChapterIdType } from "../../schemas/history/params.ts";

export default async function (fastify: FastifyInstance) {
  fastify.post<{ Params: SerieAndChapterIdType; Querystring: { markPrevious?: string } }>(
    "/:idSerie/chapter/:idChapter",
    {
      onRequest: [fastify.authenticate],
      schema: {
        tags: ["History"],
        params: SerieAndChapterId,
        querystring: {
          type: "object",
          properties: {
            markPrevious: { type: "string" },
          },
        },
        security: [{ bearerAuth: [] }],
      },
    },
    async (request, reply) => {
      const userId = request.user.id;
      const { idSerie, idChapter } = request.params;
      const markPrevious = request.query.markPrevious === "true";

      const isFollowing = await fastify.followingService.isFollowing(
        userId,
        idSerie,
      );

      if (!isFollowing) {
        return reply.status(403).send({
          message: "You are not following this serie",
        });
      }

      const chapter = await fastify.chaptersService.getById(idChapter);

      if (!chapter || chapter.idSeries !== idSerie) {
        return reply.status(404).send({
          message: "Chapter not found in this serie",
        });
      }

      if (markPrevious) {
        await fastify.readingHistoryService.markRangeAsRead(
          userId,
          idSerie,
          idChapter,
        );
      } else {
        await fastify.readingHistoryService.markAsRead(userId, idChapter);
      }

      return reply.status(200).send({
        message: "Chapter saved successfully",
      });
    },
  );
}
