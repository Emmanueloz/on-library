import type { FastifyInstance } from "fastify";
import {
  ChapterIdParams,
  type ChapterIdParamsType,
} from "../../../schemas/chapters/params.ts";
import {
  UpdateChapterBodySchema,
  type UpdateChapterBody,
} from "../../../schemas/chapters/body.ts";

export default async function (fastify: FastifyInstance) {
  fastify.put<{
    Params: ChapterIdParamsType;
    Body: UpdateChapterBody;
  }>(
    "",
    {
      onRequest: [fastify.authenticate],
      schema: {
        tags: ["Chapters"],
        security: [{ bearerAuth: [] }],
        params: ChapterIdParams,
        body: UpdateChapterBodySchema,
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const { title, number, idSeries } = request.body;

      const chapter = await fastify.chaptersService.update(id, {
        title,
        number,
        idSeries,
      });

      return {
        message: "Update Chapter",
        data: chapter,
      };
    },
  );
}