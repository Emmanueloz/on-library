import type { FastifyInstance } from "fastify";
import {
  CreateBookmarkBody,
  type CreateBookmarkBodyType,
} from "../../schemas/bookmark/body.ts";

export default async function (fastify: FastifyInstance) {
  fastify.post<{ Body: CreateBookmarkBodyType }>(
    "/",
    {
      onRequest: [fastify.authenticate],
      schema: {
        tags: ["Bookmark"],
        body: CreateBookmarkBody,
        security: [{ bearerAuth: [] }],
      },
    },
    async (request, reply) => {
      const userId = request.user.id;
      const { idChapter, type, page } = request.body;

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

      const existing = await fastify.bookmarkService.findByPage(
        userId,
        idChapter,
        type,
        page,
      );

      if (existing) {
        return reply.status(409).send({ message: "Bookmark already exists" });
      }

      const bookmark = await fastify.bookmarkService.create(
        userId,
        idChapter,
        type,
        page,
      );

      return reply.status(201).send({
        message: "Bookmark created successfully",
        data: bookmark,
      });
    },
  );
}
