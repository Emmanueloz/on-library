import type { FastifyInstance } from "fastify";
import {
  ChapterIdParams,
  type ChapterIdParamsType,
} from "../../../schemas/chapters/params.ts";

export default async function (fastify: FastifyInstance) {
  fastify.delete<{
    Params: ChapterIdParamsType;
  }>(
    "",
    {
      onRequest: [fastify.authenticate],
      schema: {
        tags: ["Chapters"],
        security: [{ bearerAuth: [] }],
        params: ChapterIdParams,
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      await fastify.chaptersService.delete(id);

      return {
        message: "Delete Chapter",
      };
    },
  );
}