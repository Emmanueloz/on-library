import type { FastifyInstance } from "fastify";
import {
  BookmarkId,
  ChapterId,
  type BookmarkIdType,
  type ChapterIdType,
} from "../../schemas/bookmark/params.ts";

export default async function (fastify: FastifyInstance) {
  fastify.delete<{ Params: BookmarkIdType }>(
    "/:id",
    {
      onRequest: [fastify.authenticate],
      schema: {
        tags: ["Bookmark"],
        params: BookmarkId,
        security: [{ bearerAuth: [] }],
      },
    },
    async (request, reply) => {
      const userId = request.user.id;
      const { id } = request.params;

      const bookmark = await fastify.bookmarkService.findById(id);

      if (!bookmark || bookmark.idUser !== userId) {
        return reply.status(404).send({ message: "Bookmark not found" });
      }

      await fastify.bookmarkService.deleteById(id);

      return reply.status(204).send({
        message: "Bookmark deleted successfully",
      });
    },
  );

  fastify.delete<{ Params: ChapterIdType }>(
    "/chapter/:idChapter",
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

      await fastify.bookmarkService.deleteByUserAndChapter(userId, idChapter);

      return reply.status(204).send({
        message: "Bookmarks deleted successfully",
      });
    },
  );
}
