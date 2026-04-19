import type { FastifyInstance } from "fastify";
import {
  CreateChapterBodySchema,
  type CreateChapterBody,
} from "../../schemas/chapters/body.ts";

export default async function (fastify: FastifyInstance) {
  fastify.post<{
    Body: CreateChapterBody;
  }>(
    "/",
    {
      onRequest: [fastify.authenticate],
      schema: {
        tags: ["Chapters"],
        security: [{ bearerAuth: [] }],
        body: CreateChapterBodySchema,
      },
    },
    async (request, reply) => {
      const { title, number, idSeries } = request.body;

      const chapter = await fastify.chaptersService.create({
        title,
        number,
        idSeries,
      });

      return {
        message: "Create Chapter",
        data: chapter,
      };
    },
  );
}