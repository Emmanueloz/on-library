import type { FastifyInstance } from "fastify";
import { ChapterId, type ChapterIdType } from "../../schemas/bookmark/params.ts";

export default async function (fastify: FastifyInstance) {
  fastify.get<{ Params: ChapterIdType }>(
    "/:idChapter",
    {
      onRequest: [fastify.authenticate],
      schema: {
        tags: ["Bookmark"],
        params: ChapterId,
        security: [{ bearerAuth: [] }],
      },
    },
    async (request, reply) => {
      const userId = request.user.id;
      const { idChapter } = request.params;

      const chapter = await fastify.chaptersService.getById(idChapter);

      if (!chapter) {
        return reply.status(404).send({ message: "Chapter not found" });
      }

      const isFollowing = await fastify.followingService.isFollowing(
        userId,
        chapter.idSeries,
      );

      if (!isFollowing) {
        return reply.status(403).send({
          message: "You are not following this serie",
        });
      }

      const bookmarks = await fastify.bookmarkService.getByUserAndChapter(
        userId,
        idChapter,
      );

      return {
        message: "Get bookmarks success",
        data: bookmarks,
      };
    },
  );
}
